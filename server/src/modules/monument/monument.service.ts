import { Injectable } from '@nestjs/common';
import { CreateMonumentDto } from './dto/create-monument.dto';
import { UpdateMonumentDto } from './dto/update-monument.dto';

@Injectable()
export class MonumentService {
  create(createMonumentDto: CreateMonumentDto) {
    return 'This action adds a new monument';
  }

  findAll() {
    return `This action returns all monument`;
  }

  findOne(id: number) {
    return `This action returns a #${id} monument`;
  }

  update(id: number, updateMonumentDto: UpdateMonumentDto) {
    return `This action updates a #${id} monument`;
  }

  remove(id: number) {
    return `This action removes a #${id} monument`;
  }
}
