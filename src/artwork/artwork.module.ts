import { Module } from '@nestjs/common';
import { ArtworkService } from './artwork.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtworkEntity } from './artwork.entity/artwork.entity';
import { ArtworkController } from './artwork.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([ArtworkEntity]), CacheModule.register()],
  providers: [ArtworkService],
  controllers: [ArtworkController]
})
export class ArtworkModule {}
