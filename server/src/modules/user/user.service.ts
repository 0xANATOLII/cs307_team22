import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
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

  async validateUser(username: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? this._getUserDataWithoutPassword(user) : null;
  }

  async findByUsername(username: string): Promise<Omit<User, 'password'>> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this._getUserDataWithoutPassword(user);
  }

  async updatePrivacy(userId: string, isPrivate: boolean): Promise<Omit<User, 'password'>> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { privacy: isPrivate },
      { new: true },
    ).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this._getUserDataWithoutPassword(user);
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

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this._getUserDataWithoutPassword(updatedUser);
  }

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
}
