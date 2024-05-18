import { Body, Controller, Delete, Get, HttpCode, Param, Put, Post, UseInterceptors } from '@nestjs/common';
import { ExhibitionArtworkService } from './exhibition-artwork.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { ArtworkDto } from 'src/artwork/artwork.dto/artwork.dto';
import { ArtworkEntity } from 'src/artwork/artwork.entity/artwork.entity';
import { plainToInstance } from 'class-transformer';

@Controller('exhibitions')
@UseInterceptors(BusinessErrorsInterceptor)
export class ExhibitionArtworkController {

    constructor(
        private readonly exhibitionArtworkService: ExhibitionArtworkService
    ){}

    @Post(':exhibitionId/artworks/:artworkId')
    async addArtworkExhibition(@Param('exhibitionId') exhibitionId: string, @Param(':artworkId') artworkId: string){
        return await this.exhibitionArtworkService.addArtworkExhibition(exhibitionId, artworkId);
    }

    @Get(':exhibitionId/artworks/:artworkId')
    async findArtworkByExhibitionIdArtworkId(@Param('exhibitionId') exhibitionId: string, @Param('artworkId') artworkId: string){
        return await this.exhibitionArtworkService.findArtworkByExhibitionIdArtworkId(exhibitionId, artworkId);
    }

    @Get(':exhibitionId/artworks')
    async findArtworksByExhibitionId(@Param('exhibitionId') exhibitionId: string){
        return await this.exhibitionArtworkService.findArtworksByExhibitionId(exhibitionId);
    }

    @Put(':exhibitionId/artworks')
    async associateArtworksExhibition(@Body() artworksDto: ArtworkDto[], @Param(':exhibitionId') exhibitionId: string){
        const artworks = plainToInstance(ArtworkEntity, artworksDto);
        return await this.exhibitionArtworkService.associateArtworksExhibition(exhibitionId, artworks);
    }

    @Delete(':exhibitionId/artworks/:artworkId')
    @HttpCode(204)
    async deleteArtworkExhibition(@Param('exhibitionId') exhibitionId: string, @Param('artworkId') artworkId: string){
        return await this.exhibitionArtworkService.deleteArtworkExhibition(exhibitionId, artworkId);
    }
}
