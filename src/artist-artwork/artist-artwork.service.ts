import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtistEntity } from '../artist/artist.entity/artist.entity';
import { ArtworkEntity } from '../artwork/artwork.entity/artwork.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ArtistArtworkService {

    cacheKey: string = "artistArtworks-";

    constructor(
        @InjectRepository(ArtistEntity)
        private readonly artistRepository: Repository<ArtistEntity>,

        @InjectRepository(ArtworkEntity)
        private readonly artworkRepository: Repository<ArtworkEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async createArtworkArtist(artistId: string, artwork: ArtworkEntity): Promise<ArtworkEntity>{
        const artist: ArtistEntity = await this.artistRepository.findOne({where: {id: artistId}, relations: ["artworks", "movements"]});
        if (!artist)
            throw new BusinessLogicException("The artist with the given id was not found", BusinessError.NOT_FOUND);

        let newArtwork: ArtworkEntity = await this.artworkRepository.save(artwork);
    
        artist.artworks = [...artist.artworks, newArtwork];
        await this.artistRepository.save(artist);

        return await this.artworkRepository.findOne({where: {id: newArtwork.id}, relations: ["museum", "exhibition", "images", "artist"]});
    }

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
        const cachedArtistArtworks: ArtworkEntity[] = await this.cacheManager.get<ArtworkEntity[]>(this.cacheKey+artistId); 
        
        if(!cachedArtistArtworks){
            const artist: ArtistEntity = await this.artistRepository.findOne({where: {id: artistId}, relations: ["artworks", "movements"]});
            if (!artist)
                throw new BusinessLogicException("The artist with the given id was not found", BusinessError.NOT_FOUND);
            await this.cacheManager.set(this.cacheKey+artistId, artist.artworks);
            return artist.artworks;
        }
        return cachedArtistArtworks;
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
