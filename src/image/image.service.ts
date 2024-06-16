import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from './image.entity/image.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ImageService {

    cacheKey: string = "images";

    constructor(
        @InjectRepository(ImageEntity)
        private readonly imageRepository: Repository<ImageEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async findAll(): Promise<ImageEntity[]> {
        const cachedImages: ImageEntity[] = await this.cacheManager.get<ImageEntity[]>(this.cacheKey);

        if(!cachedImages){
            const images: ImageEntity[] = await this.imageRepository.find({ relations: ["artwork"]});
            await this.cacheManager.set(this.cacheKey, images);
            return images;
        }
        return cachedImages;
    }

    async findOne(id: string): Promise<ImageEntity> {
        const cachedImage: ImageEntity = await this.cacheManager.get<ImageEntity>(id);

        if(!cachedImage){
            const image: ImageEntity = await this.imageRepository.findOne({where: {id}, relations: ["artwork"]});
            if (!image)
                throw new BusinessLogicException("The image with the given id was not found", BusinessError.NOT_FOUND);
            await this.cacheManager.set(id, image);
            return image;
        }
        return cachedImage;
    }

    async create(image: ImageEntity): Promise<ImageEntity> {
        return await this.imageRepository.save(image);
    }

    async update(id: string, image: ImageEntity): Promise<ImageEntity> {
        const persistedImage: ImageEntity = await this.imageRepository.findOne({where: {id}});
        if (!persistedImage)
            throw new BusinessLogicException("The image with the given id was not found", BusinessError.NOT_FOUND);
        return await this.imageRepository.save({...persistedImage, ...image});
    }

    async delete(id: string) {
        const image: ImageEntity = await this.imageRepository.findOne({where: {id}});
        if(!image)
            throw new BusinessLogicException("The image with the given id was not found", BusinessError.NOT_FOUND);
        await this.imageRepository.remove(image);
    }
}
