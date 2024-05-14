import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MuseumModule } from './museum/museum.module';
import { ExhibitionModule } from './exhibition/exhibition.module';
import { ArtworkModule } from './artwork/artwork.module';
import { ArtistModule } from './artist/artist.module';
import { SponsorModule } from './sponsor/sponsor.module';
import { ImageModule } from './image/image.module';
import { MovementModule } from './movement/movement.module';
import { MuseumArtworkModule } from './museum-artwork/museum-artwork.module';
import { ArtistArtworkModule } from './artist-artwork/artist-artwork.module';
import { MovementArtistModule } from './movement-artist/movement-artist.module';
import { ExhibitionArtworkModule } from './exhibition-artwork/exhibition-artwork.module';
import { ArtworkImageModule } from './artwork-image/artwork-image.module';
import { MuseumExhibitionModule } from './museum-exhibition/museum-exhibition.module';

@Module({
  imports: [MuseumModule, ExhibitionModule, ArtworkModule, ArtistModule, SponsorModule, ImageModule, MovementModule, MuseumArtworkModule, ArtistArtworkModule, MovementArtistModule, ExhibitionArtworkModule, ArtworkImageModule, MuseumExhibitionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
