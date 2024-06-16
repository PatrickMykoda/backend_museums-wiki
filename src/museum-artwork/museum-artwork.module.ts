import { Module } from '@nestjs/common';
import { MuseumArtworkService } from './museum-artwork.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuseumEntity } from '../museum/museum.entity/museum.entity';
import { ArtworkEntity } from '../artwork/artwork.entity/artwork.entity';
import { MuseumArtworkController } from './museum-artwork.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([MuseumEntity, ArtworkEntity]), CacheModule.register()],
  providers: [MuseumArtworkService],
  controllers: [MuseumArtworkController]
})
export class MuseumArtworkModule {}
