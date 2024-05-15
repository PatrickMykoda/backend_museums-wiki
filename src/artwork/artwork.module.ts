import { Module } from '@nestjs/common';
import { ArtworkService } from './artwork.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtworkEntity } from './artwork.entity/artwork.entity';
import { ArtworkController } from './artwork.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ArtworkEntity])],
  providers: [ArtworkService],
  controllers: [ArtworkController]
})
export class ArtworkModule {}
