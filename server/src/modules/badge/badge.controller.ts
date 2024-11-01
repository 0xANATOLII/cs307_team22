import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException, Query, UseInterceptors } from '@nestjs/common';
import { BadgeService } from './badge.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { Types } from 'mongoose';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { UploadedFiles, Res} from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';



//6716cadf0fa5c38f7d74d4d0
@Controller('badge')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'picture', maxCount: 1 },
    { name: 'picturef', maxCount: 1 }
  ], {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, `${uniqueSuffix}-${file.originalname}`);
      }
    })
  }

))
  uploadFile(@UploadedFiles() files, @Body() createBadgeDto:CreateBadgeDto ) {
    console.log("CONTROLER")
    console.log(files)
    const image1Path = files.picture[0].path;
    const image2Path = files.picturef[0].path;

    console.log("Path "+image1Path)
    console.log("Path "+image2Path)
    createBadgeDto = {
      ...createBadgeDto,
      picture:image1Path,
      picturef:image2Path,
    }

    console.log("CONTROLLER : "+createBadgeDto)

    
    return this.badgeService.create(createBadgeDto) ;

  }
  /*
  @Post()
  @UseInterceptors(FileFieldsInterceptor(
    [
      { name: 'image1', maxCount: 1 },
      { name: 'image2', maxCount: 1 }
    ], 
    {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          callback(null, `${uniqueSuffix}-${file.originalname}`);
        }
      })
    }
  ))
  uploadFile(@UploadedFiles() files, @Body() body) {
    const image1Path = files.image1[0].path;
    const image2Path = files.image2[0].path;
    const { description } = body;

    // Here you can save image paths and description to your database.

    return { message: 'Files uploaded successfully!', image1Path, image2Path, description };
  }*/
  
  @Post()
async create(@Body() createBadgeDto: CreateBadgeDto) {
  const badge = await this.badgeService.create(createBadgeDto);
  return { message: 'Badge created successfully', badge };
}




  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const badge = await this.badgeService.findOne(id);
    if (!badge) {
      throw new NotFoundException('Badge not found');
    }
    return badge;
  }

  @Get()
  async findAll() {
    const badges = await this.badgeService.findAll();
    return badges;
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateBadgeDto: UpdateBadgeDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const updatedBadge = await this.badgeService.update(id, updateBadgeDto);
    if (!updatedBadge) {
      throw new NotFoundException('Badge not found');
    }
    return { message: 'Badge updated successfully', updatedBadge };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const result = await this.badgeService.remove(id);
    if (result === null) {
      throw new NotFoundException('Badge not found');
    }
    return { message: 'Badge removed successfully' };
  }

  @Get('search')
  async searchBadges(@Query('query') query: string) {
    if (!query) {
      throw new BadRequestException('Query is required');
    }

    const badges = await this.badgeService.searchBadges(query);
    return badges.map((badge: any) => ({
      id: badge._id,
      name: badge.name,
      location: badge.location,
    }));
  }
}
