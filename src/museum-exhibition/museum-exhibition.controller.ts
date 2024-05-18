import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { MuseumExhibitionService } from './museum-exhibition.service';
import { ExhibitionDto } from '../exhibition/exhibition.dto/exhibition.dto';
import { ExhibitionEntity } from '../exhibition/exhibition.entity/exhibition.entity';
import { plainToInstance } from 'class-transformer';

@Controller('museums')
@UseInterceptors(BusinessErrorsInterceptor)
export class MuseumExhibitionController {
    constructor(private readonly museumExhibitionService: MuseumExhibitionService){}

    @Post(':museumId/exhibitions')
    async createExhibition(@Body() exhibitionDto: ExhibitionDto, @Param('museumId') museumId: string){
        const exhibition: ExhibitionEntity = plainToInstance(ExhibitionEntity, exhibitionDto);
        return await this.museumExhibitionService.createExhibitionMuseum(museumId, exhibition);
    }

    @Post(':museumId/exhibitions/:exhibitionId')
    async addExhibitionMuseum(@Param('exhibitionId') exhibitionId: string, @Param('museumId') museumId: string){
        return await this.museumExhibitionService.addExhibitionMuseum(museumId, exhibitionId);
    }

    @Get(':museumId/exhibitions/:exhibitionId')
    async findExhibitionByMuseumIdExhibitionId(@Param('museumId') museumId: string, @Param('exhibitionId') exhibitionId: string){
        return await this.museumExhibitionService.findExhibitionByMuseumIdExhibitionId(museumId, exhibitionId);
    }

    @Get(':museumId/exhibitions')
    async findImagesByMuseumId(@Param('museumId') museumId: string){
        return await this.museumExhibitionService.findExhibitionsByMuseumId(museumId);
    }

    @Put(':museumId/exhibitions')
    async associateExhibitionsMuseum(@Body() exhibitionsDto: ExhibitionDto[], @Param('museumId') museumId: string){
        const exhibitions = plainToInstance(ExhibitionEntity, exhibitionsDto);
        return await this.museumExhibitionService.associateExhibitionsMuseum(museumId, exhibitions);
    }

    @Delete(':museumId/exhibitions/:exhibitionId')
    @HttpCode(204)
    async deleteExhibitionMuseum(@Param('museumId') museumId: string, @Param('exhibitionId') exhibitionId: string){
        return await this.museumExhibitionService.deleteExhibitionMuseum(museumId, exhibitionId);
    }
}
