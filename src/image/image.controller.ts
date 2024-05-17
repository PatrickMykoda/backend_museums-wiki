import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { ImageDto } from './image.dto/image.dto';
import { ImageEntity } from './image.entity/image.entity';
import { plainToInstance } from 'class-transformer';

@Controller('images')
@UseInterceptors(BusinessErrorsInterceptor)
export class ImageController {

    constructor(
        private readonly imageService: ImageService
    ){}

    @Get()
    async findAll() {
        return await this.imageService.findAll();
    }

    @Get(':imageId')
    async findOne(@Param('imageId') imageId: string) {
        return await this.imageService.findOne(imageId);
    }

    @Put(':imageId')
    async update(@Param('imageId') imageId: string, @Body() imageDto: ImageDto) {
        const image: ImageEntity = plainToInstance(ImageEntity, imageDto);
        return await this.imageService.update(imageId, image);
    }

    @Delete(':imageId')
    @HttpCode(204)
    async delete(@Param('imageId') imageId: string) {
        return await this.imageService.delete(imageId);
    }
}
