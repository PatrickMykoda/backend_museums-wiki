import { Test, TestingModule } from '@nestjs/testing';
import { ArtistArtworkService } from './artist-artwork.service';
import { Repository } from 'typeorm';
import { ArtistEntity } from '../artist/artist.entity/artist.entity';
import { ArtworkEntity } from '../artwork/artwork.entity/artwork.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ArtistArtworkService', () => {
  let service: ArtistArtworkService;
  let artistRepository: Repository<ArtistEntity>;
  let artworkRepository: Repository<ArtworkEntity>;
  let artist: ArtistEntity;
  let artworkList: ArtworkEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ArtistArtworkService],
    }).compile();

    service = module.get<ArtistArtworkService>(ArtistArtworkService);
    artworkRepository = module.get<Repository<ArtworkEntity>>(getRepositoryToken(ArtworkEntity));
    artistRepository = module.get<Repository<ArtistEntity>>(getRepositoryToken(ArtistEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    artworkRepository.clear();
    artistRepository.clear();

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

    artist = await artistRepository.save({
      id: "",
      name: faker.person.fullName(),
      birthplace: faker.location.city(),
      birthdate: faker.date.past(),
      image: faker.image.url(),
      artworks: artworkList
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addArtworkArtist should add an artwork to an artist', async () => {
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.music.songName(),
      year: Math.floor(Math.random() * (2025)),
      description: faker.lorem.paragraph(),
      type: faker.lorem.word(),
      mainImage: faker.image.url()
    });

    const newArtist: ArtistEntity = await artistRepository.save({
      name: faker.person.fullName(),
      birthplace: faker.location.city(),
      birthdate: faker.date.past(),
      image: faker.image.url()
    })

    const result: ArtistEntity = await service.addArtworkArtist(newArtist.id, newArtwork.id); 

    expect(result.artworks.length).toBe(1);
    expect(result.artworks).not.toBeNull();
    expect(result.artworks[0].name).toBe(newArtwork.name);
    expect(result.artworks[0].year).toBe(newArtwork.year);
    expect(result.artworks[0].description).toBe(newArtwork.description);
    expect(result.artworks[0].type).toBe(newArtwork.type);
    expect(result.artworks[0].mainImage).toBe(newArtwork.mainImage);
  });

  it('addArtworkArtist should throw an exception for an invalid artwork', async () => {
    const newArtist: ArtistEntity = await artistRepository.save({
      name: faker.person.fullName(),
      birthplace: faker.location.city(),
      birthdate: faker.date.past(),
      image: faker.image.url()
    })

    await expect(() => service.addArtworkArtist(newArtist.id, "0")).rejects.toHaveProperty("message", "The artwork with the given id was not found");
  });

  it('addArtworkArtist should throw an exception for an invalid artist', async () => {
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.music.songName(),
      year: Math.floor(Math.random() * (2025)),
      description: faker.lorem.paragraph(),
      type: faker.lorem.word(),
      mainImage: faker.image.url()
    });
    await expect(() => service.addArtworkArtist("0", newArtwork.id)).rejects.toHaveProperty("message", "The artist with the given id was not found");
  });

  it('findArtworkByArtistIdArtworkId should return an artwork by artist', async () => {
    const artwork: ArtworkEntity = artworkList[0];
    const storedArtwork: ArtworkEntity = await service.findArtworkByArtistIdArtworkId(artist.id, artwork.id);
    expect(storedArtwork).not.toBeNull();
    expect(storedArtwork.name).toBe(artwork.name);
    expect(storedArtwork.year).toBe(artwork.year);
    expect(storedArtwork.description).toBe(artwork.description);
    expect(storedArtwork.type).toBe(artwork.type);
    expect(storedArtwork.mainImage).toBe(artwork.mainImage);
  });

  it('findArtworkByArtistIdArtworkId should throw an exception for an invalid artwork', async () => {
    await expect(() => service.findArtworkByArtistIdArtworkId(artist.id, "0",)).rejects.toHaveProperty("message", "The artwork with the given id was not found");
  });

  it('findArtworkByArtistIdArtworkId should throw an exception for an invalid artist', async () => {
    const artwork: ArtworkEntity = artworkList[0];
    await expect(() => service.findArtworkByArtistIdArtworkId("0", artwork.id)).rejects.toHaveProperty("message", "The artist with the given id was not found");
  });

  it('findArtworkByArtistIdArtworkId should throw an exception for an artwork not associated to the artist', async () => {
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.music.songName(),
      year: Math.floor(Math.random() * (2025)),
      description: faker.lorem.paragraph(),
      type: faker.lorem.word(),
      mainImage: faker.image.url()
    });

    await expect(() => service.findArtworkByArtistIdArtworkId(artist.id, newArtwork.id)).rejects.toHaveProperty("message", "The artwork with the given id is not associated to the artist");
  });

  it('findArtworksByArtistId should return the artworks of an artist', async () => {
    const artworks: ArtworkEntity[] = await service.findArtworksByArtistId(artist.id);
    expect(artworks.length).toBe(5);
  });

  it('findArtworksByArtistId should throw an error for an invalid artist', async () => {
    await expect(() => service.findArtworksByArtistId("0")).rejects.toHaveProperty("message", "The artist with the given id was not found");
  });

  it('associateArtworksArtist should update the artwork list for an artist', async() => {
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.music.songName(),
      year: Math.floor(Math.random() * (2025)),
      description: faker.lorem.paragraph(),
      type: faker.lorem.word(),
      mainImage: faker.image.url()
    });

    const updatedArtist: ArtistEntity = await service.associateArtworksArtist(artist.id, [newArtwork]);
    expect(updatedArtist.artworks.length).toBe(1);

    expect(updatedArtist.artworks[0].name).toBe(newArtwork.name);
    expect(updatedArtist.artworks[0].year).toBe(newArtwork.year);
    expect(updatedArtist.artworks[0].description).toBe(newArtwork.description);
    expect(updatedArtist.artworks[0].type).toBe(newArtwork.type);
    expect(updatedArtist.artworks[0].mainImage).toBe(newArtwork.mainImage);
  });

  it('associateArtworksArtist should should throw an error for an invalid artist', async() => {
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.music.songName(),
      year: Math.floor(Math.random() * (2025)),
      description: faker.lorem.paragraph(),
      type: faker.lorem.word(),
      mainImage: faker.image.url()
    });

    await expect(() => service.associateArtworksArtist("0", [newArtwork])).rejects.toHaveProperty("message", "The artist with the given id was not found");
  });

  it('associateArtworksArtist should throw an error for an invalid artwork', async() => {
    const newArtwork: ArtworkEntity = artworkList[0];
    newArtwork.id = "0";
    await expect(() => service.associateArtworksArtist(artist.id, [newArtwork])).rejects.toHaveProperty("message", "The artwork with the given id was not found");
  });

  it('deleteArtworkArtist should remove an artwork from an artist', async() => {
    const artwork: ArtworkEntity = artworkList[0];

    await service.deleteArtworkArtist(artist.id, artwork.id);

    const storedArtist: ArtistEntity = await artistRepository.findOne({where: {id: artist.id}, relations: ["artworks"]});
    const deletedArtwork: ArtworkEntity = storedArtist.artworks.find(e => e.id === artwork.id);
    expect(deletedArtwork).toBeUndefined();
  });

  it('deleteArtworkArtist should throw an error for an invalid artwork', async() => {
    await expect(() => service.deleteArtworkArtist(artist.id, "0")).rejects.toHaveProperty("message", "The artwork with the given id was not found");
  });

  it('deleteArtworkArtist should throw an error for an invalid artist', async() => {
    const artwork: ArtworkEntity = artworkList[0];
    await expect(() => service.deleteArtworkArtist("0", artwork.id)).rejects.toHaveProperty("message", "The artist with the given id was not found");
  });

  it('deleteArtworkArtist should throw an exception for an artwork not associated to the artist', async () => {
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.music.songName(),
      year: Math.floor(Math.random() * (2025)),
      description: faker.lorem.paragraph(),
      type: faker.lorem.word(),
      mainImage: faker.image.url()
    });

    await expect(() => service.deleteArtworkArtist(artist.id, newArtwork.id)).rejects.toHaveProperty("message", "The artwork with the given id is not associated to the artist");
  });
});
