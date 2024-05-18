import { Module } from '@nestjs/common';
import { MovementService } from './movement.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementEntity } from './movement.entity/movement.entity';
import { MovementController } from './movement.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MovementEntity])],
  providers: [MovementService],
  controllers: [MovementController]
})
export class MovementModule {}
