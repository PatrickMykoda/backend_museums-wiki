import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtistEntity } from '../artist/artist.entity/artist.entity';
import { ArtworkEntity } from '../artwork/artwork.entity/artwork.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ArtistArtworkService {

    constructor(
        @InjectRepository(ArtistEntity)
        private readonly artistRepository: Repository<ArtistEntity>,

        @InjectRepository(ArtworkEntity)
        private readonly artworkRepository: Repository<ArtworkEntity>
    ){}

    async addArtworkArtist(artistId: string, artworkId: string): Promise<ArtistEntity>{
        const artwork: ArtworkEntity = await this.artworkRepository.findOne({where: {id: artworkId}});
        if(!artwork)
            throw new BusinessLogicException("The artwork with the given id was not found", BusinessError.NOT_FOUND);
    
        const artist: ArtistEntity = await this.artistRepository.findOne({where: {id: artistId}, relations: ["artworks", "movements"]});
        if (!artist)
            throw new BusinessLogicException("The artist with the given id was not found", BusinessError.NOT_FOUND);
    
        artist.artworks = [...artist.artworks, artwork];
        return await this.artistRepository.save(artist);
    }

    async findArtworkByArtistIdArtworkId(artistId: string, artworkId: string): Promise<ArtworkEntity>{
        const artwork: ArtworkEntity = await this.artworkRepository.findOne({where: {id: artworkId}});
        if(!artwork)
            throw new BusinessLogicException("The artwork with the given id was not found", BusinessError.NOT_FOUND);

        const artist: ArtistEntity = await this.artistRepository.findOne({where: {id: artistId}, relations: ["artworks", "movements"]});
        if (!artist)
            throw new BusinessLogicException("The artist with the given id was not found", BusinessError.NOT_FOUND);

        const artistArtwork: ArtworkEntity = artist.artworks.find(e => e.id === artwork.id);

        if (!artistArtwork)
            throw new BusinessLogicException("The artwork with the given id is not associated to the artist", BusinessError.PRECONDITION_FAILED);

        return artistArtwork;
    }

    async findArtworksByArtistId(artistId:string): Promise<ArtworkEntity[]> {
        const artist: ArtistEntity = await this.artistRepository.findOne({where: {id: artistId}, relations: ["artworks", "movements"]});
        if (!artist)
            throw new BusinessLogicException("The artist with the given id was not found", BusinessError.NOT_FOUND);
        return artist.artworks;
    }

    async associateArtworksArtist(artistId: string, artworks: ArtworkEntity[]): Promise<ArtistEntity> {
        const artist: ArtistEntity = await this.artistRepository.findOne({where: {id: artistId}, relations: ["artworks", "movements"]});
        if (!artist)
            throw new BusinessLogicException("The artist with the given id was not found", BusinessError.NOT_FOUND);

        for(let i = 0; i < artworks.length; i++){
            const artwork: ArtworkEntity = await this.artworkRepository.findOne({where: {id: artworks[i].id}});
            if(!artwork)
                throw new BusinessLogicException("The artwork with the given id was not found", BusinessError.NOT_FOUND);
        }

        artist.artworks = artworks;
        
        return await this.artistRepository.save(artist);
    }

    async deleteArtworkArtist(artistId: string, artworkId: string){
        const artwork: ArtworkEntity = await this.artworkRepository.findOne({where: {id: artworkId}});
            if(!artwork)
                throw new BusinessLogicException("The artwork with the given id was not found", BusinessError.NOT_FOUND);

        const artist: ArtistEntity = await this.artistRepository.findOne({where: {id: artistId}, relations: ["artworks", "movements"]});
            if (!artist)
                throw new BusinessLogicException("The artist with the given id was not found", BusinessError.NOT_FOUND);

        const artistArtwork: ArtworkEntity = artist.artworks.find(e => e.id === artwork.id);

        if (!artistArtwork)
            throw new BusinessLogicException("The artwork with the given id is not associated to the artist", BusinessError.PRECONDITION_FAILED);

        artist.artworks = artist.artworks.filter(e => e.id !== artworkId);
        await this.artistRepository.save(artist);
    }
}