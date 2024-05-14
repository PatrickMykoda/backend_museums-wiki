import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExhibitionEntity } from '../exhibition/exhibition.entity/exhibition.entity';
import { SponsorEntity } from '../sponsor/sponsor.entity/sponsor.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ExhibitionSponsorService {

    constructor(
        @InjectRepository(ExhibitionEntity)
        private readonly exhibitionRepository: Repository<ExhibitionEntity>,

        @InjectRepository(SponsorEntity)
        private readonly sponsorRepository: Repository<SponsorEntity>
    ){}

    async addSponsorExhibition(exhibitionId: string, sponsorId: string): Promise<ExhibitionEntity>{
        const sponsor: SponsorEntity = await this.sponsorRepository.findOne({where: {id: sponsorId}});
        if(!sponsor)
            throw new BusinessLogicException("The sponsor with the given id was not found", BusinessError.NOT_FOUND);
    
        const exhibition: ExhibitionEntity = await this.exhibitionRepository.findOne({where: {id: exhibitionId}, relations: ["museum", "artworks", "sponsor"]});
        if (!exhibition)
            throw new BusinessLogicException("The exhibition with the given id was not found", BusinessError.NOT_FOUND);
    
        exhibition.sponsor = sponsor;
        return await this.exhibitionRepository.save(exhibition);
    }

    async findSponsorByExhibitionId(exhibitionId:string): Promise<SponsorEntity> {
        const exhibition: ExhibitionEntity = await this.exhibitionRepository.findOne({where: {id: exhibitionId}, relations: ["museum", "artworks", "sponsor"]});
        if (!exhibition)
            throw new BusinessLogicException("The exhibition with the given id was not found", BusinessError.NOT_FOUND);
        return exhibition.sponsor;
    }

    async deleteSponsorExhibition(exhibitionId: string, sponsorId: string){
        const sponsor: SponsorEntity = await this.sponsorRepository.findOne({where: {id: sponsorId}});
        if(!sponsor)
            throw new BusinessLogicException("The sponsor with the given id was not found", BusinessError.NOT_FOUND);

        const exhibition: ExhibitionEntity = await this.exhibitionRepository.findOne({where: {id: exhibitionId}, relations: ["museum", "artworks", "sponsor"]});
            if (!exhibition)
                throw new BusinessLogicException("The exhibition with the given id was not found", BusinessError.NOT_FOUND);

        if(exhibition.sponsor.id !== sponsorId){
            throw new BusinessLogicException("The sponsor with the given id is not associated to the exhibition", BusinessError.PRECONDITION_FAILED);
        }
            
        exhibition.sponsor = null;
        await this.exhibitionRepository.save(exhibition);
    }

}
