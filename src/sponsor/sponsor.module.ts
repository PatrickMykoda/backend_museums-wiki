import { Module } from '@nestjs/common';
import { SponsorService } from './sponsor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SponsorEntity } from './sponsor.entity/sponsor.entity';
import { SponsorController } from './sponsor.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([SponsorEntity]), CacheModule.register()],
  providers: [SponsorService],
  controllers: [SponsorController]
})
export class SponsorModule {}
