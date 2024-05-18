import { Module } from '@nestjs/common';
import { ExhibitionArtworkService } from './exhibition-artwork.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionEntity } from '../exhibition/exhibition.entity/exhibition.entity';
import { ArtworkEntity } from '../artwork/artwork.entity/artwork.entity';
import { ExhibitionArtworkController } from './exhibition-artwork.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ExhibitionEntity, ArtworkEntity])],
  providers: [ExhibitionArtworkService],
  controllers: [ExhibitionArtworkController]
})
export class ExhibitionArtworkModule {}
