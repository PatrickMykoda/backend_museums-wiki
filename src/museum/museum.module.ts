import { Module } from '@nestjs/common';
import { MuseumService } from './museum.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuseumEntity } from './museum.entity/museum.entity';
import { MuseumController } from './museum.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([MuseumEntity]), CacheModule.register()],
  providers: [MuseumService],
  controllers: [MuseumController]
})
export class MuseumModule {}
