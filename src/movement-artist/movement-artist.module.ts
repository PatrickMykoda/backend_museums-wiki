import { Module } from '@nestjs/common';
import { MovementArtistService } from './movement-artist.service';
import { MovementEntity } from '../movement/movement.entity/movement.entity';
import { ArtistEntity } from '../artist/artist.entity/artist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementArtistController } from './movement-artist.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ArtistEntity, MovementEntity])],
  providers: [MovementArtistService],
  controllers: [MovementArtistController]
})
export class MovementArtistModule {}
