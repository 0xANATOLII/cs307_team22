import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return { message: 'User registered successfully', userId: user.username};
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    const user = await this.userService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      message: 'Login successful',
      userId: user.username,
    };
  }

  @Get('profile/:username')
  async getProfile(@Param('username') username: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      username: user.username,
      pfp: user.pfp,
      desc: user.description || 'No description available',
      privacy: user.privacy,
    };
  }

  @Patch('updateDescription')
  async updateDescription(
    @Body() body: { username: string; description: string },
  ) {
    const { username, description } = body;
    if (!description || !username) {
      throw new BadRequestException('Username and description are required');
    }

    const updatedUser = await this.userService.updateDescription(username, description);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return { message: 'Description updated successfully', description: updatedUser.description };
  }

   @Patch('updatePrivacy/:username')
  async updatePrivacy(
    @Param('username') username: string,
    @Body() body: { privacy: boolean },
  ) {
    const updatedUser = await this.userService.updatePrivacy(username, body.privacy);
    return {
      message: 'Privacy setting updated',
      privacy: updatedUser.privacy,
    };
  }

  @Post('requestPasswordReset')
  async requestPasswordReset(@Body() body: { email: string }) {
    const { email } = body;
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const userExists = await this.userService.findByEmail(email); // Implement findByEmail in your service
    if (!userExists) {
      throw new NotFoundException('Email not registered');
    }

    await this.userService.sendPasswordResetEmail(email);
    return { message: 'Password reset email sent if the email is registered' };
  }

  @Patch('resetPassword')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    const { token, newPassword } = body;
    if (!token || !newPassword) {
      throw new BadRequestException('Token and new password are required');
    }

    await this.userService.resetPassword(token, newPassword);
    return { message: 'Password has been reset successfully' };
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}