import { PartialType } from '@nestjs/mapped-types';
import { CreateMonumentDto } from './create-monument.dto';

export class UpdateMonumentDto extends PartialType(CreateMonumentDto) {}
