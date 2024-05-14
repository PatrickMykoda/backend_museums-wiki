import { Module } from '@nestjs/common';
import { ExhibitionArtworkService } from './exhibition-artwork.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionEntity } from '../exhibition/exhibition.entity/exhibition.entity';
import { ArtworkEntity } from '../artwork/artwork.entity/artwork.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExhibitionEntity, ArtworkEntity])],
  providers: [ExhibitionArtworkService]
})
export class ExhibitionArtworkModule {}
