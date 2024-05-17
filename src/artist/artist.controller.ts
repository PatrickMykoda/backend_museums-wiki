import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { ArtistDto } from './artist.dto/artist.dto';
import { ArtistEntity } from './artist.entity/artist.entity';
import { plainToInstance } from 'class-transformer';
import { Utils } from '../shared/utils/utils'
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Controller('artists')
@UseInterceptors(BusinessErrorsInterceptor)
export class ArtistController {

    constructor(
        private readonly artistService: ArtistService,
        private readonly utils: Utils
    ){}

    @Get()
    async findAll() {
        return await this.artistService.findAll();
    }

    @Get(':artistId')
    async findOne(@Param('artistId') artistId: string){
        return await this.artistService.findOne(artistId);
    }

    @Post()
    async create(@Body() artistDto: ArtistDto){
        if(!this.utils.checkDateFormatCorrect(artistDto["birthdate"])){
            throw new BusinessLogicException("Fecha incorrecta: Se requiere el formato yyyy-mm-dd", BusinessError.PRECONDITION_FAILED);
        }
        if(!this.utils.checkDateInPast(artistDto["birthdate"])){
            throw new BusinessLogicException("La fecha de las estrellas debe estar en el pasado", BusinessError.PRECONDITION_FAILED);
        }
        const artist: ArtistEntity = plainToInstance(ArtistEntity, artistDto);
        return  await this.artistService.create(artist);
    }

    @Put(':artistId')
    async update(@Param('artistId') artistId: string, @Body() artistDto: ArtistDto){
        if(!this.utils.checkDateFormatCorrect(artistDto["birthdate"])){
            throw new BusinessLogicException("Fecha incorrecta: Se requiere el formato yyyy-mm-dd", BusinessError.PRECONDITION_FAILED);
        }
        if(!this.utils.checkDateInPast(artistDto["birthdate"])){
            throw new BusinessLogicException("La fecha de las estrellas debe estar en el pasado", BusinessError.PRECONDITION_FAILED);
        }
        const artist: ArtistEntity = plainToInstance(ArtistEntity, artistDto);
        return await this.artistService.update(artistId, artist);
    }

    @Delete(':artistId')
    @HttpCode(204)
    async delete(@Param('artistId') artistId: string){
        return await this.artistService.delete(artistId);
    }
}
