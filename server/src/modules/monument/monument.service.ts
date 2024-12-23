import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMonumentDto } from './dto/create-monument.dto';
import { UpdateMonumentDto } from './dto/update-monument.dto';
import { Monument, MonumentDocument } from './schema/monument.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class MonumentService {
  constructor(
    @InjectModel(Monument.name) private monumentModule: Model<MonumentDocument>,
  ){}

  create(createMonumentDto: CreateMonumentDto) {

    try{
    if(
      createMonumentDto.name.trim().length==0 ||
      createMonumentDto.description.trim().length==0||
      createMonumentDto.location.trim().length==0||
      !createMonumentDto.radius
  )
  throw new BadRequestException("Invalid data !")
   
  const createdMonument = this.monumentModule.create(createMonumentDto)


  return createMonumentDto;

} catch(e){
  throw new BadRequestException(e)
}

  }

  findAll() {
    return this.monumentModule.find();
  }


  async findOne(id: string): Promise<Monument> {
    const monument = await this.monumentModule.findById(id).exec();

    if (!monument) {
      throw new NotFoundException(`Monument with ID ${id} not found`);
    }

    return monument;
  }


  async findByName(name:string){

    console.log("Find MONUM")
    const searchValue = name.toLowerCase().trim();
    const result = await this.monumentModule.findOne({
      title: { $regex: `^${searchValue}$`, $options: 'i' },
    });
    console.log(result)


    return result
  }

  update(id: number, updateMonumentDto: UpdateMonumentDto) {
    return `This action updates a #${id} monument`;
  }

  remove(id: number) {
    return `This action removes a #${id} monument`;
  }
}
