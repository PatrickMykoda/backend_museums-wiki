import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { MovementArtistService } from './movement-artist.service';
import { ArtistDto } from '../artist/artist.dto/artist.dto';
import { plainToInstance } from 'class-transformer';
import { ArtistEntity } from '../artist/artist.entity/artist.entity';

@Controller('movements')
@UseInterceptors(BusinessErrorsInterceptor)
export class MovementArtistController {

    constructor(
        private readonly movementArtistService: MovementArtistService
    ){}

    @Post(':movementId/artists/:artistId')
    async addArtistMovement(@Param('movementId') movementId: string, @Param('artistId') artistId: string){
        return await this.movementArtistService.addArtistMovement(movementId, artistId);
    }

    @Get(':movementId/artists/:artistId')
    async findArtistByMovementIdArtistId(@Param('movementId') movementId: string, @Param('artistId') artistId: string){
        return await this.movementArtistService.findArtistByMovementIdArtistId(movementId, artistId);
    }

    @Get(':movementId/artists')
    async findArtistsByMovementId(@Param('movementId') movementId: string){
        return await this.movementArtistService.findArtistsByMovementId(movementId);
    }

    @Put(':movementId/artists')
    async associateArtistsMovement(@Body() artistsDto: ArtistDto[], @Param('movementId') movementId: string){
        const artists = plainToInstance(ArtistEntity, artistsDto);
        return await this.movementArtistService.associateArtistsMovement(movementId, artists);
    }

    @Delete(':movementId/artists/:artistId')
    @HttpCode(204)
    async deleteArtistMovement(@Param('movementId') movementId: string, @Param('artistId') artistId: string){
        return await this.movementArtistService.deleteArtistMovement(movementId, artistId);
    }
}
