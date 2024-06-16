import { Module } from '@nestjs/common';
import { SponsorExhibitionService } from './sponsor-exhibition.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionEntity } from '../exhibition/exhibition.entity/exhibition.entity';
import { SponsorEntity } from '../sponsor/sponsor.entity/sponsor.entity';
import { SponsorExhibitionController } from './sponsor-exhibition.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([ExhibitionEntity, SponsorEntity]), CacheModule.register()],
  providers: [SponsorExhibitionService],
  controllers: [SponsorExhibitionController]
})
export class SponsorExhibitionModule {}
