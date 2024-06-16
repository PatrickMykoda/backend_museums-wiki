import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtworkEntity } from './artwork.entity/artwork.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ArtworkService {

    cacheKey: string = "artworks";

    constructor(
        @InjectRepository(ArtworkEntity)
        private readonly artworkRepository: Repository<ArtworkEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async findAll(): Promise<ArtworkEntity[]> {
        const cachedArtworks: ArtworkEntity[] = await this.cacheManager.get<ArtworkEntity[]>(this.cacheKey);

        if(!cachedArtworks){
            const artworks: ArtworkEntity[] = await this.artworkRepository.find({ relations: ["museum", "exhibition", "images", "artist"]});
            await this.cacheManager.set(this.cacheKey, artworks);
            return artworks;
        }
        return cachedArtworks;
    };

    async findOne(id: string): Promise<ArtworkEntity> {
        const cachedArtwork: ArtworkEntity = await this.cacheManager.get<ArtworkEntity>(id);

        if(!cachedArtwork){
            const artwork: ArtworkEntity = await this.artworkRepository.findOne({where: {id}, relations: ["museum", "exhibition", "images", "artist"]});
            if (!artwork)
                throw new BusinessLogicException("The artwork with the given id was not found", BusinessError.NOT_FOUND);
            await this.cacheManager.set(id, artwork);
            return artwork;
        }
        return cachedArtwork;
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
        return await this.artworkRepository.remove(artwork);
    }
}