import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { SponsorService } from './sponsor.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { SponsorDto } from './sponsor.dto/sponsor.dto';
import { SponsorEntity } from './sponsor.entity/sponsor.entity';

@Controller('sponsors')
@UseInterceptors(BusinessErrorsInterceptor)
export class SponsorController {

    constructor(
        private readonly sponsorService: SponsorService
    ){}

    @Get()
    async findAll(){
        return await this.sponsorService.findAll();
    }

    @Get(':sponsorId')
    async findOne(@Param('sponsorId') sponsorId: string){
        return await this.sponsorService.findOne(sponsorId);
    }

    @Post()
    async create(@Body() sponsorDto: SponsorDto){
        const sponsor: SponsorEntity = plainToInstance(SponsorEntity, sponsorDto);
        return await this.sponsorService.create(sponsor);
    }

    @Put(':sponsorId')
    async update(@Param('sponsorId') sponsorId: string, @Body() sponsorDto: SponsorDto){
        const sponsor: SponsorEntity = plainToInstance(SponsorEntity, sponsorDto);
        return await this.sponsorService.update(sponsorId, sponsor);
    }

    @Delete(':sponsorId')
    @HttpCode(204)
    async delete(@Param('sponsorId') sponsorId: string){
        return await this.sponsorService.delete(sponsorId);
    }
}
