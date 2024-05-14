import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtistEntity } from '../artist/artist.entity/artist.entity';
import { MovementEntity } from '../movement/movement.entity/movement.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class MovementArtistService {

    constructor(

        @InjectRepository(ArtistEntity)
        private readonly artistRepository: Repository<ArtistEntity>,

        @InjectRepository(MovementEntity)
        private readonly movementRepository: Repository<MovementEntity>
    ){}

    async addArtistMovement(movementId: string, artistId: string): Promise<MovementEntity>{
        const movement: MovementEntity = await this.movementRepository.findOne({where: {id: movementId}, relations: ["artists"]});
        if(!movement)
            throw new BusinessLogicException("The movement with the given id was not found", BusinessError.NOT_FOUND);
    
        const artist: ArtistEntity = await this.artistRepository.findOne({where: {id: artistId}});
        if (!artist)
            throw new BusinessLogicException("The artist with the given id was not found", BusinessError.NOT_FOUND);
    
        movement.artists = [...movement.artists, artist];
        return await this.movementRepository.save(movement);
    }

    async findArtistByMovementIdArtistId(movementId: string, artistId: string): Promise<ArtistEntity>{
        const movement: MovementEntity = await this.movementRepository.findOne({where: {id: movementId}, relations: ["artists"]});
        if(!movement)
            throw new BusinessLogicException("The movement with the given id was not found", BusinessError.NOT_FOUND);
    
        const artist: ArtistEntity = await this.artistRepository.findOne({where: {id: artistId}});
        if (!artist)
            throw new BusinessLogicException("The artist with the given id was not found", BusinessError.NOT_FOUND);

        const movementArtist: ArtistEntity = movement.artists.find(e => e.id === artist.id);

        if (!movementArtist)
            throw new BusinessLogicException("The artist with the given id is not associated to the movement", BusinessError.PRECONDITION_FAILED);

        return movementArtist;
    }

    async findArtistsByMovementId(movementId:string): Promise<ArtistEntity[]> {
        const movement: MovementEntity = await this.movementRepository.findOne({where: {id: movementId}, relations: ["artists"]});
        if(!movement)
            throw new BusinessLogicException("The movement with the given id was not found", BusinessError.NOT_FOUND);
        return movement.artists;
    }

    async associateArtistsMovement(movementId: string, artists: ArtistEntity[]): Promise<MovementEntity> {
        const movement: MovementEntity = await this.movementRepository.findOne({where: {id: movementId}, relations: ["artists"]});
        if(!movement)
            throw new BusinessLogicException("The movement with the given id was not found", BusinessError.NOT_FOUND);

        for(let i = 0; i < artists.length; i++){
            const artist: ArtistEntity = await this.artistRepository.findOne({where: {id: artists[i].id}});
            if(!artist)
                throw new BusinessLogicException("The artist with the given id was not found", BusinessError.NOT_FOUND);
        }

        movement.artists = artists;
        
        return await this.movementRepository.save(movement);
    }

    async deleteArtistMovement(movementId: string, artistId: string){
        const artist: ArtistEntity = await this.artistRepository.findOne({where: {id: artistId}});
            if (!artist)
                throw new BusinessLogicException("The artist with the given id was not found", BusinessError.NOT_FOUND);

        const movement: MovementEntity = await this.movementRepository.findOne({where: {id: movementId}, relations: ["artists"]});
            if(!movement)
                throw new BusinessLogicException("The movement with the given id was not found", BusinessError.NOT_FOUND);

        const movementArtist: ArtistEntity = movement.artists.find(e => e.id === artist.id);

        if (!movementArtist)
            throw new BusinessLogicException("The artist with the given id is not associated to the movement", BusinessError.PRECONDITION_FAILED);

        movement.artists = movement.artists.filter(e => e.id !== artistId);
        await this.movementRepository.save(movement);
    }
}
