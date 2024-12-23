import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException, BadRequestException, NotFoundException, Query, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './user.model';
import { Types } from 'mongoose';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return { message: 'User registered successfully', userId: user.username};
  }

  @Delete('/deleteAccount')
  async deleteAccount(@Body('username') username: string, @Body('password') password: string): Promise<{ message: string }> {
    const isDeleted = await this.userService.deleteAccount(username, password);
    if (!isDeleted) {
      throw new HttpException('Invalid credentials or user not found', HttpStatus.UNAUTHORIZED);
    }
    return { message: 'Account successfully deleted' };
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
      followers: user.followers,
      following: user.following,
      tutorial: user.tutorial,
    };
  }

  @Patch('updateDescription')
  async updateDescription(
    @Body() body: { username: string; description: string },
  ) {
    const { username, description } = body;
    this.logger.log(username)

    if (!description || !username) {
      throw new BadRequestException('Username and description are required');
    }

    const updatedUser = await this.userService.updateDescription(username, description);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return { message: 'Description updated successfully', description: updatedUser.description };
  }

  @Patch('updatePfp')
  async updatePfp(
    @Body() body: { username: string; pfp: string },
  ) {
    const { username, pfp } = body;
    this.logger.log(username)

    if (!pfp || !username) {
      throw new BadRequestException('profile pic and description are required');
    }

    const updatedUser = await this.userService.updatePfp(username, pfp);
    if (!updatedUser) {
      throw new NotFoundException('User not foundddd');
    }

    return { message: 'Profile pic updated successfully' };
  }

  @Patch('updatePrivacy')
  async updatePrivacy(
    @Body() body: { username: string; privacy: boolean },

  ){
    const { username, privacy } = body;

    this.logger.log(username)
    this.logger.log(privacy)
    const updatedUser = await this.userService.updatePrivacy(username, privacy);
    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Privacy setting updated successfully' };
  }

  @Patch('updateTutorial')
  async updateTutorial(
    @Body() body: { username: string; tutorial: boolean },
  ) {
    const { username, tutorial } = body;
    this.logger.log(`Updating tutorial status for user: ${username} to: ${tutorial}`);
    if (username === undefined || tutorial === undefined) {
      throw new BadRequestException('Username and tutorial status are required');
    }
    const updatedUser = await this.userService.updateTutorial(username, tutorial);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return { message: 'Tutorial status updated successfully', tutorial: updatedUser.tutorial };
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
  async findOne(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.userService.findOne(id);
  }

 

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Get('search/:query')
  async searchUsers(@Param('query') query: string) {
    if (!query) {
      throw new BadRequestException('Query is required');
    }
    const users = await this.userService.searchUsers(query);
    return users.map((user: any) => ({
      id: user._id.toString(), // Use '_id' as defined in the User interface
      username: user.username,
      privacy: user.privacy,
    }));
  }

  @Get(':userId/recommended')
  async getRecommendedUsers(@Param('userId') userId: string) {
    const users = await this.userService.getRecommendedUsers();

    return users.map((user: any) => ({
      id: user._id.toString(),
      username: user.username,
      privacy: user.privacy,
    }));
  }

  @Get(':userId/requests')
  async getFollowRequests(@Param('userId') userId: string) {  
    
    const followRequests = await this.userService.getFollowRequests(userId);
    this.logger.log(followRequests); 
    if (!followRequests || followRequests.length === 0) {
      return []; // Return an empty array if no follow requests
    }
  
    return followRequests;
  }

  @Get('id/:username')
  async getUserId(@Param('username') username: string) {
    const userId = await this.userService.getUserIdByUsername(username);
    return { userId };
  }

  @Post('request')
  async sendFollowRequest(
    @Body('userId') userId: string,
    @Body('targetUserId') targetUserId: string
  ) {
    return this.userService.sendFollowRequest(userId, targetUserId);
  }

  @Post('acceptRequest')
  async acceptFollowRequest(
    @Body('userId') userId: string,
    @Body('targetUserId') targetUserId: string
  ) {
    return this.userService.acceptFollowRequest(userId, targetUserId);
  }

  @Post('reject')
  async rejectFollowRequest(
    @Body('userId') userId: string,
    @Body('targetUserId') targetUserId: string
  ) {
    return this.userService.rejectFollowRequest(userId, targetUserId);
  }

  @Post(':userId/unfollow')
  async unfollowUser(
    @Param('userId') userId: string,
    @Body('targetUserId') targetUserId: string,
  ) {
    return this.userService.unfollowUser(userId, targetUserId);
  }

  @Post('follow')
  async followUser(
    @Body('userId') userId: string,
    @Body('targetUserId') targetUserId: string,
  ) {
    return this.userService.followUser(userId, targetUserId);
  }
  
  @Get(':userId/following')
  async getFollowing(@Param('userId') userId: string) {
    return await this.userService.getFollowing(userId);
  }

  @Get('/details/:userId')
  async getUserDetails(@Param('userId') userId: string) {
    this.logger.log(`Received request for user details with userId: ${userId}`);

    if (!userId) {
      this.logger.error(`Missing 'userId' `);
      throw new BadRequestException('User ID is required');
    }

    try {
      this.logger.log(`Parsed user IDs: ${JSON.stringify(userId)}`);

      // Fetch user details if IDs are valid
      const user = await this.userService.getPFPandName(userId);

      return { user };
    } catch (error) {
      this.logger.error(`Failed to fetch user details: ${error.message}`, error.stack);
      throw error;
    }
  }
  @Get('/allDetails/:userId')
  async getAllUserDetails(@Param('userId') userId: string) {
    this.logger.log(`Received request for all user details with userId: ${userId}`);

    if (!userId) {
      this.logger.error(`Missing 'userId' `);
      throw new BadRequestException('User ID is required');
    }

    try {
      this.logger.log(`Parsed user IDs: ${JSON.stringify(userId)}`);

      // Fetch user details if IDs are valid
      const user = await this.userService.getProfile(userId);

      return { user };
    } catch (error) {
      this.logger.error(`Failed to fetch user details: ${error.message}`, error.stack);
      throw error;
    }
  }
  @Post('wishlist')
  async addToWishlist(
    @Body('username') username: string,
    @Body('monument') monument: { _id: string; [key: string]: any },
  ) {
    console.log('addToWishlist called with:', { username, monument });
    return await this.userService.addToWishlistByUsername(username, monument);
  }

  @Get(':username/wishlist')
  async getWishlist(@Param('username') username: string) {
    return await this.userService.getWishlistByUsername(username);
  }

  @Post('wishlist/remove')
  async removeFromWishlist(
    @Body('username') username: string,
    @Body('monument') monumentId: string,
  ) {
    return await this.userService.removeFromWishlistByUsername(username, monumentId);
  }


  @Get("/badges/:username")
  async getbadgesByUser(@Param('username') username: string){

    return this.userService.getBadgesByUser(username)
 
  }
  @Get("/badge/:username/:badgeId")
  async getBadgeByLink(@Param('username') username: string,@Param('badgeId') badgeId: string){
   
    return this.userService.getBadgeByLink(username,badgeId)
 
  }

  @Get("pfp/:username")
  async getUserProfilePic(@Param('username') username: string){
   
    return this.userService.getPfp(username)
 
  }
}
