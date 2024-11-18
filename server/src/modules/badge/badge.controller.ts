import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException, Query, UseInterceptors,Logger } from '@nestjs/common';

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



@Controller('badge')
export class BadgeController {
  private readonly logger = new Logger(BadgeController.name);
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
    this.logger.debug(`Deleting badge with ID: ${id}`);
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
      userId: badge.userId,
    }));
  }

  @Get(':badgeId/comments')
  async getBadgeComments(@Param('badgeId') badgeId: string) {
    this.logger.log(`Fetching comments for badge ID: ${badgeId}`);
    try {
      const comments = await this.badgeService.findCommentsByBadgeId(badgeId);
      if (!comments) {
        this.logger.warn(`No comments found for badge ID: ${badgeId}`);
        throw new NotFoundException(`Comments for badge ID ${badgeId} not found`);
      }
      return comments;
    } catch (error) {
      this.logger.error(`Error fetching comments for badge ID ${badgeId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Post(':badgeId/comment')
  async addComment(
    @Param('badgeId') badgeId: string,
    @Body() commentDto: { userId: string; commentText: string ; username: string;}
  ) {
    this.logger.log(`Adding comment to badge ID: ${badgeId}`);
    try {
      const updatedBadge = await this.badgeService.addCommentToBadge(badgeId, commentDto);
      return { message: 'Comment added successfully', updatedBadge };
    } catch (error) {
      this.logger.error(`Error adding comment to badge ID ${badgeId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Post(':badgeId/like')
  async likeBadge(
    @Param('badgeId') badgeId: string,
    @Body('userId') userId: string,
  ) {
    return this.badgeService.addLikeToBadge(badgeId, userId);
  }

  @Delete(':badgeId/unlike')
  async unlikeBadge(
    @Param('badgeId') badgeId: string,
    @Body('userId') userId: string,
  ) {
    this.logger.debug(`Attempting to unlike badge with ID: ${badgeId}, by user ID: ${userId}`);
    try {
      const updatedBadge = await this.badgeService.unlikeBadge(badgeId, userId);
      return {
        message: 'Badge unliked successfully',
        badge: updatedBadge,
      };
    } catch (error) {
      this.logger.error(`Error unliking badge ID ${badgeId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete(':badgeId/comment/:commentId')
  async deleteComment(
    @Param('badgeId') badgeId: string,
    @Param('commentId') commentId: string,
  ) {
    this.logger.log(`Deleting comment with ID: ${commentId} from badge ID: ${badgeId}`);
    try {
      const updatedBadge = await this.badgeService.deleteCommentFromBadge(badgeId, commentId);
      return { message: 'Comment deleted successfully', updatedBadge };
    } catch (error) {
      this.logger.error(`Error deleting comment ID ${commentId} from badge ID ${badgeId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('recent/:userId')
async getRecentBadges(@Param('userId') userId: string) {
  this.logger.log(`Received request to fetch recent badges for user ID: ${userId}`);

  try {
    const recentBadges = await this.badgeService.findRecentBadgesByUserId(userId);
    this.logger.log(`Successfully fetched ${recentBadges.length} recent badge(s) for user ID: ${userId}`);
    return { recentBadges };
  } catch (error) {
    this.logger.error(`Error fetching recent badges for user ID: ${userId} - ${error.message}`, error.stack);
    throw error; // Re-throw the error to ensure proper error handling in the application
  }
}



}
