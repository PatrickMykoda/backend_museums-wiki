import { Test, TestingModule } from '@nestjs/testing';
import { SponsorExhibitionService } from './sponsor-exhibition.service';
import { SponsorEntity } from '../sponsor/sponsor.entity/sponsor.entity';
import { ExhibitionEntity } from '../exhibition/exhibition.entity/exhibition.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SponsorExhibitionService', () => {
  let service: SponsorExhibitionService;
  let sponsorRepository: Repository<SponsorEntity>;
  let exhibitionRepository: Repository<ExhibitionEntity>;
  let sponsor: SponsorEntity;
  let exhibitionList: ExhibitionEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SponsorExhibitionService],
    }).compile();

    service = module.get<SponsorExhibitionService>(SponsorExhibitionService);
    exhibitionRepository = module.get<Repository<ExhibitionEntity>>(getRepositoryToken(ExhibitionEntity));
    sponsorRepository = module.get<Repository<SponsorEntity>>(getRepositoryToken(SponsorEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    exhibitionRepository.clear();
    sponsorRepository.clear();

    exhibitionList = [];
    for(let i = 0; i < 5; i++){
      const exhibition: ExhibitionEntity = await exhibitionRepository.save({
        name: faker.lorem.word(),
        description: faker.lorem.sentence()
      });
      exhibitionList.push(exhibition);
    }

    sponsor = await sponsorRepository.save({
      name: faker.person.fullName(),
      description: faker.lorem.sentence(),
      website: faker.internet.url(),
      exhibitions: exhibitionList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addExhibitionSponsor should add an exhibition to a sponsor', async () => {
    const newExhibition: ExhibitionEntity = await exhibitionRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence()
    });

    const newSponsor: SponsorEntity = await sponsorRepository.save({
      name: faker.person.fullName(),
      description: faker.lorem.sentence(),
      website: faker.internet.url()
    })

    const result: SponsorEntity = await service.addExhibitionSponsor(newSponsor.id, newExhibition.id); 

    expect(result.exhibitions.length).toBe(1);
    expect(result.exhibitions).not.toBeNull();
    expect(result.exhibitions[0].name).toBe(newExhibition.name);
    expect(result.exhibitions[0].description).toBe(newExhibition.description);
  });

  it('addExhibitionSponsor should throw an exception for an invalid exhibition', async () => {
    const newSponsor: SponsorEntity = await sponsorRepository.save({
      name: faker.person.fullName(),
      description: faker.lorem.sentence(),
      website: faker.internet.url()
    })

    await expect(() => service.addExhibitionSponsor(newSponsor.id, "0")).rejects.toHaveProperty("message", "The exhibition with the given id was not found");
  });

  it('addExhibitionSponsor should throw an exception for an invalid sponsor', async () => {
    const newExhibition: ExhibitionEntity = await exhibitionRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence()
    });
    await expect(() => service.addExhibitionSponsor("0", newExhibition.id)).rejects.toHaveProperty("message", "The sponsor with the given id was not found");
  });

  it('findExhibitionBySponsorIdExhibitionId should return an exhibition by sponsor', async () => {
    const exhibition: ExhibitionEntity = exhibitionList[0];
    const storedExhibition: ExhibitionEntity = await service.findExhibitionBySponsorIdExhibitionId(sponsor.id, exhibition.id);
    expect(storedExhibition).not.toBeNull();
    expect(storedExhibition.name).toBe(exhibition.name);
    expect(storedExhibition.description).toBe(exhibition.description);
  });

  it('findExhibitionBySponsorIdExhibitionId should throw an exception for an invalid exhibition', async () => {
    await expect(() => service.findExhibitionBySponsorIdExhibitionId(sponsor.id, "0")).rejects.toHaveProperty("message", "The exhibition with the given id was not found");
  });

  it('findExhibitionBySponsorIdExhibitionId should throw an exception for an invalid sponsor', async () => {
    const exhibition: ExhibitionEntity = exhibitionList[0];
    await expect(() => service.findExhibitionBySponsorIdExhibitionId("0", exhibition.id)).rejects.toHaveProperty("message", "The sponsor with the given id was not found");
  });

  it('findExhibitionBySponsorIdExhibitionId should throw an exception for an exhibition not associated to the sponsor', async () => {
    const newExhibition: ExhibitionEntity = await exhibitionRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence()
    });

    await expect(() => service.findExhibitionBySponsorIdExhibitionId(sponsor.id, newExhibition.id)).rejects.toHaveProperty("message", "The exhibition with the given id is not associated to the sponsor");
  });

  it('findExhibitionsBySponsor should return the exhibitions of a sponsor', async () => {
    const exhibitions: ExhibitionEntity[] = await service.findExhibitionsBySponsorId(sponsor.id);
    expect(exhibitions.length).toBe(5);
  });

  it('findExhibitionsBySponsorId should throw an error for an invalid sponsor', async () => {
    await expect(() => service.findExhibitionsBySponsorId("0")).rejects.toHaveProperty("message", "The sponsor with the given id was not found");
  });

  it('associateExhibitionsSponsor should update the exhibition list for a sponsor', async() => {
    const newExhibition: ExhibitionEntity = await exhibitionRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence()
    });

    const updatedSponsor: SponsorEntity = await service.associateExhibitionsSponsor(sponsor.id, [newExhibition]);
    expect(updatedSponsor.exhibitions.length).toBe(1);

    expect(updatedSponsor.exhibitions[0].name).toBe(newExhibition.name);
    expect(updatedSponsor.exhibitions[0].description).toBe(newExhibition.description);
  });

  it('associateExhibitionsSponsor should should throw an error for an invalid sponsor', async() => {
    const newExhibition: ExhibitionEntity = await exhibitionRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence()
    });

    await expect(() => service.associateExhibitionsSponsor("0", [newExhibition])).rejects.toHaveProperty("message", "The sponsor with the given id was not found");
  });

  it('associateExhibitionsSponsor should throw an error for an invalid exhibition', async() => {
    const newExhibition: ExhibitionEntity = exhibitionList[0];
    newExhibition.id = "0";
    await expect(() => service.associateExhibitionsSponsor(sponsor.id, [newExhibition])).rejects.toHaveProperty("message", "The exhibition with the given id was not found");
  });

  it('deleteExhibitionSponsor should remove an exhibitions from a sponsor', async() => {
    const exhibition: ExhibitionEntity = exhibitionList[0];

    await service.deleteExhibitionSponsor(sponsor.id, exhibition.id);

    const storedSponsor: SponsorEntity = await sponsorRepository.findOne({where: {id: sponsor.id}, relations: ["exhibitions"]});
    const deletedExhibition: ExhibitionEntity = storedSponsor.exhibitions.find(e => e.id === exhibition.id);
    expect(deletedExhibition).toBeUndefined();
  });

  it('deleteExhibitionSponsor should throw an error for an invalid exhibition', async() => {
    await expect(() => service.deleteExhibitionSponsor(sponsor.id, "0")).rejects.toHaveProperty("message", "The exhibition with the given id was not found");
  });

  it('deleteExhibitionSponsor should throw an error for an invalid sponsor', async() => {
    const exhibition: ExhibitionEntity = exhibitionList[0];
    await expect(() => service.deleteExhibitionSponsor("0", exhibition.id)).rejects.toHaveProperty("message", "The sponsor with the given id was not found");
  });

  it('deleteExhibitionSponsor should throw an exception for an exhibition not associated to the sponsor', async () => {
    const newExhibition: ExhibitionEntity = await exhibitionRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence()
    });

    await expect(() => service.deleteExhibitionSponsor(sponsor.id, newExhibition.id)).rejects.toHaveProperty("message", "The exhibition with the given id is not associated to the sponsor");
  });
});
