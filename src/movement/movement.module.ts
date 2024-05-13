import { Module } from '@nestjs/common';
import { MovementService } from './movement.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementEntity } from './movement.entity/movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovementEntity])],
  providers: [MovementService]
})
export class MovementModule {}
