import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException, BadRequestException, NotFoundException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuards } from 'src/middleware/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuards)
  @Get()
  async findAll(){
    return this.userService.findAll()
  }
//SHOW PROFILE TO ANYONE
  @Get('/:username')
  async findProfile(@Param('username') username:string){
    return this.userService.findUsersByUsername(username)
  }

  @UseGuards(AuthGuards)
  @Get('/:id')
  async findById(@Param('id') id:string){
    return this.userService.find(id)
  }


  @UseGuards(AuthGuards)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updUser: UpdateUserDto) {
    return await this.userService.update(id,updUser);
  }

  @UseGuards(AuthGuards)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }


  @Post('requestPasswordReset/:email')
  async requestPasswordReset(@Param('email') email: string) {
    return  this.userService.sendPasswordResetEmail(email)
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

/*
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  

  @Get('/:username')
  async getProfile(@Param('username') username: string) {
    return  await this.userService.findUsersByUsername(username);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updUser: UpdateUserDto) {
    return await this.userService.update(id,updUser);
  }


  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
 
  @Post('requestPasswordReset/:email')
  async requestPasswordReset(@Param('email') email: string) {
    return  this.userService.sendPasswordResetEmail(email)
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
*/
}