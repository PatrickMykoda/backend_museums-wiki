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
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistEntity } from './artist/artist.entity/artist.entity';
import { ArtworkEntity } from './artwork/artwork.entity/artwork.entity';
import { ExhibitionEntity } from './exhibition/exhibition.entity/exhibition.entity';
import { ImageEntity } from './image/image.entity/image.entity';
import { MovementEntity } from './movement/movement.entity/movement.entity';
import { MuseumEntity } from './museum/museum.entity/museum.entity';
import { SponsorEntity } from './sponsor/sponsor.entity/sponsor.entity';
import { SponsorExhibitionModule } from './sponsor-exhibition/sponsor-exhibition.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [MuseumModule, ExhibitionModule, ArtworkModule, ArtistModule, SponsorModule, ImageModule, MovementModule, MuseumArtworkModule, ArtistArtworkModule, MovementArtistModule, ExhibitionArtworkModule, ArtworkImageModule, MuseumExhibitionModule, SponsorExhibitionModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'museolita',
      entities: [ArtistEntity, ArtworkEntity, ExhibitionEntity, ImageEntity, MovementEntity, MuseumEntity, SponsorEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    CacheModule.register()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
