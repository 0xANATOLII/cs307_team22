import { IsString, IsEmail, IsOptional, IsDateString } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    username: string;
  
    @IsString()
    @IsOptional()
    name?: string;
  
    @IsString()
    @IsOptional()
    surname?: string;
  
    @IsDateString()
    @IsOptional()
    dob?: Date;
  
    @IsString()
    @IsOptional()
    country?: string;
  
    @IsString()
    @IsOptional()
    pfp?: string;

}
