import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtworkEntity } from '../artwork/artwork.entity/artwork.entity';
import { ExhibitionEntity } from '../exhibition/exhibition.entity/exhibition.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ExhibitionArtworkService {

    constructor(
        @InjectRepository(ExhibitionEntity)
        private readonly exhibitionRepository: Repository<ExhibitionEntity>,

        @InjectRepository(ArtworkEntity)
        private readonly artworkRepository: Repository<ArtworkEntity>
    ){}

    async addArtworkExhibition(exhibitionId: string, artworkId: string): Promise<ExhibitionEntity>{
        const artwork: ArtworkEntity = await this.artworkRepository.findOne({where: {id: artworkId}});
        if(!artwork)
            throw new BusinessLogicException("The artwork with the given id was not found", BusinessError.NOT_FOUND);
    
        const exhibition: ExhibitionEntity = await this.exhibitionRepository.findOne({where: {id: exhibitionId}, relations: ["museum", "artworks", "sponsor"]});
        if (!exhibition)
            throw new BusinessLogicException("The exhibition with the given id was not found", BusinessError.NOT_FOUND);
    
        exhibition.artworks = [...exhibition.artworks, artwork];
        return await this.exhibitionRepository.save(exhibition);
    }

    async findArtworkByExhibitionIdArtworkId(exhibitionId: string, artworkId: string): Promise<ArtworkEntity>{
        const artwork: ArtworkEntity = await this.artworkRepository.findOne({where: {id: artworkId}});
        if(!artwork)
            throw new BusinessLogicException("The artwork with the given id was not found", BusinessError.NOT_FOUND);

        const exhibition: ExhibitionEntity = await this.exhibitionRepository.findOne({where: {id: exhibitionId}, relations: ["museum", "artworks", "sponsor"]});
        if (!exhibition)
            throw new BusinessLogicException("The exhibition with the given id was not found", BusinessError.NOT_FOUND);

        const exhibitionArtwork: ArtworkEntity = exhibition.artworks.find(e => e.id === artwork.id);

        if (!exhibitionArtwork)
            throw new BusinessLogicException("The artwork with the given id is not associated to the exhibition", BusinessError.PRECONDITION_FAILED);

        return exhibitionArtwork;
    }

    async findArtworksByExhibitionId(exhibitionId:string): Promise<ArtworkEntity[]> {
        const exhibition: ExhibitionEntity = await this.exhibitionRepository.findOne({where: {id: exhibitionId}, relations: ["museum", "artworks", "sponsor"]});
        if (!exhibition)
            throw new BusinessLogicException("The exhibition with the given id was not found", BusinessError.NOT_FOUND);
        return exhibition.artworks;
    }

    async associateArtworksExhibition(exhibitionId: string, artworks: ArtworkEntity[]): Promise<ExhibitionEntity> {
        const exhibition: ExhibitionEntity = await this.exhibitionRepository.findOne({where: {id: exhibitionId}, relations: ["museum", "artworks", "sponsor"]});
        if (!exhibition)
            throw new BusinessLogicException("The exhibition with the given id was not found", BusinessError.NOT_FOUND);

        for(let i = 0; i < artworks.length; i++){
            const artwork: ArtworkEntity = await this.artworkRepository.findOne({where: {id: artworks[i].id}});
            if(!artwork)
                throw new BusinessLogicException("The artwork with the given id was not found", BusinessError.NOT_FOUND);
        }

        exhibition.artworks = artworks;
        
        return await this.exhibitionRepository.save(exhibition);
    }

    async deleteArtworkExhibition(exhibitionId: string, artworkId: string){
        const artwork: ArtworkEntity = await this.artworkRepository.findOne({where: {id: artworkId}});
            if(!artwork)
                throw new BusinessLogicException("The artwork with the given id was not found", BusinessError.NOT_FOUND);

        const exhibition: ExhibitionEntity = await this.exhibitionRepository.findOne({where: {id: exhibitionId}, relations: ["museum", "artworks", "sponsor"]});
            if (!exhibition)
                throw new BusinessLogicException("The exhibition with the given id was not found", BusinessError.NOT_FOUND);

        const exhibitionArtwork: ArtworkEntity = exhibition.artworks.find(e => e.id === artwork.id);

        if (!exhibitionArtwork)
            throw new BusinessLogicException("The artwork with the given id is not associated to the exhibition", BusinessError.PRECONDITION_FAILED);

        exhibition.artworks = exhibition.artworks.filter(e => e.id !== artworkId);
        await this.exhibitionRepository.save(exhibition);
    }

}
