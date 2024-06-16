import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './image.entity/image.entity';
import { ImageController } from './image.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity]), CacheModule.register()],
  providers: [ImageService],
  controllers: [ImageController]
})
export class ImageModule {}
