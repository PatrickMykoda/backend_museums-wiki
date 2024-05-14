import { Test, TestingModule } from '@nestjs/testing';
import { MovementArtistService } from './movement-artist.service';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { ArtistEntity } from '../artist/artist.entity/artist.entity';
import { MovementEntity } from '../movement/movement.entity/movement.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('MovementArtistService', () => {
  let service: MovementArtistService;
  let artistRepository: Repository<ArtistEntity>;
  let movementRepository: Repository<MovementEntity>;
  let movement: MovementEntity;
  let artistList: ArtistEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MovementArtistService],
    }).compile();

    service = module.get<MovementArtistService>(MovementArtistService);
    movementRepository = module.get<Repository<MovementEntity>>(getRepositoryToken(MovementEntity));
    artistRepository = module.get<Repository<ArtistEntity>>(getRepositoryToken(ArtistEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    movementRepository.clear();
    artistRepository.clear();

    artistList = [];
    for(let i = 0; i < 5; i++){
      const artist: ArtistEntity = await artistRepository.save({
        name: faker.person.fullName(),
        birthplace: faker.location.city(),
        birthdate: faker.date.past(),
        image: faker.image.url()
      });
      artistList.push(artist);
    }

    movement = await movementRepository.save({
      id: "",
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      countryOfOrigin: faker.location.country(),
      artists: artistList
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addArtistMovement should add an artwork to a movement', async () => {
    const newArtist: ArtistEntity = await artistRepository.save({
      name: faker.person.fullName(),
      birthplace: faker.location.city(),
      birthdate: faker.date.past(),
      image: faker.image.url()
    });

    const newMovement: MovementEntity = await movementRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      countryOfOrigin: faker.location.country()
    });

    const result: MovementEntity = await service.addArtistMovement(newMovement.id, newArtist.id); 

    expect(result.artists.length).toBe(1);
    expect(result.artists).not.toBeNull();
    expect(result.artists[0].name).toBe(newArtist.name);
    expect(result.artists[0].birthplace).toBe(newArtist.birthplace);
    expect(result.artists[0].birthdate).toEqual(newArtist.birthdate);
    expect(result.artists[0].image).toBe(newArtist.image);
  });

  it('addArtistMovement should throw an exception for an invalid artist', async () => {
    const newMovement: MovementEntity = await movementRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      countryOfOrigin: faker.location.country()
    });

    await expect(() => service.addArtistMovement(newMovement.id, "0")).rejects.toHaveProperty("message", "The artist with the given id was not found");
  });

  it('addArtistMovement should throw an exception for an invalid movement', async () => {
    const newArtist: ArtistEntity = await artistRepository.save({
      name: faker.person.fullName(),
      birthplace: faker.location.city(),
      birthdate: faker.date.past(),
      image: faker.image.url()
    });
    await expect(() => service.addArtistMovement("0", newArtist.id)).rejects.toHaveProperty("message", "The movement with the given id was not found");
  });

  it('findArtistByMovementIdArtistId should return an artwork by artist', async () => {
    const artist: ArtistEntity = artistList[0];
    const storedArtist: ArtistEntity = await service.findArtistByMovementIdArtistId(movement.id, artist.id);
    expect(storedArtist).not.toBeNull();
    expect(storedArtist.name).toBe(artist.name);
    expect(storedArtist.birthdate).toEqual(artist.birthdate);
    expect(storedArtist.birthplace).toBe(artist.birthplace);
    expect(storedArtist.image).toBe(artist.image);
  });

  it('findArtistByMovementIdArtistId should throw an exception for an invalid artist', async () => {
    await expect(() => service.findArtistByMovementIdArtistId(movement.id, "0",)).rejects.toHaveProperty("message", "The artist with the given id was not found");
  });

  it('findArtistByMovementIdArtistId should throw an exception for an invalid movement', async () => {
    const artist: ArtistEntity = artistList[0];
    await expect(() => service.findArtistByMovementIdArtistId("0", artist.id)).rejects.toHaveProperty("message", "The movement with the given id was not found");
  });

  it('findArtistByMovementIdArtistId should throw an exception for an artist not associated to the movement', async () => {
    const newArtist: ArtistEntity = await artistRepository.save({
      name: faker.person.fullName(),
      birthplace: faker.location.city(),
      birthdate: faker.date.past(),
      image: faker.image.url()
    });

    await expect(() => service.findArtistByMovementIdArtistId(movement.id, newArtist.id)).rejects.toHaveProperty("message", "The artist with the given id is not associated to the movement");
  });

  it('findArtistsByMovementId should return the artists of a movement', async () => {
    const artists: ArtistEntity[] = await service.findArtistsByMovementId(movement.id);
    expect(artists.length).toBe(5);
  });

  it('findArtistsByMovementId should throw an error for an invalid movement', async () => {
    await expect(() => service.findArtistsByMovementId("0")).rejects.toHaveProperty("message", "The movement with the given id was not found");
  });

  it('associateArtistsMovement should update the artist list for a movement', async() => {
    const newArtist: ArtistEntity = await artistRepository.save({
      name: faker.person.fullName(),
      birthplace: faker.location.city(),
      birthdate: faker.date.past(),
      image: faker.image.url()
    });

    const updatedMovement: MovementEntity = await service.associateArtistsMovement(movement.id, [newArtist]);
    expect(updatedMovement.artists.length).toBe(1);

    expect(updatedMovement.artists[0].name).toBe(newArtist.name);
    expect(updatedMovement.artists[0].birthdate).toEqual(newArtist.birthdate);
    expect(updatedMovement.artists[0].birthplace).toBe(newArtist.birthplace);
    expect(updatedMovement.artists[0].image).toBe(newArtist.image);
  });

  it('associateArtistsMovement should should throw an error for an invalid movement', async() => {
    const newArtist: ArtistEntity = await artistRepository.save({
      name: faker.person.fullName(),
      birthplace: faker.location.city(),
      birthdate: faker.date.past(),
      image: faker.image.url()
    });

    await expect(() => service.associateArtistsMovement("0", [newArtist])).rejects.toHaveProperty("message", "The movement with the given id was not found");
  });

  it('associateArtistsMovement should throw an error for an invalid artist', async() => {
    const newArtist: ArtistEntity = artistList[0];
    newArtist.id = "0";
    await expect(() => service.associateArtistsMovement(movement.id, [newArtist])).rejects.toHaveProperty("message", "The artist with the given id was not found");
  });

  it('deleteArtistMovement should remove an artist from a movement', async() => {
    const artist: ArtistEntity = artistList[0];

    await service.deleteArtistMovement(movement.id, artist.id);

    const storedMovement: MovementEntity = await movementRepository.findOne({where: {id: movement.id}, relations: ["artists"]});
    const deletedArtist: ArtistEntity = storedMovement.artists.find(e => e.id === artist.id);
    expect(deletedArtist).toBeUndefined();
  });

  it('deleteArtworkArtist should throw an error for an invalid artist', async() => {
    await expect(() => service.deleteArtistMovement(movement.id, "0")).rejects.toHaveProperty("message", "The artist with the given id was not found");
  });

  it('deleteArtworkArtist should throw an error for an invalid movement', async() => {
    const artist: ArtistEntity = artistList[0];
    await expect(() => service.deleteArtistMovement("0", artist.id)).rejects.toHaveProperty("message", "The movement with the given id was not found");
  });

  it('deleteArtworkArtist should throw an exception for an artist not associated to the movement', async () => {
    const newArtist: ArtistEntity = await artistRepository.save({
      name: faker.person.fullName(),
      birthplace: faker.location.city(),
      birthdate: faker.date.past(),
      image: faker.image.url()
    });

    await expect(() => service.deleteArtistMovement(movement.id, newArtist.id)).rejects.toHaveProperty("message", "The artist with the given id is not associated to the movement");
  });
});
