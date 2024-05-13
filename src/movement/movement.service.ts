import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovementEntity } from './movement.entity/movement.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class MovementService {

    constructor(
        @InjectRepository(MovementEntity)
        private readonly movementRepository: Repository<MovementEntity>
    ){}

    async findAll(): Promise<MovementEntity[]>{
        return await this.movementRepository.find({relations: ["artists"]});
    }

    async findOne(id: string): Promise<MovementEntity> {
        const movement: MovementEntity = await this.movementRepository.findOne({where: {id}, relations: ["artists"]});
        if(!movement)
            throw new BusinessLogicException("The movement with the given id was not found", BusinessError.NOT_FOUND);
        return movement;
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
