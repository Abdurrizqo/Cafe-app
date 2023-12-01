import { Module } from '@nestjs/common';
import { MejaService } from './meja.service';
import { MejaController } from './meja.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meja } from './entities/meja.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Meja])],
  controllers: [MejaController],
  providers: [MejaService],
})
export class MejaModule {}
