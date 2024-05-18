import { Body, Controller, Delete, Get, HttpCode, Param, Put, UseInterceptors } from '@nestjs/common';
import { ExhibitionService } from './exhibition.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { ExhibitionDto } from './exhibition.dto/exhibition.dto';
import { ExhibitionEntity } from './exhibition.entity/exhibition.entity';
import { plainToInstance } from 'class-transformer';

@Controller('exhibitions')
@UseInterceptors(BusinessErrorsInterceptor)
export class ExhibitionController {

    constructor(
        private readonly exhibitionService: ExhibitionService
    ){}

    @Get()
    async findAll() {
        return await this.exhibitionService.findAll();
    }

    @Get(':exhibitionId')
    async findOne(@Param('exhibitionId') exhibitionId: string){
        return await this.exhibitionService.findOne(exhibitionId);
    }

    @Put(':exhibitionId')
    async update(@Param('exhibitionId') exhibitionId: string, @Body() exhibitionDto: ExhibitionDto){
        const exhibition: ExhibitionEntity = plainToInstance(ExhibitionEntity, exhibitionDto);
        return await this.exhibitionService.update(exhibitionId, exhibition);
    }

    @Delete(':exhibitionId')
    @HttpCode(204)
    async delete(@Param('exhibitionId') exhibitionId: string){
        return await this.exhibitionService.delete(exhibitionId);
    }
}
