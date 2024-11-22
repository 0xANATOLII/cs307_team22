import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { Badge, BadgeDocument } from './schema/badge.schema';
import { User, UserDocument } from '../user/schema/user.schema';

@Injectable()
export class BadgeService {
  private readonly logger = new Logger(BadgeService.name);
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


    const newBadge =  new this.badgeModel({

      name: createBadgeDto.name,
      picture:createBadgeDto.picture,
      picturef:createBadgeDto.picturef,
      location:createBadgeDto.location,
      userId: createBadgeDto.userId,
      monumentId:createBadgeDto.monumentId,
      username:createBadgeDto.username,
      comments: [],
      likes:[]

    })

    const savedBadge = await newBadge.save();

    return savedBadge


  }catch(e){
    console.log(e)
    throw new BadRequestException(e);
  }
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
      username: user.username,
      monumentId: createBadgeDto.monumentId || 'home',  // Use default monumentId if not provided
    });

    return await newBadge.save();*/
  
    private constructImageUris(badge: BadgeDocument, baseUrl: string): any {
      const badgeObj = badge.toObject(); // Convert Mongoose document to plain JS object
      return {
        ...badgeObj,
        pictureUri: `${baseUrl}/uploads/${badgeObj.picture}`,
        picturefUri: `${baseUrl}/uploads/${badgeObj.picturef}`,
      };
    }
  // Fetch all badges
  async findAll(req: any): Promise<any[]> {
    const badges = await this.badgeModel.find().exec();
    const baseUrl = `${req.protocol}://${req.get('host')}`;
  
    return badges.map((badge) => this.constructImageUris(badge, baseUrl));
  }
  

  // Fetch a single badge by its ID
  async findOne(id: string, req: any): Promise<any> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid badge ID format');
    }
  
    const badge = await this.badgeModel.findById(id).exec();
    if (!badge) {
      throw new NotFoundException(`Badge with ID ${id} not found`);
    }
  
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return this.constructImageUris(badge, baseUrl);
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
    this.logger.debug(`Service layer - Removing badge with ID: ${id}`);
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

  async findCommentsByBadgeId(badgeId: string) {
    if (!Types.ObjectId.isValid(badgeId)) {
      throw new NotFoundException('Invalid badge ID format');
    }
  
    const badge = await this.badgeModel.findById(badgeId, 'comments').populate('comments.userId', 'username').exec();
    if (!badge) {
      throw new NotFoundException(`Badge with ID ${badgeId} not found`);
    }
    return badge.comments; // Return only the comments array
  }

  async addCommentToBadge(badgeId: string, commentDto: { userId: string; commentText: string ; username: string}) {
    this.logger.log(`Attempting to add comment to badge ID: ${badgeId} by user ${commentDto.username}`);
    
    if (!Types.ObjectId.isValid(badgeId) || !Types.ObjectId.isValid(commentDto.userId)) {
      this.logger.error(`Invalid badge or user ID format. Badge ID: ${badgeId}, User ID: ${commentDto.userId}`);
      throw new BadRequestException('Invalid badge or user ID format');
    }

    const newComment = {
      userId: new Types.ObjectId(commentDto.userId),
      username: commentDto.username,
      commentText: commentDto.commentText,
      createdAt: new Date(),
    };

    try {
      const updatedBadge = await this.badgeModel.findByIdAndUpdate(
        badgeId,
        { $push: { comments: newComment } },
        { new: true }
      ).populate('comments.userId', 'username').exec();

      if (!updatedBadge) {
        this.logger.warn(`Badge with ID ${badgeId} not found for adding comment`);
        throw new NotFoundException(`Badge with ID ${badgeId} not found`);
      }
      return updatedBadge;
    } catch (error) {
      this.logger.error(`Error adding comment to badge ID ${badgeId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async isLike(badgeId:string,userId:string){
     // Check if the user has already liked the badge
     const badge = await this.badgeModel.findById(badgeId);
     if (!badge) {
       throw new NotFoundException(`Badge with ID ${badgeId} not found`);
     }
   
     const existingLike = badge.likes.find((like) => like.userId.toString() === userId);
     if (existingLike) {
       return {ans:true}
     }
     return {ans:false}
  
  }

  async addLikeToBadge(badgeId: string, userId: string) {
    // Check if the user has already liked the badge
    const badge = await this.badgeModel.findById(badgeId);
    if (!badge) {
      throw new NotFoundException(`Badge with ID ${badgeId} not found`);
    }
  
    const existingLike = badge.likes.find((like) => like.userId.toString() === userId);
    if (existingLike) {
      throw new ConflictException('User has already liked this badge');
    }
  
    // Add the new like
    const newLike = {
      userId: new Types.ObjectId(userId),
      likedAt: new Date(),
    };
    badge.likes.push(newLike);
  
    // Save the updated badge
    await badge.save();
    return badge;
  }
  

  async unlikeBadge(badgeId: string, userId: string): Promise<Badge> {
    if (!Types.ObjectId.isValid(badgeId) || !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid badge or user ID format');
    }
  
    // Remove the like entry with the matching userId from the likes array
    const updatedBadge = await this.badgeModel.findByIdAndUpdate(
      badgeId,
      { $pull: { likes: { userId: new Types.ObjectId(userId) } } },  // Match like entry by userId
      { new: true },
    ).exec();
  
    if (!updatedBadge) {
      throw new NotFoundException(`Badge with ID ${badgeId} not found`);
    }
    
    return updatedBadge;
  }

  async deleteCommentFromBadge(badgeId: string, commentId: string): Promise<Badge> {
    if (!Types.ObjectId.isValid(badgeId) || !Types.ObjectId.isValid(commentId)) {
      throw new BadRequestException('Invalid badge or comment ID format');
    }
  
    const updatedBadge = await this.badgeModel.findByIdAndUpdate(
      badgeId,
      { $pull: { comments: { _id: commentId } } }, // Remove comment by ID
      { new: true },
    ).exec();
  
    if (!updatedBadge) {
      throw new NotFoundException(`Badge with ID ${badgeId} not found`);
    }
    return updatedBadge;
  }

  async findRecentBadgesByUserId(userId: string, req: any): Promise<any[]> {
    if (!Types.ObjectId.isValid(userId)) {
      this.logger.warn(`Invalid user ID format: ${userId}`);
      throw new BadRequestException('Invalid user ID format');
    }
  
    try {
      this.logger.log(`Fetching recent badges for user ID: ${userId}`);
      const recentBadges = await this.badgeModel
        .find({ userId: userId })
        .sort({ dateCreated: -1 }) // Sort by most recent
        .limit(2) // Limit to 2 badges
        .exec();
  
      const baseUrl = `${req.protocol}://${req.get('host')}`;
  
      // Add full URIs for picture and picturef
      return recentBadges.map((badge) => ({
        ...badge.toObject(),
        pictureUri: `${baseUrl}/uploads/${badge.picture}`,
        picturefUri: `${baseUrl}/uploads/${badge.picturef}`,
      }));
    } catch (error) {
      this.logger.error(`Error fetching recent badges for user ${userId}: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to fetch recent badges');
    }
  }
  
  
  
}
