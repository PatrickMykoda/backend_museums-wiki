import { Module } from '@nestjs/common';
import { ExhibitionSponsorService } from './exhibition-sponsor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SponsorEntity } from '../sponsor/sponsor.entity/sponsor.entity';
import { ExhibitionEntity } from '../exhibition/exhibition.entity/exhibition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExhibitionEntity, SponsorEntity])],
  providers: [ExhibitionSponsorService]
})
export class ExhibitionSponsorModule {}
