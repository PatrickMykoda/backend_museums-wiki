import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { ArtistArtworkService } from './artist-artwork.service';
import { ArtworkDto } from '../artwork/artwork.dto/artwork.dto';
import { plainToInstance } from 'class-transformer';
import { ArtworkEntity } from '../artwork/artwork.entity/artwork.entity';
import { ArtworkService } from '../artwork/artwork.service';

@Controller('artists')
@UseInterceptors(BusinessErrorsInterceptor)
export class ArtistArtworkController {

    constructor(
        private readonly artistArtworkService: ArtistArtworkService,
    ){}

    //Creation of an artwork is done here in artist-artwork.controller in order to automatically associate it with an artist
    @Post(':artistId/artworks')
    async createArtwork(@Body() artworkDto: ArtworkDto, @Param('artistId') artistId: string){
        const artwork: ArtworkEntity = plainToInstance(ArtworkEntity, artworkDto);
        return await this.artistArtworkService.createArtworkArtist(artistId, artwork);
    }

    @Post(':artistId/artworks/:artworkId')
    async addArtworkArtist(@Param('artistId') artistId: string, @Param('artworkId') artworkId: string){
        return await this.artistArtworkService.addArtworkArtist(artistId, artworkId);
    }

    @Get(':artistId/artworks/:artworkId')
    async findArtworkByArtistIdArtworkId(@Param('artistId') artistId: string, @Param('artworkId') artworkId: string){
        return await this.artistArtworkService.findArtworkByArtistIdArtworkId(artistId, artworkId);
    }

    @Get(':artistId/artworks')
    async findArtworksByArtistId(@Param('artistId') artistId: string){
        return await this.artistArtworkService.findArtworksByArtistId(artistId);
    }

    @Put(':artistId/artworks')
    async associateArtworksArtist(@Body() artworksDto: ArtworkDto[], @Param('artistId') artistId: string){
        const artworks = plainToInstance(ArtworkEntity, artworksDto);
        return await this.artistArtworkService.associateArtworksArtist(artistId, artworks);
    }

    @Delete(':artistId/artworks/:artworkId')
    @HttpCode(204)
    async deleteArtworkArtist(@Param('artistId') artistId: string, @Param('artworkId') artworkId: string){
        return await this.artistArtworkService.deleteArtworkArtist(artistId, artworkId);
    }
    
}
