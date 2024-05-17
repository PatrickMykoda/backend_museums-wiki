import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ArtworkImageService } from './artwork-image.service';
import { ImageDto } from '../image/image.dto/image.dto';
import { ImageEntity } from '../image/image.entity/image.entity';
import { plainToInstance } from 'class-transformer';

@Controller('artworks')
export class ArtworkImageController {

    constructor(
        private readonly artworkImageService: ArtworkImageService
    ){}

    @Post(':artworkId/images')
    async createImage(@Body() imageDto: ImageDto, @Param('artworkId') artworkId: string){
        const image: ImageEntity = plainToInstance(ImageEntity, imageDto);
        return await this.artworkImageService.createImageArtwork(artworkId, image);
    }

    @Post(':artworkId/images/:imageId')
    async addImageArtwork(@Param('artworkId') artworkId: string, @Param('imageId') imageId: string){
        return await this.artworkImageService.addImageArtwork(artworkId, imageId);
    }

    @Get(':artworkId/images/:imageId')
    async findImageByArtworkIdImageId(@Param('artworkId') artworkId: string, @Param('imageId') imageId: string){
        return await this.artworkImageService.findImageByArtworkIdImageId(artworkId, imageId);
    }

    @Get(':artworkId/images')
    async findImagesByArtworkId(@Param('artworkId') artworkId: string){
        return await this.artworkImageService.findImagesByArtworkId(artworkId);
    }

    @Put(':artworkId/images')
    async associateImagesArtwork(@Body() imagesDto: ImageDto[], @Param('artworkId') artworkId: string){
        const images = plainToInstance(ImageEntity, imagesDto);
        return await this.artworkImageService.associateImagesArtwork(artworkId, images);
    }

    @Delete(':artworkId/images/:imageId')
    @HttpCode(204)
    async deleteImageArtist(@Param('artworkId') artworkId: string, @Param('imageId') imageId: string){
        return await this.artworkImageService.deleteImageArtwork(artworkId, imageId);
    }
}
