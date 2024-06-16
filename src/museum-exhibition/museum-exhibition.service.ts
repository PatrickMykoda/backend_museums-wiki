import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MuseumEntity } from '../museum/museum.entity/museum.entity';
import { ExhibitionEntity } from '../exhibition/exhibition.entity/exhibition.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class MuseumExhibitionService {

    cacheKey: string = "museumExhibitions-";

    constructor(
        @InjectRepository(MuseumEntity)
        private readonly museumRepository: Repository<MuseumEntity>,

        @InjectRepository(ExhibitionEntity)
        private readonly exhibitionRepository: Repository<ExhibitionEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async createExhibitionMuseum(museumId: string, exhibition: ExhibitionEntity): Promise<ExhibitionEntity>{
        const museum: MuseumEntity = await this.museumRepository.findOne({where: {id: museumId}, relations: ["exhibitions", "artworks"]});
        if (!museum)
            throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND);

        let newExhibition: ExhibitionEntity = await this.exhibitionRepository.save(exhibition);
    
        museum.exhibitions = [...museum.exhibitions, newExhibition];
        await this.museumRepository.save(museum);

        return await this.exhibitionRepository.findOne({where: {id: newExhibition.id}, relations: ["museum", "artworks", "sponsor"]});
    }

    async addExhibitionMuseum(museumId: string, exhibitionId: string): Promise<MuseumEntity> {
        const exhibition: ExhibitionEntity = await this.exhibitionRepository.findOne({where: {id: exhibitionId}});
        if (!exhibition)
            throw new BusinessLogicException("The exhibition with the given id was not found", BusinessError.NOT_FOUND);
    
        const museum: MuseumEntity = await this.museumRepository.findOne({where: {id: museumId}, relations: ["artworks", "exhibitions"]});
        if (!museum)
            throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND);
    
        museum.exhibitions = [...museum.exhibitions, exhibition];
        return await this.museumRepository.save(museum);
    }

    async findExhibitionByMuseumIdExhibitionId(museumId: string, exhibitionId: string): Promise<ExhibitionEntity>{
        const exhibition: ExhibitionEntity = await this.exhibitionRepository.findOne({where: {id: exhibitionId}});
        if (!exhibition)
            throw new BusinessLogicException("The exhibition with the given id was not found", BusinessError.NOT_FOUND);

        const museum: MuseumEntity = await this.museumRepository.findOne({where: {id: museumId}, relations: ["artworks", "exhibitions"]});
        if (!museum)
            throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND);

        const museumExhibition: ExhibitionEntity = museum.exhibitions.find(e => e.id === exhibition.id);

        if (!museumExhibition)
            throw new BusinessLogicException("The exhibition with the given id is not associated to the museum", BusinessError.PRECONDITION_FAILED);

        return museumExhibition;
    }

    async findExhibitionsByMuseumId(museumId:string): Promise<ExhibitionEntity[]> {
        const cachedMuseumExhibitions: ExhibitionEntity[] = await this.cacheManager.get<ExhibitionEntity[]>(this.cacheKey + museumId);
        if(!cachedMuseumExhibitions){
            const museum: MuseumEntity = await this.museumRepository.findOne({where: {id: museumId}, relations: ["exhibitions"]});
            if (!museum)
                throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND);
            await this.cacheManager.set(this.cacheKey + museumId, museum.exhibitions);
            return museum.exhibitions;
        }
        return cachedMuseumExhibitions;
    }

    async associateExhibitionsMuseum(museumId: string, exhibitions: ExhibitionEntity[]): Promise<MuseumEntity> {
        const museum: MuseumEntity = await this.museumRepository.findOne({where: {id: museumId}, relations: ["artworks", "exhibitions"]});
        if (!museum)
            throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND);

        for(let i = 0; i < exhibitions.length; i++){
            const exhibition: ExhibitionEntity = await this.exhibitionRepository.findOne({where: {id: exhibitions[i].id}});
            if (!exhibition)
                throw new BusinessLogicException("The exhibition with the given id was not found", BusinessError.NOT_FOUND);
        }

        museum.exhibitions = exhibitions;
        
        return await this.museumRepository.save(museum);
    }

    async deleteExhibitionMuseum(museumId: string, exhibitionId: string){
        const exhibition: ExhibitionEntity = await this.exhibitionRepository.findOne({where: {id: exhibitionId}});
        if (!exhibition)
            throw new BusinessLogicException("The exhibition with the given id was not found", BusinessError.NOT_FOUND);

        const museum: MuseumEntity = await this.museumRepository.findOne({where: {id: museumId}, relations: ["artworks", "exhibitions"]});
            if (!museum)
                throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND);

        const museumExhibition: ExhibitionEntity = museum.exhibitions.find(e => e.id === exhibition.id);

        if (!museumExhibition)
            throw new BusinessLogicException("The exhibition with the given id is not associated to the museum", BusinessError.PRECONDITION_FAILED);

        museum.exhibitions = museum.exhibitions.filter(e => e.id !== exhibitionId);
        await this.museumRepository.save(museum);
    }
}
