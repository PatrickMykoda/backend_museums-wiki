import { Test, TestingModule } from '@nestjs/testing';
import { ArtworkService } from './artwork.service';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ArtworkEntity } from './artwork.entity/artwork.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ArtworkService', () => {
  let service: ArtworkService;
  let repository: Repository<ArtworkEntity>;
  let artworkList: ArtworkEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ArtworkService],
    }).compile();

    service = module.get<ArtworkService>(ArtworkService);
    repository = module.get<Repository<ArtworkEntity>>(getRepositoryToken(ArtworkEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    artworkList = [];
    for(let i = 0; i < 5; i++){
      const artwork: ArtworkEntity = await repository.save({
        name: faker.music.songName(),
        year: Math.floor(Math.random() * (2025)),
        description: faker.lorem.paragraph(),
        type: faker.lorem.word(),
        mainImage: faker.image.url()
      });
      artworkList.push(artwork);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all artworks', async () => {
    const artworks: ArtworkEntity[] = await service.findAll();
    expect(artworks).not.toBeNull();
    expect(artworks).toHaveLength(artworkList.length);
  });

  it('findOne should return an artwork by id', async () => {
    const storedArtwork: ArtworkEntity = artworkList[0];
    const artwork: ArtworkEntity = await service.findOne(storedArtwork.id);
    expect(artwork).not.toBeNull();
    expect(artwork.name).toEqual(storedArtwork.name);
    expect(artwork.year).toEqual(storedArtwork.year);
    expect(artwork.description).toEqual(storedArtwork.description);
    expect(artwork.type).toEqual(storedArtwork.type);
    expect(artwork.mainImage).toEqual(storedArtwork.mainImage);
  });

  it('findOne should throw an exception for an invalid artwork', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The artwork with the given id was not found");
  });

  it('create should return a new artwork', async () => {
    const artwork: ArtworkEntity = {
      id: "",
      name: faker.music.songName(),
      year: Math.floor(Math.random() * 2025),
      description: faker.lorem.sentence(),
      type: faker.lorem.word(),
      mainImage: faker.image.url(),
      museum: null,
      exhibition: null,
      images: [],
      artist: null
    }

    const newArtwork: ArtworkEntity = await service.create(artwork);
    expect(newArtwork).not.toBeNull();

    const storedArtwork: ArtworkEntity = await repository.findOne({where: {id: newArtwork.id}});
    expect(storedArtwork).not.toBeNull();
    expect(storedArtwork.name).toEqual(newArtwork.name);
    expect(storedArtwork.year).toEqual(newArtwork.year);
    expect(storedArtwork.description).toEqual(newArtwork.description);
    expect(storedArtwork.type).toEqual(newArtwork.type);
    expect(storedArtwork.mainImage).toEqual(newArtwork.mainImage);
  });

  it('update should modify an artwork', async () => {
    const artwork: ArtworkEntity = artworkList[0];
    artwork.name = "New name";
    artwork.description = "New description";
    const updatedArtwork: ArtworkEntity = await service.update(artwork.id, artwork);
    expect(updatedArtwork).not.toBeNull();
    const storedArtwork: ArtworkEntity = await repository.findOne({where: {id: artwork.id}});
    expect(storedArtwork).not.toBeNull();
    expect(storedArtwork.name).toEqual(artwork.name);
    expect(storedArtwork.description).toEqual(artwork.description);
  });

  it('update should throw an exception for an invalid artwork', async () => {
    let artwork: ArtworkEntity = artworkList[0];
    artwork = {
      ...artwork, name: "New name", description: "New description"
    }
    await expect(() => service.update("0", artwork)).rejects.toHaveProperty("message", "The artwork with the given id was not found");
  });

  it('delete should remove an artwork by id', async () => {
    const artwork: ArtworkEntity = artworkList[0];
    await service.delete(artwork.id);
    const deletedArtwork: ArtworkEntity = await repository.findOne({where: {id: artwork.id}});
    expect(deletedArtwork).toBeNull();
  });

  it('delete should throw an exception for an invalid artwork', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The artwork with the given id was not found");
  });
});
