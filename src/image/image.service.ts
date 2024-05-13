import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from './image.entity/image.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ImageService {

    constructor(
        @InjectRepository(ImageEntity)
        private readonly imageRepository: Repository<ImageEntity>
    ){}

    async findAll(): Promise<ImageEntity[]> {
        return await this.imageRepository.find({ relations: ["artwork"]});
    }

    async findOne(id: string): Promise<ImageEntity> {
        const image: ImageEntity = await this.imageRepository.findOne({where: {id}, relations: ["artwork"]});
        if (!image)
            throw new BusinessLogicException("The image with the given id was not found", BusinessError.NOT_FOUND);
        return image;
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
