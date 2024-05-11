import { Test, TestingModule } from '@nestjs/testing';
import { ArtistService } from './artist.service';
import { Repository } from 'typeorm';
import { ArtistEntity } from './artist.entity/artist.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ar, faker } from '@faker-js/faker';

describe('ArtistService', () => {
  let service: ArtistService;
  let repository: Repository<ArtistEntity>;
  let artistsList: ArtistEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ArtistService],
    }).compile();

    service = module.get<ArtistService>(ArtistService);
    repository = module.get<Repository<ArtistEntity>>(getRepositoryToken(ArtistEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    artistsList = [];
    for(let i=0; i < 5; i++){
      const artist: ArtistEntity = await repository.save({
        name: faker.person.fullName(),
        birthplace: faker.location.city(),
        birthdate: faker.date.past(),
        image: faker.image.url()
      });
      artistsList.push(artist);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all artists', async () => {
    const artists: ArtistEntity[] = await service.findAll();
    expect(artists).not.toBeNull();
    expect(artists).toHaveLength(artistsList.length);
  });

  it('findOne should return an artist by id', async () => {
    const storedArtist: ArtistEntity = artistsList[0];
    const artist: ArtistEntity = await service.findOne(storedArtist.id);
    expect(artist).not.toBeNull();
    expect(artist.name).toEqual(storedArtist.name);
    expect(artist.birthplace).toEqual(storedArtist.birthplace);
    expect(artist.birthdate).toEqual(storedArtist.birthdate);
    expect(artist.image).toEqual(storedArtist.image);
  });

  it('findOne should throw an exception for an invalid artist', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The artist with the given id was not found");
  });

  it('create should return a new artist', async () => {
    const artist: ArtistEntity = {
      id: "",
      name: faker.person.fullName(),
      birthplace: faker.location.city(),
      birthdate: faker.date.past(),
      image: faker.image.url(),
      artworks: [],
      movements: []
    }

    const newArtist: ArtistEntity = await service.create(artist);
    expect(newArtist).not.toBeNull();

    const storedArtist: ArtistEntity = await repository.findOne({ where: {id: newArtist.id}});
    expect(storedArtist).not.toBeNull();
    expect(storedArtist.name).toEqual(newArtist.name);
    expect(storedArtist.birthplace).toEqual(newArtist.birthplace);
    expect(storedArtist.birthdate).toEqual(newArtist.birthdate);
    expect(storedArtist.image).toEqual(newArtist.image);
  })

  it('update should modify an artist', async () => {
    const artist: ArtistEntity = artistsList[0];
    artist.name = "New name";
    artist.birthplace = "New birthplace";
    const updatedArtist: ArtistEntity = await service.update(artist.id, artist);
    expect(updatedArtist).not.toBeNull();
    const storedArtist: ArtistEntity = await repository.findOne({ where: {id: artist.id}});
    expect(storedArtist).not.toBeNull();
    expect(storedArtist.name).toEqual(artist.name);
    expect(storedArtist.birthplace).toEqual(artist.birthplace);
  });

  it('update should throw an exception for an invalid artist', async () => {
    let artist: ArtistEntity = artistsList[0];
    artist = {
      ...artist, name: "New name", birthplace: "New birthplace"
    }
    await expect(service.update("0", artist)).rejects.toHaveProperty("message", "The artist with the given id was not found");
  });

  it('delete should remove an artist', async () => {
    const artist: ArtistEntity = artistsList[0];
    await service.delete(artist.id);
    const deletedArtist: ArtistEntity = await repository.findOne({ where: {id: artist.id}});
    expect(deletedArtist).toBeNull();
  });

  it('delete should throw an error for an invalid artist', async () => {
    await expect(service.delete("0")).rejects.toHaveProperty("message", "The artist with the given id was not found");
  });

});
