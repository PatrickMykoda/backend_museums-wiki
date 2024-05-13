import { Test, TestingModule } from '@nestjs/testing';
import { MovementService } from './movement.service';
import { Repository } from 'typeorm';
import { MovementEntity } from './movement.entity/movement.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('MovementService', () => {
  let service: MovementService;
  let repository: Repository<MovementEntity>;
  let movementList: MovementEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MovementService],
    }).compile();

    service = module.get<MovementService>(MovementService);
    repository = module.get<Repository<MovementEntity>>(getRepositoryToken(MovementEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    movementList = [];
    for(let i=0; i < 5; i++){
      const movement: MovementEntity = await repository.save({
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        countryOfOrigin: faker.location.country()
      });
      movementList.push(movement);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all movements', async () => {
    const movements: MovementEntity[] = await service.findAll();
    expect(movements).not.toBeNull();
    expect(movements).toHaveLength(movementList.length);
  });

  it('findOne should return a movement by id', async () => {
    const storedMovement: MovementEntity = movementList[0];
    const movement: MovementEntity = await service.findOne(storedMovement.id);
    expect(movement).not.toBeNull();
    expect(movement.name).toEqual(storedMovement.name);
    expect(movement.description).toEqual(storedMovement.description);
    expect(movement.countryOfOrigin).toEqual(storedMovement.countryOfOrigin);
  });

  it('findOne should throw an exception for an invalid movement', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The movement with the given id was not found");
  });

  it('create should return a new movement', async () => {
    const movement: MovementEntity = {
      id: "",
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      countryOfOrigin: faker.location.country(),
      artists: []
    }

    const newMovement: MovementEntity = await service.create(movement);
    expect(newMovement).not.toBeNull();

    const storedMovement: MovementEntity = await repository.findOne({where: {id: newMovement.id}});
    expect(storedMovement).not.toBeNull();
    expect(storedMovement.name).toEqual(newMovement.name);
    expect(storedMovement.description).toEqual(newMovement.description);
    expect(storedMovement.countryOfOrigin).toEqual(newMovement.countryOfOrigin);
  });

  it('update should modify a movement', async () => {
    const movement: MovementEntity = movementList[0];
    movement.name = "New name";
    movement.description = "New description";
    const updatedMovement: MovementEntity = await service.update(movement.id, movement);
    expect(updatedMovement).not.toBeNull();
    const storedMovement: MovementEntity = await repository.findOne({where: {id: movement.id}});
    expect(storedMovement).not.toBeNull();
    expect(storedMovement.name).toEqual(movement.name);
    expect(storedMovement.description).toEqual(movement.description);
  });

  it('update should throw an exception for an invalid movement', async () => {
    let movement: MovementEntity = movementList[0];
    movement = {
      ...movement, name: "New name", description: "New description"
    }
    await expect(() => service.update("0", movement)).rejects.toHaveProperty("message", "The movement with the given id was not found");
  });

  it('delete should remove a movement', async () => {
    const movement: MovementEntity = movementList[0];
    await service.delete(movement.id);
    const deletedMovement: MovementEntity = await repository.findOne({where: {id: movement.id}});
    expect(deletedMovement).toBeNull();
  });

  it('delete should throw an exception for an invalid movement', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The movement with the given id was not found");
  });
});
