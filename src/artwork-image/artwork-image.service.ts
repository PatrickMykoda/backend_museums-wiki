import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtworkEntity } from '../artwork/artwork.entity/artwork.entity';
import { ImageEntity } from '../image/image.entity/image.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ArtworkImageService {

    cacheKey: string = "artworkImages-";

    constructor(
        @InjectRepository(ArtworkEntity)
        private readonly artworkRepository: Repository<ArtworkEntity>,

        @InjectRepository(ImageEntity)
        private readonly imageRepository: Repository<ImageEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async createImageArtwork(artworkId: string, image: ImageEntity): Promise<ImageEntity>{
        const artwork: ArtworkEntity = await this.artworkRepository.findOne({where: {id: artworkId}, relations: ["artist", "images"]});
        if (!artwork)
            throw new BusinessLogicException("The artwork with the given id was not found", BusinessError.NOT_FOUND);

        let newImage: ImageEntity = await this.imageRepository.save(image);
    
        artwork.images = [...artwork.images, image];
        await this.artworkRepository.save(artwork);

        return await this.imageRepository.findOne({where: {id: newImage.id}, relations: ["artwork"]});
    }

    async addImageArtwork(artworkId: string, imageId: string): Promise<ArtworkEntity>{
        const artwork: ArtworkEntity = await this.artworkRepository.findOne({where: {id: artworkId}, relations: ["images"]});
        if(!artwork)
            throw new BusinessLogicException("The artwork with the given id was not found", BusinessError.NOT_FOUND);
    
        const image: ImageEntity = await this.imageRepository.findOne({where: {id: imageId}});
        if (!image)
            throw new BusinessLogicException("The image with the given id was not found", BusinessError.NOT_FOUND);
    
        artwork.images = [...artwork.images, image];
        return await this.artworkRepository.save(artwork);
    }

    async findImageByArtworkIdImageId(artworkId: string, imageId: string): Promise<ImageEntity>{
        const artwork: ArtworkEntity = await this.artworkRepository.findOne({where: {id: artworkId}, relations: ["images"]});
        if(!artwork)
            throw new BusinessLogicException("The artwork with the given id was not found", BusinessError.NOT_FOUND);

        const image: ImageEntity = await this.imageRepository.findOne({where: {id: imageId}});
        if (!image)
            throw new BusinessLogicException("The image with the given id was not found", BusinessError.NOT_FOUND);

        const artworkImage: ImageEntity = artwork.images.find(e => e.id === image.id);

        if (!artworkImage)
            throw new BusinessLogicException("The image with the given id is not associated to the artwork", BusinessError.PRECONDITION_FAILED);

        return artworkImage;
    }

    async findImagesByArtworkId(artworkId: string): Promise<ImageEntity[]> {
        const cachedImages: ImageEntity[] = await this.cacheManager.get<ImageEntity[]>(this.cacheKey+artworkId);

        if(!cachedImages){
            const artwork: ArtworkEntity = await this.artworkRepository.findOne({where: {id: artworkId}, relations: ["images"]});
            if(!artwork)
                throw new BusinessLogicException("The artwork with the given id was not found", BusinessError.NOT_FOUND);
            await this.cacheManager.set(this.cacheKey+artworkId, artwork.images);
            return artwork.images;
        }
        return cachedImages;
    }

    async associateImagesArtwork(artworkId: string, images: ImageEntity[]): Promise<ArtworkEntity> {
        const artwork: ArtworkEntity = await this.artworkRepository.findOne({where: {id: artworkId}, relations: ["images"]});
        if(!artwork)
            throw new BusinessLogicException("The artwork with the given id was not found", BusinessError.NOT_FOUND);

        for(let i = 0; i < images.length; i++){
            const image: ImageEntity = await this.imageRepository.findOne({where: {id: images[i].id}});
            if (!image)
                throw new BusinessLogicException("The image with the given id was not found", BusinessError.NOT_FOUND);
        }

        artwork.images = images;
        
        return await this.artworkRepository.save(artwork);
    }

    async deleteImageArtwork(artworkId: string, imageId: string){
        const artwork: ArtworkEntity = await this.artworkRepository.findOne({where: {id: artworkId}, relations: ["images"]});
            if(!artwork)
                throw new BusinessLogicException("The artwork with the given id was not found", BusinessError.NOT_FOUND);

        const image: ImageEntity = await this.imageRepository.findOne({where: {id: imageId}});
            if (!image)
                throw new BusinessLogicException("The image with the given id was not found", BusinessError.NOT_FOUND);

        const artworkImage: ImageEntity = artwork.images.find(e => e.id === image.id);

        if (!artworkImage)
            throw new BusinessLogicException("The image with the given id is not associated to the artwork", BusinessError.PRECONDITION_FAILED);

        artwork.images = artwork.images.filter(e => e.id !== imageId);
        await this.artworkRepository.save(artwork);
    }
}
