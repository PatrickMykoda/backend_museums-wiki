import { Module } from '@nestjs/common';
import { MuseumExhibitionService } from './museum-exhibition.service';
import { ExhibitionEntity } from '../exhibition/exhibition.entity/exhibition.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuseumEntity } from '../museum/museum.entity/museum.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MuseumEntity, ExhibitionEntity])],
  providers: [MuseumExhibitionService]
})
export class MuseumExhibitionModule {}
