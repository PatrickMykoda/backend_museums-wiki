import { Module } from '@nestjs/common';
import { SponsorExhibitionService } from './sponsor-exhibition.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionEntity } from '../exhibition/exhibition.entity/exhibition.entity';
import { SponsorEntity } from '../sponsor/sponsor.entity/sponsor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExhibitionEntity, SponsorEntity])],
  providers: [SponsorExhibitionService]
})
export class SponsorExhibitionModule {}
