import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { SponsorExhibitionService } from './sponsor-exhibition.service';
import { ExhibitionDto } from '../exhibition/exhibition.dto/exhibition.dto';
import { ExhibitionEntity } from '../exhibition/exhibition.entity/exhibition.entity';
import { plainToInstance } from 'class-transformer';

@Controller('sponsors')
@UseInterceptors(BusinessErrorsInterceptor)
export class SponsorExhibitionController {
    constructor(
        private readonly sponsorExhibitionService: SponsorExhibitionService
    ){}

    @Post(':sponsorId/exhibitions/:exhibitionId')
    async addExhibitionSponsor(@Param('sponsorId') sponsorId: string, @Param('exhibitionId') exhibitionId: string){
        return await this. sponsorExhibitionService.addExhibitionSponsor(sponsorId, exhibitionId);
    } 

    @Get(':sponsorId/exhibitions/:exhibitionId')
    async findExhibitionBySponsorIdExhibitionId(@Param('sponsorId') sponsorId: string, @Param('exhibitionId') exhibitionId: string){
        return await this.sponsorExhibitionService.findExhibitionBySponsorIdExhibitionId(sponsorId, exhibitionId);
    }

    @Get(':sponsorId/exhibitions')
    async findExhibitionsBySponsorId(@Param('sponsorId') sponsorId: string){
        return await this.sponsorExhibitionService.findExhibitionsBySponsorId(sponsorId);
    }

    @Put(':sponsorId/exhibitions')
    async associateExhibitionsSponsor(@Body() exhibitionsDto: ExhibitionDto[], @Param('sponsorId') sponsorId: string){
        const exhibitions: ExhibitionEntity[] = plainToInstance(ExhibitionEntity, exhibitionsDto);
        return await this.sponsorExhibitionService.associateExhibitionsSponsor(sponsorId, exhibitions);
    }

    @Delete(':sponsorId/exhibitions/:exhibitionId')
    @HttpCode(204)
    async deleteExhibitionSponsor(@Param('sponsorId') sponsorId: string, @Param('exhibitionId') exhibitionId: string){
        return await this.sponsorExhibitionService.deleteExhibitionSponsor(sponsorId, exhibitionId);
    }
}
