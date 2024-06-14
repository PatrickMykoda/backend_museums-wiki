import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistEntity } from './artist.entity/artist.entity';
import { ArtistController } from './artist.controller';
import { Utils } from '../shared/utils/utils';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  providers: [ArtistService, Utils],
  imports: [TypeOrmModule.forFeature([ArtistEntity]), CacheModule.register()],
  controllers: [ArtistController]
})
export class ArtistModule {}
