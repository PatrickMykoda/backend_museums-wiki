import { Module } from '@nestjs/common';
import { ArtistArtworkService } from './artist-artwork.service';
import { ArtistEntity } from '../artist/artist.entity/artist.entity';
import { ArtworkEntity } from '../artwork/artwork.entity/artwork.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistArtworkController } from './artist-artwork.controller';
import { ArtworkService } from '../artwork/artwork.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([ArtistEntity, ArtworkEntity]), CacheModule.register()],
  providers: [ArtistArtworkService],
  controllers: [ArtistArtworkController]
})
export class ArtistArtworkModule {}
