import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/register-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {  
  constructor(
    private userService:UserService,
    private jwtService:JwtService,
  ){}
  


  async register(createAuthDto: CreateAuthDto) {

    const user:CreateUserDto = {
          username:createAuthDto.username,
          email:createAuthDto.email,
          password:createAuthDto.password
        }


    const newUser = await this.userService.create(user)

    const payload ={sub: newUser.id,email:newUser.email}

    return {
      access_token:await this.jwtService.signAsync(payload,{
        secret:process.env.JWT_SECRET
      }),

      userId:newUser.id,
    }

  }
  async login(login: LoginAuthDto) {

    if(!login)
      throw new BadRequestException("Invalid credentials!")

    const payload = await this.userService.validate(login)
    return{
      access_token:await this.jwtService.signAsync(payload,{
        secret:process.env.JWT_SECRET
      }),
      userId:payload.sub
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
