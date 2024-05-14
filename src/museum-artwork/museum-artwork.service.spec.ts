import { Test, TestingModule } from '@nestjs/testing';
import { MuseumArtworkService } from './museum-artwork.service';
import { Repository } from 'typeorm';
import { MuseumEntity } from '../museum/museum.entity/museum.entity';
import { ArtworkEntity } from '../artwork/artwork.entity/artwork.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('MuseumArtworkService', () => {
  let service: MuseumArtworkService;
  let museumRepository: Repository<MuseumEntity>;
  let artworkRepository: Repository<ArtworkEntity>;
  let museum: MuseumEntity;
  let artworkList: ArtworkEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MuseumArtworkService],
    }).compile();

    service = module.get<MuseumArtworkService>(MuseumArtworkService);
    artworkRepository = module.get<Repository<ArtworkEntity>>(getRepositoryToken(ArtworkEntity));
    museumRepository = module.get<Repository<MuseumEntity>>(getRepositoryToken(MuseumEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    artworkRepository.clear();
    museumRepository.clear();

    artworkList = [];
    for(let i = 0; i < 5; i++){
      const artwork: ArtworkEntity = await artworkRepository.save({
        name: faker.music.songName(),
        year: Math.floor(Math.random() * (2025)),
        description: faker.lorem.paragraph(),
        type: faker.lorem.word(),
        mainImage: faker.image.url()
      });
      artworkList.push(artwork);
    }

    museum = await museumRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      address: faker.location.secondaryAddress(),
      city: faker.location.city(),
      image: faker.image.url(),
      artworks: artworkList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addArtworkMuseum should add an artwork to a museum', async () => {
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.music.songName(),
      year: Math.floor(Math.random() * (2025)),
      description: faker.lorem.paragraph(),
      type: faker.lorem.word(),
      mainImage: faker.image.url()
    });

    const newMuseum: MuseumEntity = await museumRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      address: faker.location.secondaryAddress(),
      city: faker.location.city(),
      image: faker.image.url()
    })

    const result: MuseumEntity = await service.addArtworkMuseum(newArtwork.id, newMuseum.id); 

    expect(result.artworks.length).toBe(1);
    expect(result.artworks).not.toBeNull();
    expect(result.artworks[0].name).toBe(newArtwork.name);
    expect(result.artworks[0].year).toBe(newArtwork.year);
    expect(result.artworks[0].description).toBe(newArtwork.description);
    expect(result.artworks[0].type).toBe(newArtwork.type);
    expect(result.artworks[0].mainImage).toBe(newArtwork.mainImage);
  });

  it('addArtworkMuseum should throw an exception for an invalid artwork', async () => {
    const newMuseum: MuseumEntity = await museumRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      address: faker.location.secondaryAddress(),
      city: faker.location.city(),
      image: faker.image.url()
    })

    await expect(() => service.addArtworkMuseum("0", newMuseum.id)).rejects.toHaveProperty("message", "The artwork with the given id was not found");
  });

  it('addArtworkMuseum should throw an exception for an invalid museum', async () => {
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.music.songName(),
      year: Math.floor(Math.random() * (2025)),
      description: faker.lorem.paragraph(),
      type: faker.lorem.word(),
      mainImage: faker.image.url()
    });
    await expect(() => service.addArtworkMuseum(newArtwork.id, "0")).rejects.toHaveProperty("message", "The museum with the given id was not found");
  });

  it('findArtworkByMuseumIdArtworkId should return an artwork by museum', async () => {
    const artwork: ArtworkEntity = artworkList[0];
    const storedArtwork: ArtworkEntity = await service.findArtworkByMuseumIdArtworkId(artwork.id, museum.id);
    expect(storedArtwork).not.toBeNull();
    expect(storedArtwork.name).toBe(artwork.name);
    expect(storedArtwork.year).toBe(artwork.year);
    expect(storedArtwork.description).toBe(artwork.description);
    expect(storedArtwork.type).toBe(artwork.type);
    expect(storedArtwork.mainImage).toBe(artwork.mainImage);
  });

  it('findArtworkByMuseumIdArtworkId should throw an exception for an invalid artwork', async () => {
    await expect(() => service.findArtworkByMuseumIdArtworkId("0", museum.id)).rejects.toHaveProperty("message", "The artwork with the given id was not found");
  });

  it('findArtworkByMuseumIdArtworkId should throw an exception for an invalid museum', async () => {
    const artwork: ArtworkEntity = artworkList[0];
    await expect(() => service.findArtworkByMuseumIdArtworkId(artwork.id, "0")).rejects.toHaveProperty("message", "The museum with the given id was not found");
  });

  it('findArtworkByMuseumIdArtworkId should throw an exception for an artwork not associated to the museum', async () => {
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.music.songName(),
      year: Math.floor(Math.random() * (2025)),
      description: faker.lorem.paragraph(),
      type: faker.lorem.word(),
      mainImage: faker.image.url()
    });

    await expect(() => service.findArtworkByMuseumIdArtworkId(newArtwork.id, museum.id)).rejects.toHaveProperty("message", "The artwork with the given id is not associated to the museum");
  });

  it('findArtworksByMuseumId should return the artworks of a museum', async () => {
    const artworks: ArtworkEntity[] = await service.findArtworksByMuseumId(museum.id);
    expect(artworks.length).toBe(5);
  });

  it('findArtworksByMuseumId should throw an error for an invalid museum', async () => {
    await expect(() => service.findArtworksByMuseumId("0")).rejects.toHaveProperty("message", "The museum with the given id was not found");
  });

  it('associateArtworksMuseum should update the artwork list for a museum', async() => {
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.music.songName(),
      year: Math.floor(Math.random() * (2025)),
      description: faker.lorem.paragraph(),
      type: faker.lorem.word(),
      mainImage: faker.image.url()
    });

    const updatedMuseum: MuseumEntity = await service.associateArtworksMuseum(museum.id, [newArtwork]);
    expect(updatedMuseum.artworks.length).toBe(1);

    expect(updatedMuseum.artworks[0].name).toBe(newArtwork.name);
    expect(updatedMuseum.artworks[0].year).toBe(newArtwork.year);
    expect(updatedMuseum.artworks[0].description).toBe(newArtwork.description);
    expect(updatedMuseum.artworks[0].type).toBe(newArtwork.type);
    expect(updatedMuseum.artworks[0].mainImage).toBe(newArtwork.mainImage);
  });

  it('associateArtworksMuseum should should throw an error for an invalid museum', async() => {
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.music.songName(),
      year: Math.floor(Math.random() * (2025)),
      description: faker.lorem.paragraph(),
      type: faker.lorem.word(),
      mainImage: faker.image.url()
    });

    await expect(() => service.associateArtworksMuseum("0", [newArtwork])).rejects.toHaveProperty("message", "The museum with the given id was not found");
  });

  it('associateArtworksMuseum should throw an error for an invalid artwork', async() => {
    const newArtwork: ArtworkEntity = artworkList[0];
    newArtwork.id = "0";
    await expect(() => service.associateArtworksMuseum(museum.id, [newArtwork])).rejects.toHaveProperty("message", "The artwork with the given id was not found");
  });

  it('deleteArtworkMuseum should remove an artwork from a museum', async() => {
    const artwork: ArtworkEntity = artworkList[0];

    await service.deleteArtworkMuseum(museum.id, artwork.id);

    const storedMuseum: MuseumEntity = await museumRepository.findOne({where: {id: museum.id}, relations: ["artworks"]});
    const deletedArtwork: ArtworkEntity = storedMuseum.artworks.find(e => e.id === artwork.id);
    expect(deletedArtwork).toBeUndefined();
  });

  it('deleteArtworkMuseum should throw an error for an invalid artwork', async() => {
    await expect(() => service.deleteArtworkMuseum(museum.id, "0")).rejects.toHaveProperty("message", "The artwork with the given id was not found");
  });

  it('deleteArtworkMuseum should throw an error for an invalid museum', async() => {
    const artwork: ArtworkEntity = artworkList[0];
    await expect(() => service.deleteArtworkMuseum("0", artwork.id)).rejects.toHaveProperty("message", "The museum with the given id was not found");
  });

  it('deleteArtworkMuseum should throw an exception for an artwork not associated to the museum', async () => {
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.music.songName(),
      year: Math.floor(Math.random() * (2025)),
      description: faker.lorem.paragraph(),
      type: faker.lorem.word(),
      mainImage: faker.image.url()
    });

    await expect(() => service.deleteArtworkMuseum(museum.id, newArtwork.id)).rejects.toHaveProperty("message", "The artwork with the given id is not associated to the museum");
  });
});
