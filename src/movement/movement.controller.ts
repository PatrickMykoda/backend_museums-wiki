import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { MovementService } from './movement.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { MovementDto } from './movement.dto/movement.dto';
import { MovementEntity } from './movement.entity/movement.entity';
import { plainToInstance } from 'class-transformer';

@Controller('movements')
@UseInterceptors(BusinessErrorsInterceptor)
export class MovementController {

    constructor(
        private readonly movementService: MovementService
    ){}

    @Get()
    async findAll(){
        return await this.movementService.findAll();
    }

    @Get(':movementId')
    async findOne(@Param('movementId') movementId: string){
        return await this.movementService.findOne(movementId);
    }

    @Post()
    async create(@Body() movementDto: MovementDto){
        const movement: MovementEntity = plainToInstance(MovementEntity, movementDto);
        return await this.movementService.create(movement);
    }

    @Put(':movementId')
    async update(@Param('movementId') movementId: string, @Body() movementDto: MovementDto){
        const movement: MovementEntity = plainToInstance(MovementEntity, movementDto);
        return await this.movementService.update(movementId, movement); 
    }

    @Delete(':movementId')
    @HttpCode(204)
    async delete(@Param('movementId') movementId: string){
        return await this.movementService.delete(movementId);
    }
}
