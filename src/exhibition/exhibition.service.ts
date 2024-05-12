import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExhibitionEntity } from './exhibition.entity/exhibition.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ExhibitionService {

    constructor(
        @InjectRepository(ExhibitionEntity)
        private readonly exhibitionRepository: Repository<ExhibitionEntity>
    ){}

    async findAll(): Promise<ExhibitionEntity[]> {
        return await this.exhibitionRepository.find({ relations: ["museum", "artworks", "sponsor"]});
    }

    async findOne(id: string): Promise<ExhibitionEntity> {
        const exhibition: ExhibitionEntity = await this.exhibitionRepository.findOne({where: {id}, relations: ["museum", "artworks", "sponsor"]});
        if(!exhibition)
            throw new BusinessLogicException("The exhibition with the given id was not found", BusinessError.NOT_FOUND);
        return exhibition;
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
