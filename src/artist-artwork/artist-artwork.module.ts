import { Module } from '@nestjs/common';
import { ArtistArtworkService } from './artist-artwork.service';
import { ArtistEntity } from '../artist/artist.entity/artist.entity';
import { ArtworkEntity } from '../artwork/artwork.entity/artwork.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ArtistEntity, ArtworkEntity])],
  providers: [ArtistArtworkService]
})
export class ArtistArtworkModule {}
