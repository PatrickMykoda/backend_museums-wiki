import { Module } from '@nestjs/common';
import { ExhibitionService } from './exhibition.service';
import { ExhibitionEntity } from './exhibition.entity/exhibition.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionController } from './exhibition.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ExhibitionEntity])],
  providers: [ExhibitionService],
  controllers: [ExhibitionController]
})
export class ExhibitionModule {}
