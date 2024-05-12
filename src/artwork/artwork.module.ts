import { Module } from '@nestjs/common';
import { ArtworkService } from './artwork.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtworkEntity } from './artwork.entity/artwork.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArtworkEntity])],
  providers: [ArtworkService]
})
export class ArtworkModule {}
