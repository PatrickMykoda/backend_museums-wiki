import { Module } from '@nestjs/common';
import { ArtworkImageService } from './artwork-image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from '../image/image.entity/image.entity';
import { ArtworkEntity } from '../artwork/artwork.entity/artwork.entity';
import { ArtworkImageController } from './artwork-image.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity, ArtworkEntity]), CacheModule.register()],
  providers: [ArtworkImageService],
  controllers: [ArtworkImageController]
})
export class ArtworkImageModule {}
