import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistEntity } from './artist.entity/artist.entity';

@Module({
  providers: [ArtistService],
  imports: [TypeOrmModule.forFeature([ArtistEntity])]
})
export class ArtistModule {}
