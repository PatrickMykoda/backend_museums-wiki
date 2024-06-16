import { Module } from '@nestjs/common';
import { ExhibitionService } from './exhibition.service';
import { ExhibitionEntity } from './exhibition.entity/exhibition.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionController } from './exhibition.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([ExhibitionEntity]), CacheModule.register()],
  providers: [ExhibitionService],
  controllers: [ExhibitionController]
})
export class ExhibitionModule {}
