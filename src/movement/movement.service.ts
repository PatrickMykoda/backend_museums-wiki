import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovementEntity } from './movement.entity/movement.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class MovementService {

    cacheKey: string = "movements";

    constructor(
        @InjectRepository(MovementEntity)
        private readonly movementRepository: Repository<MovementEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async findAll(): Promise<MovementEntity[]>{
        const cachedMovements: MovementEntity[] = await this.cacheManager.get<MovementEntity[]>(this.cacheKey);
        if(!cachedMovements){
            const movements: MovementEntity[] = await this.movementRepository.find({relations: ["artists"]});
            await this.cacheManager.set(this.cacheKey, movements);
            return movements;
        }
        return cachedMovements;
    }

    async findOne(id: string): Promise<MovementEntity> {
        const cachedMovement: MovementEntity = await this.cacheManager.get<MovementEntity>(id);
        if(!cachedMovement){
            const movement: MovementEntity = await this.movementRepository.findOne({where: {id}, relations: ["artists"]});
            if (!movement)
                throw new BusinessLogicException("The movement with the given id was not found", BusinessError.NOT_FOUND);
            await this.cacheManager.set(id, movement);
            return movement;
        }
        return cachedMovement;
    }

    async create(movement: MovementEntity): Promise<MovementEntity>{
        return await this.movementRepository.save(movement);
    }

    async update(id: string, movement: MovementEntity): Promise<MovementEntity>{
        const persistedMovement: MovementEntity = await this.movementRepository.findOne({where: {id}});
        if (!persistedMovement)
            throw new BusinessLogicException("The movement with the given id was not found", BusinessError.NOT_FOUND);
        return await this.movementRepository.save({...persistedMovement,...movement});
    }

    async delete(id: string){
        const movement: MovementEntity = await this.movementRepository.findOne({where: {id}});
        if(!movement)
            throw new BusinessLogicException("The movement with the given id was not found", BusinessError.NOT_FOUND);
        await this.movementRepository.remove(movement);
    }
}
