import { Module } from '@nestjs/common';
import { MuseumArtworkService } from './museum-artwork.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuseumEntity } from '../museum/museum.entity/museum.entity';
import { ArtworkEntity } from '../artwork/artwork.entity/artwork.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MuseumEntity, ArtworkEntity])],
  providers: [MuseumArtworkService]
})
export class MuseumArtworkModule {}