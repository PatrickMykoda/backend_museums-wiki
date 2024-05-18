import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SponsorEntity } from './sponsor.entity/sponsor.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class SponsorService {

    constructor(
        @InjectRepository(SponsorEntity)
        private readonly sponsorRepository: Repository<SponsorEntity>
    ){}

    async findAll(): Promise<SponsorEntity[]> {
        return await this.sponsorRepository.find({relations: ["exhibitions"]});
    }

    async findOne(id: string): Promise<SponsorEntity> {
        const sponsor: SponsorEntity = await this.sponsorRepository.findOne({where: {id}, relations: ["exhibitions"]});
        if(!sponsor)
            throw new BusinessLogicException("The sponsor with the given id was not found", BusinessError.NOT_FOUND);
        return sponsor;
    }

    async create(sponsor: SponsorEntity): Promise<SponsorEntity> {
        return await this.sponsorRepository.save(sponsor);
    }

    async update(id: string, sponsor: SponsorEntity): Promise<SponsorEntity>{
        const persistedSponsor: SponsorEntity = await this.sponsorRepository.findOne({where: {id}});
        if(!persistedSponsor)
            throw new BusinessLogicException("The sponsor with the given id was not found", BusinessError.NOT_FOUND);
        return await this.sponsorRepository.save({...persistedSponsor, ...sponsor});
    }

    async delete(id: string) {
        const sponsor: SponsorEntity = await this.sponsorRepository.findOne({where: {id}});
        if(!sponsor)
            throw new BusinessLogicException("The sponsor with the given id was not found", BusinessError.NOT_FOUND);
        return await this.sponsorRepository.remove(sponsor);
    }
}
