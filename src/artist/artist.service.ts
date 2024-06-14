import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtistEntity } from './artist.entity/artist.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ArtistService {

    cacheKey: string = "artists";

    constructor(
        @InjectRepository(ArtistEntity)
        private readonly artistRepository: Repository<ArtistEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async findAll(): Promise<ArtistEntity[]> {
        const cachedArtists: ArtistEntity[] = await this.cacheManager.get<ArtistEntity[]>(this.cacheKey);

        if(!cachedArtists){
            const artists: ArtistEntity[] = await this.artistRepository.find({ relations: ["artworks", "movements"]});
            await this.cacheManager.set(this.cacheKey, artists);
            return artists;
        }
        return cachedArtists;
    }

    async findOne(id: string): Promise<ArtistEntity>{
        const cachedArtist: ArtistEntity = await this.cacheManager.get<ArtistEntity>(id);

        if(!cachedArtist){
            const artist: ArtistEntity = await this.artistRepository.findOne({where: {id}, relations: ["artworks", "movements"]});
            if (!artist)
                throw new BusinessLogicException("The artist with the given id was not found", BusinessError.NOT_FOUND);
            await this.cacheManager.set(id, artist);
            return artist;
        }
        return cachedArtist;
    }

    async create(artist: ArtistEntity): Promise<ArtistEntity>{
        return await this.artistRepository.save(artist);
    }

    async update(id: string, artist: ArtistEntity): Promise<ArtistEntity>{
        const persistedArtist: ArtistEntity = await this.artistRepository.findOne({ where: {id}});
        if (!persistedArtist)
            throw new BusinessLogicException("The artist with the given id was not found", BusinessError.NOT_FOUND);
        return await this.artistRepository.save({...persistedArtist, ...artist});
    }

    async delete(id: string){
        const artist: ArtistEntity = await this.artistRepository.findOne({where: {id}});
        if (!artist)
            throw new BusinessLogicException("The artist with the given id was not found", BusinessError.NOT_FOUND);
        await this.artistRepository.remove(artist);
    }
}
