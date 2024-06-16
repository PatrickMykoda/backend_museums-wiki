import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SponsorEntity } from './sponsor.entity/sponsor.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class SponsorService {

    cacheKey: string = "sponsors";

    constructor(
        @InjectRepository(SponsorEntity)
        private readonly sponsorRepository: Repository<SponsorEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async findAll(): Promise<SponsorEntity[]> {
        const cachedSponsors: SponsorEntity[] = await this.cacheManager.get<SponsorEntity[]>(this.cacheKey);
        if(!cachedSponsors){
            const sponsors: SponsorEntity[] = await this.sponsorRepository.find({relations: ["exhibitions"]});
            await this.cacheManager.set(this.cacheKey, sponsors);
            return sponsors;
        }
        return cachedSponsors;
    }

    async findOne(id: string): Promise<SponsorEntity> {
        const cachedSponsor: SponsorEntity = await this.cacheManager.get<SponsorEntity>(id);
        if(!cachedSponsor){
            const sponsor: SponsorEntity = await this.sponsorRepository.findOne({where: {id}, relations: ["exhibitions"]});
            if (!sponsor)
                throw new BusinessLogicException("The sponsor with the given id was not found", BusinessError.NOT_FOUND);
            await this.cacheManager.set(id, sponsor);
            return sponsor;
        }
        return cachedSponsor;
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
