import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException, Query, Logger } from '@nestjs/common';
import { BadgeService } from './badge.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { Types } from 'mongoose';

@Controller('badge')
export class BadgeController {
  private readonly logger = new Logger(BadgeController.name);
  constructor(private readonly badgeService: BadgeService) {}

  @Post('create')
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
    }));
  }
}
