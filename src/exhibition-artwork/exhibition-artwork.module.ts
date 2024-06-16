import { Module } from '@nestjs/common';
import { ExhibitionArtworkService } from './exhibition-artwork.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionEntity } from '../exhibition/exhibition.entity/exhibition.entity';
import { ArtworkEntity } from '../artwork/artwork.entity/artwork.entity';
import { ExhibitionArtworkController } from './exhibition-artwork.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([ExhibitionEntity, ArtworkEntity]), CacheModule.register()],
  providers: [ExhibitionArtworkService],
  controllers: [ExhibitionArtworkController]
})
export class ExhibitionArtworkModule {}
