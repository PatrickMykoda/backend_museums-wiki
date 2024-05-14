import { Module } from '@nestjs/common';
import { ArtworkImageService } from './artwork-image.service';

@Module({
  providers: [ArtworkImageService]
})
export class ArtworkImageModule {}
