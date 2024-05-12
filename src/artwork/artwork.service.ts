import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtworkEntity } from './artwork.entity/artwork.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ArtworkService {

    constructor(
        @InjectRepository(ArtworkEntity)
        private readonly artworkRepository: Repository<ArtworkEntity>
    ){}

    async findAll(): Promise<ArtworkEntity[]> {
        return await this.artworkRepository.find({ relations: ["museum", "exhibition", "images", "artist"]});
    };

    async findOne(id: string): Promise<ArtworkEntity> {
        const artwork: ArtworkEntity = await this.artworkRepository.findOne({where: {id}, relations: ["museum", "exhibition", "images", "artist"]});
        if(!artwork)
            throw new BusinessLogicException("The artwork with the given id was not found", BusinessError.NOT_FOUND);
        return artwork;
    };

    async create(artwork: ArtworkEntity): Promise<ArtworkEntity> {
        return await this.artworkRepository.save(artwork);
    }

    async update(id: string, artwork: ArtworkEntity): Promise<ArtworkEntity> {
        const persistedArtwork: ArtworkEntity = await this.artworkRepository.findOne({where: {id}});
        if (!persistedArtwork)
            throw new BusinessLogicException("The artwork with the given id was not found", BusinessError.NOT_FOUND);
        return await this.artworkRepository.save({...persistedArtwork, ...artwork});
    }

    async delete(id: string) {
        const artwork: ArtworkEntity = await this.artworkRepository.findOne({where: {id}});
        if(!artwork)
            throw new BusinessLogicException("The artwork with the given id was not found", BusinessError.NOT_FOUND);
        await this.artworkRepository.remove(artwork);
    }
}