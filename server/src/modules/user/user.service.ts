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



@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
  private mailService: MailService,
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
