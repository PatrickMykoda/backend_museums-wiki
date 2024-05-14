import { Test, TestingModule } from '@nestjs/testing';
import { ExhibitionSponsorService } from './exhibition-sponsor.service';
import { SponsorEntity } from '../sponsor/sponsor.entity/sponsor.entity';
import { ExhibitionEntity } from '../exhibition/exhibition.entity/exhibition.entity';
import { Repository } from 'typeorm';
import { ArtworkEntity } from '../artwork/artwork.entity/artwork.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ExhibitionSponsorService', () => {
  let service: ExhibitionSponsorService;
  let exhibitionRepository: Repository<ExhibitionEntity>;
  let sponsorRepository: Repository<SponsorEntity>;
  let exhibition: ExhibitionEntity;
  let sponsor: SponsorEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ExhibitionSponsorService],
    }).compile();

    service = module.get<ExhibitionSponsorService>(ExhibitionSponsorService);
    sponsorRepository = module.get<Repository<SponsorEntity>>(getRepositoryToken(SponsorEntity));
    exhibitionRepository = module.get<Repository<ExhibitionEntity>>(getRepositoryToken(ExhibitionEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    sponsorRepository.clear();
    exhibitionRepository.clear();

    sponsor = await sponsorRepository.save({
      name: faker.person.fullName(),
      description: faker.lorem.sentence(),
      website: faker.internet.url()
    });

    exhibition = await exhibitionRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      sponsor: sponsor
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSponsorExhibition should add (and update) a new sponsor to an exhibition', async () => {
    const newSponsor: SponsorEntity = await sponsorRepository.save({
      name: faker.person.fullName(),
      description: faker.lorem.sentence(),
      website: faker.internet.url()
    });

    const newExhibition: ExhibitionEntity = await exhibitionRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
    })

    const result: ExhibitionEntity = await service.addSponsorExhibition(newExhibition.id, newSponsor.id); 

    expect(result.sponsor).not.toBeNull();
    expect(result.sponsor.name).toBe(newSponsor.name);
    expect(result.sponsor.description).toBe(newSponsor.description);
    expect(result.sponsor.website).toBe(newSponsor.website);
  });

  it('addSponsorExhibition should modify the sponsor of an exhibition', async () => {
    const newSponsor: SponsorEntity = await sponsorRepository.save({
      name: faker.person.fullName(),
      description: faker.lorem.sentence(),
      website: faker.internet.url()
    });

    const result: ExhibitionEntity = await service.addSponsorExhibition(exhibition.id, newSponsor.id); 

    expect(result.sponsor).not.toBeNull();
    expect(result.sponsor.name).toBe(newSponsor.name);
    expect(result.sponsor.description).toBe(newSponsor.description);
    expect(result.sponsor.website).toBe(newSponsor.website);
  });

  it('addSponsorExhibition should throw an exception for an invalid sponsor', async () => {
    const newExhibition: ExhibitionEntity = await exhibitionRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
    })

    await expect(() => service.addSponsorExhibition(newExhibition.id, "0")).rejects.toHaveProperty("message", "The sponsor with the given id was not found");
  });

  it('addSponsorExhibition should throw an exception for an invalid exhibition', async () => {
    const newSponsor: SponsorEntity = await sponsorRepository.save({
      name: faker.person.fullName(),
      description: faker.lorem.sentence(),
      website: faker.internet.url()
    });
    await expect(() => service.addSponsorExhibition("0", newSponsor.id)).rejects.toHaveProperty("message", "The exhibition with the given id was not found");
  });

  it('findSponsorByExhibitionId should return the sponsor of an exhibition', async () => {
    const storedSponsor: SponsorEntity = await service.findSponsorByExhibitionId(exhibition.id);
    expect(storedSponsor).not.toBeNull();
    expect(storedSponsor.name).toBe(sponsor.name);
    expect(storedSponsor.description).toBe(sponsor.description);
    expect(storedSponsor.website).toBe(sponsor.website);
  });

  it('findSponsorByExhibitionId should throw an error for an invalid exhibition', async () => {
    await expect(() => service.findSponsorByExhibitionId("0")).rejects.toHaveProperty("message", "The exhibition with the given id was not found");
  });

  it('deleteSponsorExhibition should remove a sponsor from an exhibition', async() => {
    await service.deleteSponsorExhibition(exhibition.id, sponsor.id);

    const storedExhibition: ExhibitionEntity = await exhibitionRepository.findOne({where: {id: exhibition.id}, relations: ["artworks", "sponsor"]});
    const deletedSponsor: SponsorEntity = storedExhibition.sponsor;
    expect(deletedSponsor).toBe(null);
  });

  it('deleteSponsorExhibition should throw an error for an invalid sponsor', async() => {
    await expect(() => service.deleteSponsorExhibition(exhibition.id, "0")).rejects.toHaveProperty("message", "The sponsor with the given id was not found");
  });

  it('deleteSponsorExhibition should throw an error for an invalid exhibition', async() => {
    await expect(() => service.deleteSponsorExhibition("0", sponsor.id)).rejects.toHaveProperty("message", "The exhibition with the given id was not found");
  });

  it('deleteSponsorExhibition should throw an exception for an artwork not associated to the artist', async () => {
    const newSponsor: SponsorEntity = await sponsorRepository.save({
      name: faker.person.fullName(),
      description: faker.lorem.sentence(),
      website: faker.internet.url()
    });

    await expect(() => service.deleteSponsorExhibition(exhibition.id, newSponsor.id)).rejects.toHaveProperty("message", "The sponsor with the given id is not associated to the exhibition");
  });
});
