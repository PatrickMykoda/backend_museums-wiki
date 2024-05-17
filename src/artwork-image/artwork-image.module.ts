import { Module } from '@nestjs/common';
import { ArtworkImageService } from './artwork-image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from '../image/image.entity/image.entity';
import { ArtworkEntity } from '../artwork/artwork.entity/artwork.entity';
import { ArtworkImageController } from './artwork-image.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity, ArtworkEntity])],
  providers: [ArtworkImageService],
  controllers: [ArtworkImageController]
})
export class ArtworkImageModule {}
