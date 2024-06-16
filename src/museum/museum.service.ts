import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MuseumEntity } from './museum.entity/museum.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class MuseumService {

    cacheKey: string = "museums";

    constructor(
        @InjectRepository(MuseumEntity)
        private readonly museumRepository: Repository<MuseumEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async findAll(): Promise<MuseumEntity[]> {
        const cachedMuseums: MuseumEntity[] = await this.cacheManager.get<MuseumEntity[]>(this.cacheKey);
        if(!cachedMuseums){
            const museums: MuseumEntity[] = await this.museumRepository.find({ relations: ["artworks", "exhibitions"]});
            await this.cacheManager.set(this.cacheKey, museums);
            return museums;
        }
        return cachedMuseums;
    }

    async findOne(id: string): Promise<MuseumEntity> {
        const cachedMuseum: MuseumEntity = await this.cacheManager.get<MuseumEntity>(id);
        if(!cachedMuseum){
            const museum: MuseumEntity = await this.museumRepository.findOne({where: {id}, relations: ["artworks", "exhibitions"]});
            if (!museum)
                throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND);
            await this.cacheManager.set(id, museum);
            return museum;
        }
        return cachedMuseum;
    }

    async create(museum: MuseumEntity): Promise<MuseumEntity> {
        return await this.museumRepository.save(museum);
    }
    
    async update(id: string, museum: MuseumEntity): Promise<MuseumEntity> {
        const persistedMuseum: MuseumEntity = await this.museumRepository.findOne({where: {id}});
        if (!persistedMuseum)
            throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND);
        return await this.museumRepository.save({...persistedMuseum, ...museum});
    }

    async delete(id: string) {
        const museum: MuseumEntity = await this.museumRepository.findOne({where: {id}});
        if(!museum)
            throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND);
        await this.museumRepository.remove(museum);
    }
}
