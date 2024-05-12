import { Test, TestingModule } from '@nestjs/testing';
import { ExhibitionService } from './exhibition.service';
import { Repository } from 'typeorm';
import { ExhibitionEntity } from './exhibition.entity/exhibition.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ExhibitionService', () => {
  let service: ExhibitionService;
  let repository: Repository<ExhibitionEntity>;
  let exhibitionList: ExhibitionEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ExhibitionService],
    }).compile();

    service = module.get<ExhibitionService>(ExhibitionService);
    repository = module.get<Repository<ExhibitionEntity>>(getRepositoryToken(ExhibitionEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    exhibitionList = [];
    for(let i = 0; i < 5; i++){
      const exhibition: ExhibitionEntity = await repository.save({
        name: faker.music.songName(),
        description: faker.lorem.sentence()
      });
      exhibitionList.push(exhibition);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all exhibitions', async () => {
    const exhibitions: ExhibitionEntity[] = await service.findAll();
    expect(exhibitions).not.toBeNull();
    expect(exhibitions).toHaveLength(exhibitionList.length);
  });

  it('findOne returns an exhibition by id', async () => {
    const storedExhibition: ExhibitionEntity = exhibitionList[0];
    const exhibition: ExhibitionEntity = await service.findOne(storedExhibition.id);
    expect(exhibition).not.toBeNull();
    expect(exhibition.name).toEqual(storedExhibition.name);
    expect(exhibition.description).toEqual(storedExhibition.description);
  });

  it('findOnd should throw an exception for an invalid exhibition', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The exhibition with the given id was not found");
  });

  it('create should return a new exhibition', async () => {
    const exhibition: ExhibitionEntity = {
      id: "",
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      museum: null,
      artworks: [],
      sponsor: null
    }

    const newExhibition: ExhibitionEntity = await service.create(exhibition);
    expect(newExhibition).not.toBeNull();

    const storedExhibition: ExhibitionEntity = await repository.findOne({where: { id: newExhibition.id}});
    expect(storedExhibition).not.toBeNull();
    expect(storedExhibition.name).toEqual(newExhibition.name);
    expect(storedExhibition.description).toEqual(newExhibition.description);
  });

  it('update should modify an exhibition', async () => {
    const exhibition: ExhibitionEntity = exhibitionList[0];
    exhibition.name = "New name";
    exhibition.description = "New description";
    const updatedExhibition: ExhibitionEntity = await service.update(exhibition.id, exhibition);
    expect(updatedExhibition).not.toBeNull();
    const storedExhibition: ExhibitionEntity = await repository.findOne({where: {id: exhibition.id}});
    expect(storedExhibition).not.toBeNull();
    expect(storedExhibition.name).toEqual(exhibition.name);
    expect(storedExhibition.description).toEqual(exhibition.description);
  });

  it('update should throw an exception for an invalid exhibition', async () => {
    let exhibition: ExhibitionEntity = exhibitionList[0];
    exhibition = {
      ...exhibition, name: "New name", description: "New description"
    }
    await expect(() => service.update("0", exhibition)).rejects.toHaveProperty("message", "The exhibition with the given id was not found");
  });

  it('delete should remove an exhibition by id', async () => {
    const exhibition: ExhibitionEntity = exhibitionList[0];
    await service.delete(exhibition.id);
    const deletedExhibition: ExhibitionEntity = await repository.findOne({where: {id: exhibition.id}});
    expect(deletedExhibition).toBeNull();
  });

  it('delete should throw an exception for an invalid exhibition', async () =>{
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The exhibition with the given id was not found");
  });

});
