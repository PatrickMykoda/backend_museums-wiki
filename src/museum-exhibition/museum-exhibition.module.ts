import { Module } from '@nestjs/common';
import { MuseumExhibitionService } from './museum-exhibition.service';
import { ExhibitionEntity } from '../exhibition/exhibition.entity/exhibition.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuseumEntity } from '../museum/museum.entity/museum.entity';
import { MuseumExhibitionController } from './museum-exhibition.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([MuseumEntity, ExhibitionEntity]), CacheModule.register()],
  providers: [MuseumExhibitionService],
  controllers: [MuseumExhibitionController]
})
export class MuseumExhibitionModule {}
