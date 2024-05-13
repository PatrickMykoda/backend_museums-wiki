import { Module } from '@nestjs/common';
import { SponsorService } from './sponsor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SponsorEntity } from './sponsor.entity/sponsor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SponsorEntity])],
  providers: [SponsorService]
})
export class SponsorModule {}
