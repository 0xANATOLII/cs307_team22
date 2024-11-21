import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Injectable, NotFoundException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { MailService } from '../mail/mail.service';
import { Types } from 'mongoose';
import { Badge, BadgeDocument } from '../badge/schema/badge.schema';



@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
  private mailService: MailService,
  @InjectModel(Badge.name) private badgeModel: Model<BadgeDocument>,
) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    try {
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();
      return this._getUserDataWithoutPassword(savedUser);
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Username or email already exists');
      }
      throw error;
    }
  }

  async deleteAccount(username: string, password: string): Promise<boolean> {
    // Find the user by username
    const user = await this.userModel.findOne({ username });
    if (!user) {
      return false; // User not found
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return false; // Password is incorrect
    }

      // Soft delete by setting deletedAt
    user.deletedAt = new Date();
    await user.save();
    return true;
  }

  async validateUser(username: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      return null;
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null; // Password is incorrect
    }
        // Check for soft delete
        if (user.deletedAt) {
         // const gracePeriodDays = 30;
          const expirationDate = new Date(user.deletedAt.getTime() + 30 * 1000); //make grace period 30 seconds for demo purposes
    
          if (new Date() > expirationDate) {
            await this.userModel.deleteOne({ username });
            return null; // Account permanently deleted
          }
    
          // Reactivate account
          user.deletedAt = null;
          await user.save();
        }
    
        return user;
  }

  async findByUsername(username: string): Promise<Omit<User, 'password'>> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this._getUserDataWithoutPassword(user);
  }

  async updatePrivacy(username: string, isPrivate: boolean): Promise<Omit<User, 'password'>> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update the privacy field
    user.privacy = isPrivate;
    await user.save();

    // Return the updated user without the password field
    return user;
  }

  async updateDescription(username: string, description: string): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { username },
      { description },
      { new: true }, // Return the updated document
    );

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user;
  }

  async updatePfp(username: string, pfp: string): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { username },
      { pfp },
      { new: true }, // Return the updated document
    );

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      // Optional: Log this to avoid giving hints about user existence
      return;
    }
    
    // Generate a unique reset token and its expiration
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 1); // Token valid for 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = tokenExpires;
    await user.save();

    // Send email (configure your email service here)
    // Example: Use a real email service in production
    const resetUrl = `http://localhost:8081/reset-password/${resetToken}`;
    console.log(`Reset token for ${email}: ${resetUrl}`);
    await this.mailService.sendMail(
      email,
      'Password Reset Request',
      `Please use this link to reset your password: ${resetUrl}`,
      `<p>Please use this link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    // Hash the new password and save it
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined; // Clear the reset token
    user.resetPasswordExpires = undefined;
    await user.save();
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userModel.find().exec();
    return users.map(user => this._getUserDataWithoutPassword(user));
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this._getUserDataWithoutPassword(user);
  }
/*
  async update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this._getUserDataWithoutPassword(updatedUser);
  }
*/
  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
 
  private _getUserDataWithoutPassword(user: UserDocument): Omit<User, 'password'> {
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async searchUsers(query: string): Promise<Omit<User, 'password'>[]> {
    const users = await this.userModel.find({
      username: { $regex: query, $options: 'i' } // Case-insensitive search
    }).exec();
    return users.map(user => this._getUserDataWithoutPassword(user)); // Ensure to return without password
  }

  async getUserIdByUsername(username: string): Promise<string> {
    const user = await this.userModel.findOne({ username }).select('_id').exec();
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user._id.toString();
  }

  async sendFollowRequest(userId: string, targetUserId: string): Promise<any> {
    const targetUser = await this.userModel.findById(targetUserId);
    if (!targetUser) throw new NotFoundException('Target user not found');
  
    // Add userId to target user's follow requests
    if (!targetUser.followRequests.includes(userId)) {
      targetUser.followRequests.push(userId);
      await targetUser.save();
    }
    return { message: 'Follow request sent successfully' };
  }

  async acceptFollowRequest(userId: string, targetUserId: string): Promise<any> {
    const user = await this.userModel.findById(userId);
    const targetUser = await this.userModel.findById(targetUserId);
    if (!user || !targetUser) throw new NotFoundException('User not found');
  
    // Add each other as friends
    if (!user.followers.includes(targetUserId)) user.followers.push(targetUserId);
    if (!targetUser.following.includes(userId)) targetUser.following.push(userId);

    // Remove from follow requests
    user.followRequests = user.followRequests.filter(req => req !== targetUserId);
    await user.save();
    await targetUser.save();
  
    return { message: 'Follow request accepted' };
  }

  async rejectFollowRequest(userId: string, targetUserId: string): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
  
    // Remove the request without adding as friends
    user.followRequests = user.followRequests.filter(req => req !== targetUserId);
    await user.save();
  
    return { message: 'Follow request rejected' };
  }

  async followUser(userId: string, targetUserId: string): Promise<any> {
    const user = await this.userModel.findById(userId);
    const targetUser = await this.userModel.findById(targetUserId);
    if (!user || !targetUser) throw new NotFoundException('User not found');
  
    // Add each other as friends
    if (!user.following.includes(targetUserId)) user.following.push(targetUserId);
    if (!targetUser.followers.includes(userId)) targetUser.followers.push(userId);

    // Remove from follow requests
    user.followRequests = user.followRequests.filter(req => req !== targetUserId);
    await user.save();
    await targetUser.save();
  
    return { message: 'User followed' };
  }
  
  async unfollowUser(userId: string, targetUserId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    const targetUser = await this.userModel.findById(targetUserId);
  
    if (!user || !targetUser) {
      throw new NotFoundException('User not found');
    }
    
    // Remove targetUserId from user's following list
    user.following = user.following.filter(id => id !== targetUserId);
    await user.save();
    
    // Remove userId from targetUser's followers list
    targetUser.followers = targetUser.followers.filter(id => id !== userId);
    await targetUser.save();
    
    return user;
  }
  

  async getFollowing(userId: string): Promise<string[]> {
    const user = await this.userModel.findById(userId).select('following').exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.following; // Returns array of user IDs being followed as strings
  }

  async getRecommendedUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userModel.find().select('-password').limit(30).exec();
    return users;
  }


  async getFollowRequests(userId: string): Promise<{ id: string; username: string; privacy: boolean }[]> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Retrieve details for each user in followRequests
    const followRequests = await this.userModel
      .find({ _id: { $in: user.followRequests } })
      .select('username privacy')
      .exec();
    // Map to the desired response structure
    return followRequests.map(followRequest => ({
      id: followRequest._id.toString(),
      username: followRequest.username,
      privacy: followRequest.privacy,
    }));
  }

  async getPFPandName(userId: string): Promise<{ username: string; pfp: string }> {

    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID format');
    }

    try {
      const user = await this.userModel
        .findById(userId, 'username pfp') // Select only the fields you need
        .exec();

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      return { username: user.username, pfp: user.pfp };
    } catch (error) {
      throw error;
    }
  }



  async getBadgesByUser(username:string){
    const user = await this.userModel.findOne({username:username})
    if(! user){
      throw new BadRequestException("This account doesnt exists !")
    }

    const userBadges =  await this.badgeModel.find({ userId: user.id }).exec();  
    if (!userBadges){
      return "No badges Yet!";
    }else{
      return userBadges;
    }
  }


  async getBadgeByLink(username:string,badgeId:string){

    const user = await this.userModel.findOne({username:username});
    if(!user)
      throw new BadRequestException("This user doesnt exist!")
    if(user.privacy)
      throw new BadRequestException("This user is private. Became they friend to see the badge!")

    console.log(badgeId)
    const badge = await this.badgeModel.findOne({_id:badgeId})
    
    
    if(!badge)
      throw new BadRequestException("This badge doesnt exist !")    

    if(badge.userId!=user.id)
      throw new BadRequestException("Invalid link")

    return badge

  }

  async getPfp(username:string){
    
    const user = await this.userModel.findOne({ username:username }).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }



    if(user.pfp == undefined || user.pfp == null || user.pfp =="")
    return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnIAAAJyCAIAAADPTLrCAAAAAXNSR0IArs4c6QAAAFBlWElmTU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAACcqADAAQAAAABAAACcgAAAAAqv3aAAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgoZXuEHAABAAElEQVR4Aeydd7wdRd3/9ZGSTnqvkIApBBASIEhXmoAQQJo/ShApLxEBUYgoPEAEkd47UkMogZiEmpAgEkoQ0klvpPdGAqgPv/fNNwybc88595Q95+zufPaPc+fuzs7OvGd2Pvud+t2vv/76OzpEQAREQAREQATCIPA/YQSiMERABERABERABKoISFZVDkRABERABEQgNAKS1dBQKiAREAEREAERkKyqDIiACIiACIhAaAQkq6GhVEAiIAIiIAIiIFlVGRABERABERCB0AhIVkNDqYBEQAREQAREQLKqMiACIiACIiACoRGQrIaGUgGJgAiIgAiIgGRVZUAEREAEREAEQiMgWQ0NpQISAREQAREQAcmqyoAIiIAIiIAIhEZAshoaSgUkAiIgAiIgApJVlQEREAEREAERCI2AZDU0lApIBERABERABCSrKgMiIAIiIAIiEBoByWpoKBWQCIiACIiACEhWVQZEQAREQAREIDQCktXQUCogERABERABEZCsqgyIgAiIgAiIQGgEJKuhoVRAIiACIiACIiBZVRkQAREQAREQgdAISFZDQ6mAREAEREAERECyqjIgAiIgAiIgAqERkKyGhlIBiYAIiIAIiIBkVWVABERABERABEIjIFkNDaUCEgEREAEREAHJqsqACIiACIiACIRGQLIaGkoFJAIiIAIiIAKSVZUBERABERABEQiNgGQ1NJQKSAREQAREQAQkqyoDIiACIiACIhAaAclqaCgVkAiIgAiIgAhIVlUGREAEREAERCA0ApLV0FAqIBEQAREQARGQrKoMiIAIiIAIiEBoBCSroaFUQCIgAiIgAiIgWVUZEAEREAEREIHQCEhWQ0OpgERABERABERAsqoyIAIiIAIiIAKhEZCshoZSAYmACIiACIiAZFVlQAREQAREQARCIyBZDQ2lAhIBERABERAByarKgAiIgAiIgAiERkCyGhpKBSQCIiACIiACklWVAREQAREQAREIjYBkNTSUCkgEREAEREAEJKsqAyIgAiIgAiIQGgHJamgoFZAIiIAIiIAISFZVBkRABERABEQgNAKS1dBQKiAREAEREAERkKyqDIiACIiACIhAaAQkq6GhVEAiIAIiIAIiIFlVGRABERABERCB0AhIVkNDqYBEQAREQAREQLKqMiACFSbw9ddfVzgGerwIiEB4BLYJLyiFJAIikBMBdNSk9Lvf/S6O//73v//+979x8PvVV199+eWXODj5f//3fzj+85//cGa77bbD8/8EDv7lqFu37vbbb1+rVi1+t9lmG87kFAN5EgERKBkByWrJ0CpgEQgQ+GLzgUYuX7588eLFXFn2zbFhw4alS5cuXLiQE/PmzUNNOaqE9+uvcQTCSOOsV69ei2+OlpuPVq1a8bd27doNvznq1Kmz7bbbSnTT4NMpESgBgaqP5RIEqyBFwF8CaCEailhu2rRp/vz5c+bMWbRoEao5bty4sWPHYno6NJsNzi32pb2J3/ve9zBMzQBFC7FO8Wze+DWhrVLdb3R37dq1SDVGLWcs2KDBamGecMIJ7du379Chg/2a2mLgIr1Bzy5WcoiACBRDQLJaDD3dKwJbCNBmi44uWLAAEZ0+ffqECRPee+89HFw2OcSBRmJc1q9fn5Zba+O1380q+X+47UAL7eAW59jymK3/EDI2KErMYc3DnOHAzXnak9F1fjdu3OhElwAQ1H333XfPPffs0qVL165dmzRpgoGL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qKwfhRh1UzE/CUhAAmMkQO/N3C8+W5bGWMz4s54GWd24cSNz8V1WamqXhmEJSEAC9RMog6Lly5fXb+0AC5uX1auuumr9+vXMxTN7UAasA27YUxKQgAQkUCEB+nCUNTuBKzRveJPallWm4K+++mrmDdg8xhay7iC1Gx4ehyklIAEJSGBJCKCpKdfR6pLw317oBRdcgIIyCcx/vs2AtdTN9kSGJCABCUigbgJ03Uw9YuOxxx5bt6U7sK7t0So3d/LJJ1933XVffPEFI9fsItvBHXtaAhKQgAQqI8DoCFn9+++/r7zySncCL3HlMAN86623YgTzBt3lVcesS1wxFi8BCUhgIQTowP/5559bbrnFncALwTaGtMjqpZdeetFFF3311VdIqWo6BsZmKQEJSGDsBOi9WctjtLr77ruPvbBxFtD8JDBwmDF44IEHqJLVq1fzssMrj+I6zjZj3hKQgARGRoDpX/rt4447bsOGDS+88MJ+++03sqyXKKPmZRUFpVbOO++8hx9++PPPPz/mmGM2b95MpOusS9SiLFYCEpDAsAT4OQ3/3/PMM8/86KOP7rnnnikYqnLnM5o0LIC601E9d91116OPPnriiSeir3xbEsfdTc0N1o1f6yQgAQksgAA9M+MfxqZsU2Kcev/999955509H/ZZQHY1JZ0eWYXqb7/9dvvttz/77LPMJ/z4449btmzJj1lV1pqanLZIQAK7OgH6ZBbv9t9//x9++IGO+qWXXrrmmmsYGiG0uNbpND8J3K0AXnwef/xxXnkYrR5yyCEHHHAAC+BUkqutXUqGJSABCSwtAfrnv/76i32mt91229dff42mbt26FVldWqtGVfpUjVYzq8Bn95988sk77riDejrppJP4fTGTDCyJg8xh66jajflIQAISGJ7A7Ch05sOEfGiWQepnn33GjzhefPHFSy65ZI899hg+nyZSTpusoqnZnP3hhx8++OCDTzzxBCusRxxxBMPWX3/9ld1MLI8rrk00TY2UgASmiQDyefDBBzOVyE3de++9LNgdeOCBdMhTMOvbU01TJavl3phe2HvvvZHSN95447HHHnvuuecYsB5++OEstf78889Ib0lpQAISkIAExkEgeskwht6YJTm+hcdoleHpfffdd/bZZyOofMudYc84il7aPJuX1b5DTyKpMGQ1n+34+OOPmRZ+5JFHGMhS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AjUTUFZrrh1tk4AEJCCBxgj8v6+BNGa75kpAAhKQgAQqI6CsVlYhmiMBCUhAAi0TUFZbrj1tl4AEJCCByggoq5VViOZIQAISkEDLBJTVlmtP2yUgAQlIoDICymplFaI5EpCABCTQMgFlteXa03YJSEACEqiMgLJaWYVojgQkIAEJtExAWW259rRdAhKQgAQqI6CsVlYhmiMBCUhAAi0TUFZbrj1tl4AEJCCByggoq5VViOZIQAISkEDLBJTVlmtP2yUgAQlIoDICymplFaI5EpCABCTQMgFlteXa03YJSEACEqiMgLJaWYVojgQkIAEJtExAWW259rRdAhKQgAQqI6CsVlYhmiMBCUhAAi0TUFZbrj1tl4AEJCCByggoq5VViOZIQAISkEDLBJTVlmtP2yUgAQlIoDICymplFaI5EpCABCTQMgFlteXa03YJSEACEqiMgLJaWYVojgQkIAEJtExAWW259rRdAhKQgAQqI6CsVlYhmiMBCUhAAi0TUFZbrj1tl4AEJCCByggoq5VViOZIQAISkEDLBJTVlmtP2yUgAQlIoDICymplFaI5EpCABCTQMgFlteXa03YJSEACEqiMgLJaWYVojgQkIAEJtExAWW259rRdAhKQgAQqI6CsVlYhmiMBCUhAAi0TUFZbrj1tl4AEJCCByggoq5VViOZIQAISkEDLBJTVlmtP2yUgAQlIoDICymplFaI5EpCABCTQMgFlteXa03YJSEACEqiMgLJaWYVojgQkIAEJtExAWW259rRdAhKQgAQqI6CsVlYhmiMBCUhAAi0TUFZbrj1tl4AEJCCByggoq5VViOZIQAISkEDLBJTVlmtP2yUgAQlIoDICymplFaI5EpCABCTQMgFlteXa03YJSEACEqiMgLJaWYVojgQkIAEJtExAWW259rRdAhKQgAQqI6CsVlYhmiMBCUhAAi0TUFZbrj1tl4AEJCCByggoq5VViOZIQAISkEDLBJTVlmtP2yUgAQlIoDIC/wdKA1iHpP9SeAAAAABJRU5ErkJggg==`
  

    return user.pfp

  }

  async getProfile(userId: string): Promise<{ username: string; pfp: string; followers: string[]; following: string[]; description: string; badgeIds: string[]  }> {

    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID format');
    }

    try {
      const user = await this.userModel
        .findById(userId, 'username pfp followers following description badgeIds') // Select only the fields you need
        .exec();

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      return { username: user.username, pfp: user.pfp, followers: user.followers, following: user.following, description: user.description, badgeIds: user.badgeIds };
    } catch (error) {
      throw error;
    }
  }

  async addToWishlistByUsername(username: string, monument: { _id: string; [key: string]: any }): Promise<string[]> {
    const userId = await this.getUserIdByUsername(username);
  
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    console.log("mon id:", monument._id)
    const monumentId = monument._id;
  
    if (user.wishlist.includes(monumentId)) {
      throw new ConflictException('Monument already in wishlist');
    }
  
    user.wishlist.push(monumentId);
    await user.save();
  
    return user.wishlist;
  }

  async getWishlistByUsername(username: string): Promise<string[]> {
    const userId = await this.getUserIdByUsername(username);
  
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  
    return user.wishlist;
  }
  async removeFromWishlistByUsername(username: string, monumentId: string): Promise<string[]> {
    // Fetch the user ID by their username
    const userId = await this.getUserIdByUsername(username);
  
    // Fetch the user from the database
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  
    // Check if the monument is in the wishlist
    if (!user.wishlist.includes(monumentId)) {
      throw new ConflictException('Monument is not in the wishlist');
    }
  
    // Remove the monument from the wishlist
    user.wishlist = user.wishlist.filter(id => id !== monumentId);
  
    // Save the updated user
    await user.save();
  
    // Return the updated wishlist
    return user.wishlist;
  }  
}

