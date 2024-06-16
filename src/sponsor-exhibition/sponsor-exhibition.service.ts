import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExhibitionEntity } from '../exhibition/exhibition.entity/exhibition.entity';
import { SponsorEntity } from '../sponsor/sponsor.entity/sponsor.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class SponsorExhibitionService {

    cacheKey: string = "sponsorExhibitions-";

    constructor(
        @InjectRepository(SponsorEntity)
        private readonly sponsorRepository: Repository<SponsorEntity>,

        @InjectRepository(ExhibitionEntity)
        private readonly exhibitionRepository: Repository<ExhibitionEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async addExhibitionSponsor(sponsorId: string, exhibitionId: string): Promise<SponsorEntity> {
        const exhibition: ExhibitionEntity = await this.exhibitionRepository.findOne({where: {id: exhibitionId}});
        if (!exhibition)
            throw new BusinessLogicException("The exhibition with the given id was not found", BusinessError.NOT_FOUND);
    
        const sponsor: SponsorEntity = await this.sponsorRepository.findOne({where: {id: sponsorId}, relations: ["exhibitions"]});
        if (!sponsor)
            throw new BusinessLogicException("The sponsor with the given id was not found", BusinessError.NOT_FOUND);
    
        sponsor.exhibitions = [...sponsor.exhibitions, exhibition];
        return await this.sponsorRepository.save(sponsor);
    }

    async findExhibitionBySponsorIdExhibitionId(sponsorId: string, exhibitionId: string): Promise<ExhibitionEntity>{
        const exhibition: ExhibitionEntity = await this.exhibitionRepository.findOne({where: {id: exhibitionId}});
        if (!exhibition)
            throw new BusinessLogicException("The exhibition with the given id was not found", BusinessError.NOT_FOUND);

        const sponsor: SponsorEntity = await this.sponsorRepository.findOne({where: {id: sponsorId}, relations: ["exhibitions"]});
        if (!sponsor)
            throw new BusinessLogicException("The sponsor with the given id was not found", BusinessError.NOT_FOUND);

        const sponsorExhibition: ExhibitionEntity = sponsor.exhibitions.find(e => e.id === exhibition.id);

        if (!sponsorExhibition)
            throw new BusinessLogicException("The exhibition with the given id is not associated to the sponsor", BusinessError.PRECONDITION_FAILED);

        return sponsorExhibition;
    }

    async findExhibitionsBySponsorId(sponsorId:string): Promise<ExhibitionEntity[]> {
        const cachedExhibitions: ExhibitionEntity[] = await this.cacheManager.get<ExhibitionEntity[]>(this.cacheKey + sponsorId);
        if(!cachedExhibitions){
            const sponsor: SponsorEntity = await this.sponsorRepository.findOne({where: {id: sponsorId}, relations: ["exhibitions"]});
            if (!sponsor)
                throw new BusinessLogicException("The sponsor with the given id was not found", BusinessError.NOT_FOUND);
            await this.cacheManager.set(this.cacheKey + sponsorId, sponsor.exhibitions);
            return sponsor.exhibitions;
        }
        return cachedExhibitions;
    }

    async associateExhibitionsSponsor(sponsorId: string, exhibitions: ExhibitionEntity[]): Promise<SponsorEntity> {
        const sponsor: SponsorEntity = await this.sponsorRepository.findOne({where: {id: sponsorId}, relations: ["exhibitions"]});
        if (!sponsor)
            throw new BusinessLogicException("The sponsor with the given id was not found", BusinessError.NOT_FOUND);

        for(let i = 0; i < exhibitions.length; i++){
            const exhibition: ExhibitionEntity = await this.exhibitionRepository.findOne({where: {id: exhibitions[i].id}});
            if (!exhibition)
                throw new BusinessLogicException("The exhibition with the given id was not found", BusinessError.NOT_FOUND);
        }

        sponsor.exhibitions = exhibitions;
        
        return await this.sponsorRepository.save(sponsor);
    }

    async deleteExhibitionSponsor(sponsorId: string, exhibitionId: string){
        const exhibition: ExhibitionEntity = await this.exhibitionRepository.findOne({where: {id: exhibitionId}});
        if (!exhibition)
            throw new BusinessLogicException("The exhibition with the given id was not found", BusinessError.NOT_FOUND);

        const sponsor: SponsorEntity = await this.sponsorRepository.findOne({where: {id: sponsorId}, relations: ["exhibitions"]});
        if (!sponsor)
            throw new BusinessLogicException("The sponsor with the given id was not found", BusinessError.NOT_FOUND);

        const sponsorExhibition: ExhibitionEntity = sponsor.exhibitions.find(e => e.id === exhibition.id);

        if (!sponsorExhibition)
            throw new BusinessLogicException("The exhibition with the given id is not associated to the sponsor", BusinessError.PRECONDITION_FAILED);

        sponsor.exhibitions = sponsor.exhibitions.filter(e => e.id !== exhibitionId);
        await this.sponsorRepository.save(sponsor);
    }
}
