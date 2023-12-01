import { PartialType } from '@nestjs/swagger';
import { CreateMejaDto } from './create-meja.dto';

export class UpdateMejaDto extends PartialType(CreateMejaDto) {}
