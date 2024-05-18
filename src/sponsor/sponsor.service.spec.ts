import { Test, TestingModule } from '@nestjs/testing';
import { SponsorService } from './sponsor.service';
import { Repository } from 'typeorm';
import { SponsorEntity } from './sponsor.entity/sponsor.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('SponsorService', () => {
  let service: SponsorService;
  let repository: Repository<SponsorEntity>
  let sponsorList: SponsorEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SponsorService],
    }).compile();

    service = module.get<SponsorService>(SponsorService);
    repository = module.get<Repository<SponsorEntity>>(getRepositoryToken(SponsorEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    sponsorList = [];
    for(let i = 0; i < 5; i++){
      const sponsor: SponsorEntity = await repository.save({
        name: faker.person.fullName(),
        description: faker.lorem.sentence(),
        website: faker.internet.url()
      });
      sponsorList.push(sponsor);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all sponsors', async () => {
    const sponsors: SponsorEntity[] = await service.findAll();
    expect(sponsors).not.toBeNull();
    expect(sponsors).toHaveLength(sponsorList.length);
  });

  it('findOne should return a sponsor by id', async () => {
    const storedSponsor: SponsorEntity = sponsorList[0];
    const sponsor: SponsorEntity = await service.findOne(storedSponsor.id);
    expect(sponsor).not.toBeNull();
    expect(sponsor.name).toEqual(storedSponsor.name);
    expect(sponsor.description).toEqual(storedSponsor.description);
    expect(sponsor.website).toEqual(storedSponsor.website);
  });

  it('findOne should throw an exception for an invalid sponsor', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The sponsor with the given id was not found");
  });

  it('create should return a new sponsor', async () => {
    const sponsor: SponsorEntity = {
      id: "",
      name: faker.person.fullName(),
      description: faker.lorem.sentence(),
      website: faker.internet.url(),
      exhibitions: []
    }

    const newSponsor: SponsorEntity = await service.create(sponsor);
    expect(newSponsor).not.toBeNull();

    const storedSponsor: SponsorEntity = await repository.findOne({where: {id: newSponsor.id}});
    expect(storedSponsor).not.toBeNull();
    expect(storedSponsor.name).toEqual(newSponsor.name);
    expect(storedSponsor.description).toEqual(newSponsor.description);
    expect(storedSponsor.website).toEqual(newSponsor.website);
  });

  it('update should modify a sponsor', async () => {
    const sponsor: SponsorEntity = sponsorList[0];
    sponsor.name = "New name";
    sponsor.description = "New description";
    const updatedSponsor: SponsorEntity = await service.update(sponsor.id, sponsor);
    expect(updatedSponsor).not.toBeNull();
    const storedSponsor: SponsorEntity = await repository.findOne({ where: { id: sponsor.id}});
    expect(storedSponsor).not.toBeNull();
    expect(storedSponsor.name).toEqual(sponsor.name);
    expect(storedSponsor.description).toEqual(sponsor.description);
  });

  it('update should throw an exception for an invalid sponsor', async () => {
    let sponsor: SponsorEntity = sponsorList[0];
    sponsor = {
      ...sponsor, name: "New name", description: "New description"
    }
    await expect(() => service.update("0", sponsor)).rejects.toHaveProperty("message", "The sponsor with the given id was not found");
  });

  it('delete should remove a sponsor', async () => {
    const sponsor: SponsorEntity = sponsorList[0];
    await service.delete(sponsor.id);
    const deletedSponsor: SponsorEntity = await repository.findOne({ where: {id: sponsor.id}});
    expect(deletedSponsor).toBeNull();
  });

  it('delete should throw an exception for an invalid sponsor', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The sponsor with the given id was not found");
  });
});
