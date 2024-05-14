import { Module } from '@nestjs/common';
import { MovementArtistService } from './movement-artist.service';
import { MovementEntity } from '../movement/movement.entity/movement.entity';
import { ArtistEntity } from '../artist/artist.entity/artist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ArtistEntity, MovementEntity])],
  providers: [MovementArtistService]
})
export class MovementArtistModule {}
