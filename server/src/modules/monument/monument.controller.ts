import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MonumentService } from './monument.service';
import { CreateMonumentDto } from './dto/create-monument.dto';
import { UpdateMonumentDto } from './dto/update-monument.dto';

@Controller('monument')
export class MonumentController {
  constructor(private readonly monumentService: MonumentService) {}

  @Post()
  create(@Body() createMonumentDto: CreateMonumentDto) {
    return this.monumentService.create(createMonumentDto);
  }

  @Get()
  findAll() {
    return this.monumentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.monumentService.findOne(+id);
  }
  @Get(':name')
  findOneByName(@Param('name') name: string) {
    return this.monumentService.findByName(name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMonumentDto: UpdateMonumentDto) {
    return this.monumentService.update(+id, updateMonumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.monumentService.remove(+id);
  }
}
