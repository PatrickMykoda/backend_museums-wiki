import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExhibitionEntity } from './exhibition.entity/exhibition.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ExhibitionService {

    cacheKey: string = "exhibitions";

    constructor(
        @InjectRepository(ExhibitionEntity)
        private readonly exhibitionRepository: Repository<ExhibitionEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async findAll(): Promise<ExhibitionEntity[]> {
        const cachedExhibitions: ExhibitionEntity[] = await this.cacheManager.get<ExhibitionEntity[]>(this.cacheKey);
        if(!cachedExhibitions){
            const exhibitions: ExhibitionEntity[] = await this.exhibitionRepository.find({ relations: ["museum", "artworks", "sponsor"]});
            await this.cacheManager.set(this.cacheKey, exhibitions);
            return exhibitions;
        }
        return cachedExhibitions;
    }

    async findOne(id: string): Promise<ExhibitionEntity> {
        const cachedExhibition: ExhibitionEntity = await this.cacheManager.get<ExhibitionEntity>(id);
        if(!cachedExhibition){
            const exhibition: ExhibitionEntity = await this.exhibitionRepository.findOne({where: {id}, relations: ["museum", "artworks", "sponsor"]});
            if(!exhibition)
                throw new BusinessLogicException("The exhibition with the given id was not found", BusinessError.NOT_FOUND);
            await this.cacheManager.set(id, exhibition);
            return exhibition;
        }
        return cachedExhibition;
    }

    async create(exhibition: ExhibitionEntity): Promise<ExhibitionEntity> {
        return await this.exhibitionRepository.save(exhibition);
    }

    async update(id: string, exhibition: ExhibitionEntity): Promise<ExhibitionEntity> {
        const persistedExhibition: ExhibitionEntity = await this.exhibitionRepository.findOne({where: {id}});
        if (!persistedExhibition)
            throw new BusinessLogicException("The exhibition with the given id was not found", BusinessError.NOT_FOUND);
        return await this.exhibitionRepository.save({...persistedExhibition, ...exhibition});
    }

    async delete(id: string){
        const exhibition: ExhibitionEntity = await this.exhibitionRepository.findOne({where: {id}});
        if(!exhibition)
            throw new BusinessLogicException("The exhibition with the given id was not found", BusinessError.NOT_FOUND);
        await this.exhibitionRepository.remove(exhibition);
    }
}
