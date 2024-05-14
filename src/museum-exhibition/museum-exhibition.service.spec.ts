import { Test, TestingModule } from '@nestjs/testing';
import { MuseumExhibitionService } from './museum-exhibition.service';
import { ExhibitionEntity } from '../exhibition/exhibition.entity/exhibition.entity';
import { MuseumEntity } from '../museum/museum.entity/museum.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('MuseumExhibitionService', () => {
  let service: MuseumExhibitionService;
  let museumRepository: Repository<MuseumEntity>;
  let exhibitionRepository: Repository<ExhibitionEntity>;
  let museum: MuseumEntity;
  let exhibitionList: ExhibitionEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MuseumExhibitionService],
    }).compile();

    service = module.get<MuseumExhibitionService>(MuseumExhibitionService);
    exhibitionRepository = module.get<Repository<ExhibitionEntity>>(getRepositoryToken(ExhibitionEntity));
    museumRepository = module.get<Repository<MuseumEntity>>(getRepositoryToken(MuseumEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    exhibitionRepository.clear();
    museumRepository.clear();

    exhibitionList = [];
    for(let i = 0; i < 5; i++){
      const exhibition: ExhibitionEntity = await exhibitionRepository.save({
        name: faker.lorem.word(),
        description: faker.lorem.sentence()
      });
      exhibitionList.push(exhibition);
    }

    museum = await museumRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      address: faker.location.secondaryAddress(),
      city: faker.location.city(),
      image: faker.image.url(),
      exhibitions: exhibitionList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addExhibitionMuseum should add an exhibition to a museum', async () => {
    const newExhibition: ExhibitionEntity = await exhibitionRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence()
    });

    const newMuseum: MuseumEntity = await museumRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      address: faker.location.secondaryAddress(),
      city: faker.location.city(),
      image: faker.image.url()
    })

    const result: MuseumEntity = await service.addExhibitionMuseum(newMuseum.id, newExhibition.id); 

    expect(result.exhibitions.length).toBe(1);
    expect(result.exhibitions).not.toBeNull();
    expect(result.exhibitions[0].name).toBe(newExhibition.name);
    expect(result.exhibitions[0].description).toBe(newExhibition.description);
  });

  it('addExhibitionMuseum should throw an exception for an invalid exhibition', async () => {
    const newMuseum: MuseumEntity = await museumRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      address: faker.location.secondaryAddress(),
      city: faker.location.city(),
      image: faker.image.url()
    })

    await expect(() => service.addExhibitionMuseum(newMuseum.id, "0")).rejects.toHaveProperty("message", "The exhibition with the given id was not found");
  });

  it('addExhibitionMuseum should throw an exception for an invalid museum', async () => {
    const newExhibition: ExhibitionEntity = await exhibitionRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence()
    });
    await expect(() => service.addExhibitionMuseum("0", newExhibition.id)).rejects.toHaveProperty("message", "The museum with the given id was not found");
  });

  it('findExhibitionByMuseumIdExhibitionId should return an exhibition by museum', async () => {
    const exhibition: ExhibitionEntity = exhibitionList[0];
    const storedExhibition: ExhibitionEntity = await service.findExhibitionByMuseumIdExhibitionId(museum.id, exhibition.id);
    expect(storedExhibition).not.toBeNull();
    expect(storedExhibition.name).toBe(exhibition.name);
    expect(storedExhibition.description).toBe(exhibition.description);
  });

  it('findExhibitionByMuseumIdExhibitionId should throw an exception for an invalid exhibition', async () => {
    await expect(() => service.findExhibitionByMuseumIdExhibitionId(museum.id, "0")).rejects.toHaveProperty("message", "The exhibition with the given id was not found");
  });

  it('findExhibitionByMuseumIdExhibitionId should throw an exception for an invalid museum', async () => {
    const exhibition: ExhibitionEntity = exhibitionList[0];
    await expect(() => service.findExhibitionByMuseumIdExhibitionId("0", exhibition.id)).rejects.toHaveProperty("message", "The museum with the given id was not found");
  });

  it('findExhibitionByMuseumIdExhibitionId should throw an exception for an exhibition not associated to the museum', async () => {
    const newExhibition: ExhibitionEntity = await exhibitionRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence()
    });

    await expect(() => service.findExhibitionByMuseumIdExhibitionId(museum.id, newExhibition.id)).rejects.toHaveProperty("message", "The exhibition with the given id is not associated to the museum");
  });

  it('findExhibitionsByMuseumId should return the exhibitions of a museum', async () => {
    const exhibitions: ExhibitionEntity[] = await service.findExhibitionsByMuseumId(museum.id);
    expect(exhibitions.length).toBe(5);
  });

  it('findExhibitionsByMuseumId should throw an error for an invalid museum', async () => {
    await expect(() => service.findExhibitionsByMuseumId("0")).rejects.toHaveProperty("message", "The museum with the given id was not found");
  });

  it('associateExhibitionsMuseum should update the exhibition list for a museum', async() => {
    const newExhibition: ExhibitionEntity = await exhibitionRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence()
    });

    const updatedMuseum: MuseumEntity = await service.associateExhibitionsMuseum(museum.id, [newExhibition]);
    expect(updatedMuseum.exhibitions.length).toBe(1);

    expect(updatedMuseum.exhibitions[0].name).toBe(newExhibition.name);
    expect(updatedMuseum.exhibitions[0].description).toBe(newExhibition.description);
  });

  it('associateExhibitionsMuseum should should throw an error for an invalid museum', async() => {
    const newExhibition: ExhibitionEntity = await exhibitionRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence()
    });

    await expect(() => service.associateExhibitionsMuseum("0", [newExhibition])).rejects.toHaveProperty("message", "The museum with the given id was not found");
  });

  it('associateExhibitionsMuseum should throw an error for an invalid exhibition', async() => {
    const newExhibition: ExhibitionEntity = exhibitionList[0];
    newExhibition.id = "0";
    await expect(() => service.associateExhibitionsMuseum(museum.id, [newExhibition])).rejects.toHaveProperty("message", "The exhibition with the given id was not found");
  });

  it('deleteExhibitionMuseum should remove an exhibitions from a museum', async() => {
    const exhibition: ExhibitionEntity = exhibitionList[0];

    await service.deleteExhibitionMuseum(museum.id, exhibition.id);

    const storedMuseum: MuseumEntity = await museumRepository.findOne({where: {id: museum.id}, relations: ["artworks", "exhibitions"]});
    const deletedExhibition: ExhibitionEntity = storedMuseum.exhibitions.find(e => e.id === exhibition.id);
    expect(deletedExhibition).toBeUndefined();
  });

  it('deleteExhibitionMuseum should throw an error for an invalid exhibition', async() => {
    await expect(() => service.deleteExhibitionMuseum(museum.id, "0")).rejects.toHaveProperty("message", "The exhibition with the given id was not found");
  });

  it('deleteExhibitionMuseum should throw an error for an invalid museum', async() => {
    const exhibition: ExhibitionEntity = exhibitionList[0];
    await expect(() => service.deleteExhibitionMuseum("0", exhibition.id)).rejects.toHaveProperty("message", "The museum with the given id was not found");
  });

  it('deleteExhibitionMuseum should throw an exception for an exhibition not associated to the museum', async () => {
    const newExhibition: ExhibitionEntity = await exhibitionRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence()
    });

    await expect(() => service.deleteExhibitionMuseum(museum.id, newExhibition.id)).rejects.toHaveProperty("message", "The exhibition with the given id is not associated to the museum");
  });
});
