import { Module } from '@nestjs/common';
import { ExhibitionService } from './exhibition.service';
import { ExhibitionEntity } from './exhibition.entity/exhibition.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ExhibitionEntity])],
  providers: [ExhibitionService]
})
export class ExhibitionModule {}
