import { Module } from '@nestjs/common';
import { MovementService } from './movement.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementEntity } from './movement.entity/movement.entity';
import { MovementController } from './movement.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([MovementEntity]), CacheModule.register()],
  providers: [MovementService],
  controllers: [MovementController]
})
export class MovementModule {}
