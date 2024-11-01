import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { Badge, BadgeDocument } from './schema/badge.schema';
import { User, UserDocument } from '../user/schema/user.schema';

@Injectable()
export class BadgeService {
  constructor(
    @InjectModel(Badge.name) private badgeModel: Model<BadgeDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // Create a new badge
  async create(createBadgeDto: CreateBadgeDto): Promise<Badge> {

    try{
    const user_= this.userModel.findOne({where:{id:createBadgeDto.userId}})

    if(!user_)
      throw new BadRequestException("This user doesnt exist !"); 

    console.log(createBadgeDto)
    const newBadge =  new this.badgeModel({

      name: createBadgeDto.name,
      picture:createBadgeDto.picture,
      picturef:createBadgeDto.picturef,
      location:createBadgeDto.location,
      userId: createBadgeDto.userId,
      monumentId:null,
      comments: [],
      likes:[]

    })

    const savedBadge = await newBadge.save();

    return savedBadge


  }catch(e){
    throw new BadRequestException(e);
  }



    // Find the user by their username instead of by _id
    /*const user = await this.userModel.findOne({ username: createBadgeDto.username }).exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Now you have the userId (ObjectId), use it in badge creation
    const newBadge = new this.badgeModel({
      name: createBadgeDto.name,
      picture: createBadgeDto.picture,
      picturef: createBadgeDto.picturef,
      location: createBadgeDto.location,
      userId: user._id,  // Use the ObjectId from the user document
      monumentId: createBadgeDto.monumentId || 'home',  // Use default monumentId if not provided
    });

    return await newBadge.save();*/
  }

  // Fetch all badges
  async findAll(): Promise<Omit<Badge, '_id'>[]> {
    const badges = await this.badgeModel.find().populate('userId').exec();
    return badges.map(badge => this._getBadgeDataWithoutId(badge));
  }

  // Fetch a single badge by its ID
  async findOne(id: string): Promise<Omit<Badge, '_id'>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid badge ID format');
    }

    const badge = await this.badgeModel.findById(id).exec();
    if (!badge) {
      throw new NotFoundException(`Badge with ID ${id} not found`);
    }
    return this._getBadgeDataWithoutId(badge);
  }

  // Update a badge by its ID
  async update(id: string, updateBadgeDto: UpdateBadgeDto): Promise<Omit<Badge, '_id'>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid badge ID format');
    }

    const updatedBadge = await this.badgeModel.findByIdAndUpdate(id, updateBadgeDto, { new: true }).exec();
    if (!updatedBadge) {
      throw new NotFoundException(`Badge with ID ${id} not found`);
    }
    return this._getBadgeDataWithoutId(updatedBadge);
  }

  // Remove a badge by its ID
  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid badge ID format');
    }

    const result = await this.badgeModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Badge with ID ${id} not found`);
    }
  }

  // Search badges by name or other criteria
  async searchBadges(query: string): Promise<Omit<Badge, '_id'>[]> {
    const badges = await this.badgeModel.find({
      name: { $regex: query, $options: 'i' } // Case-insensitive search by badge name
    }).exec();
    return badges.map(badge => this._getBadgeDataWithoutId(badge));
  }

  // Private helper to remove '_id' or any unwanted fields
  private _getBadgeDataWithoutId(badge: BadgeDocument): Omit<Badge, '_id'> {
    const { _id, ...badgeWithoutId } = badge.toObject(); // Omit the _id field
    return badgeWithoutId;
  }
}
