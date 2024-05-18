import { Module } from '@nestjs/common';
import { SponsorService } from './sponsor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SponsorEntity } from './sponsor.entity/sponsor.entity';
import { SponsorController } from './sponsor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SponsorEntity])],
  providers: [SponsorService],
  controllers: [SponsorController]
})
export class SponsorModule {}
