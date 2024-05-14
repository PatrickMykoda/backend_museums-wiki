import { Test, TestingModule } from '@nestjs/testing';
import { ExhibitionArtworkService } from './exhibition-artwork.service';
import { ExhibitionEntity } from '../exhibition/exhibition.entity/exhibition.entity';
import { Repository } from 'typeorm/repository/Repository';
import { ArtworkEntity } from '../artwork/artwork.entity/artwork.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ExhibitionArtworkService', () => {
  let service: ExhibitionArtworkService;
  let exhibitionRepository: Repository<ExhibitionEntity>;
  let artworkRepository: Repository<ArtworkEntity>;
  let exhibition: ExhibitionEntity;
  let artworkList: ArtworkEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ExhibitionArtworkService],
    }).compile();

    service = module.get<ExhibitionArtworkService>(ExhibitionArtworkService);
    artworkRepository = module.get<Repository<ArtworkEntity>>(getRepositoryToken(ArtworkEntity));
    exhibitionRepository = module.get<Repository<ExhibitionEntity>>(getRepositoryToken(ExhibitionEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    artworkRepository.clear();
    exhibitionRepository.clear();

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

    exhibition = await exhibitionRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      artworks: artworkList
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addArtworkExhibition should add an artwork to an exhibition', async () => {
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.music.songName(),
      year: Math.floor(Math.random() * (2025)),
      description: faker.lorem.paragraph(),
      type: faker.lorem.word(),
      mainImage: faker.image.url()
    });

    const newExhibition: ExhibitionEntity = await exhibitionRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
    })

    const result: ExhibitionEntity = await service.addArtworkExhibition(newExhibition.id, newArtwork.id); 

    expect(result.artworks.length).toBe(1);
    expect(result.artworks).not.toBeNull();
    expect(result.artworks[0].name).toBe(newArtwork.name);
    expect(result.artworks[0].year).toBe(newArtwork.year);
    expect(result.artworks[0].description).toBe(newArtwork.description);
    expect(result.artworks[0].type).toBe(newArtwork.type);
    expect(result.artworks[0].mainImage).toBe(newArtwork.mainImage);
  });

  it('addArtworkExhibition should throw an exception for an invalid artwork', async () => {
    const newExhibition: ExhibitionEntity = await exhibitionRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
    })

    await expect(() => service.addArtworkExhibition(newExhibition.id, "0")).rejects.toHaveProperty("message", "The artwork with the given id was not found");
  });

  it('addArtworkExhibition should throw an exception for an invalid exhibition', async () => {
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.music.songName(),
      year: Math.floor(Math.random() * (2025)),
      description: faker.lorem.paragraph(),
      type: faker.lorem.word(),
      mainImage: faker.image.url()
    });
    await expect(() => service.addArtworkExhibition("0", newArtwork.id)).rejects.toHaveProperty("message", "The exhibition with the given id was not found");
  });

  it('findArtworkByExhibitionIdArtworkId should return an artwork by artist', async () => {
    const artwork: ArtworkEntity = artworkList[0];
    const storedArtwork: ArtworkEntity = await service.findArtworkByExhibitionIdArtworkId(exhibition.id, artwork.id);
    expect(storedArtwork).not.toBeNull();
    expect(storedArtwork.name).toBe(artwork.name);
    expect(storedArtwork.year).toBe(artwork.year);
    expect(storedArtwork.description).toBe(artwork.description);
    expect(storedArtwork.type).toBe(artwork.type);
    expect(storedArtwork.mainImage).toBe(artwork.mainImage);
  });

  it('findArtworkByExhibitionIdArtworkId should throw an exception for an invalid artwork', async () => {
    await expect(() => service.findArtworkByExhibitionIdArtworkId(exhibition.id, "0",)).rejects.toHaveProperty("message", "The artwork with the given id was not found");
  });

  it('findArtworkByExhibitionIdArtworkId should throw an exception for an invalid exhibition', async () => {
    const artwork: ArtworkEntity = artworkList[0];
    await expect(() => service.findArtworkByExhibitionIdArtworkId("0", artwork.id)).rejects.toHaveProperty("message", "The exhibition with the given id was not found");
  });

  it('findArtworkByExhibitionIdArtworkId should throw an exception for an artwork not associated to the exhibition', async () => {
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.music.songName(),
      year: Math.floor(Math.random() * (2025)),
      description: faker.lorem.paragraph(),
      type: faker.lorem.word(),
      mainImage: faker.image.url()
    });

    await expect(() => service.findArtworkByExhibitionIdArtworkId(exhibition.id, newArtwork.id)).rejects.toHaveProperty("message", "The artwork with the given id is not associated to the exhibition");
  });

  it('findArtworksByExhibitionId should return the artworks of an exhibition', async () => {
    const artworks: ArtworkEntity[] = await service.findArtworksByExhibitionId(exhibition.id);
    expect(artworks.length).toBe(5);
  });

  it('findArtworksByExhibitionId should throw an error for an invalid exhibition', async () => {
    await expect(() => service.findArtworksByExhibitionId("0")).rejects.toHaveProperty("message", "The exhibition with the given id was not found");
  });

  it('associateArtworksExhibition should update the artwork list for an exhibition', async() => {
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.music.songName(),
      year: Math.floor(Math.random() * (2025)),
      description: faker.lorem.paragraph(),
      type: faker.lorem.word(),
      mainImage: faker.image.url()
    });

    const updatedExhibition: ExhibitionEntity = await service.associateArtworksExhibition(exhibition.id, [newArtwork]);
    expect(updatedExhibition.artworks.length).toBe(1);

    expect(updatedExhibition.artworks[0].name).toBe(newArtwork.name);
    expect(updatedExhibition.artworks[0].year).toBe(newArtwork.year);
    expect(updatedExhibition.artworks[0].description).toBe(newArtwork.description);
    expect(updatedExhibition.artworks[0].type).toBe(newArtwork.type);
    expect(updatedExhibition.artworks[0].mainImage).toBe(newArtwork.mainImage);
  });

  it('associateArtworksExhibition should should throw an error for an invalid exhibition', async() => {
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.music.songName(),
      year: Math.floor(Math.random() * (2025)),
      description: faker.lorem.paragraph(),
      type: faker.lorem.word(),
      mainImage: faker.image.url()
    });

    await expect(() => service.associateArtworksExhibition("0", [newArtwork])).rejects.toHaveProperty("message", "The exhibition with the given id was not found");
  });

  it('associateArtworksExhibition should throw an error for an invalid artwork', async() => {
    const newArtwork: ArtworkEntity = artworkList[0];
    newArtwork.id = "0";
    await expect(() => service.associateArtworksExhibition(exhibition.id, [newArtwork])).rejects.toHaveProperty("message", "The artwork with the given id was not found");
  });

  it('deleteArtworkExhibition should remove an artwork from an exhibition', async() => {
    const artwork: ArtworkEntity = artworkList[0];

    await service.deleteArtworkExhibition(exhibition.id, artwork.id);

    const storedExhibition: ExhibitionEntity = await exhibitionRepository.findOne({where: {id: exhibition.id}, relations: ["artworks"]});
    const deletedArtwork: ArtworkEntity = storedExhibition.artworks.find(e => e.id === artwork.id);
    expect(deletedArtwork).toBeUndefined();
  });

  it('deleteArtworkExhibition should throw an error for an invalid artwork', async() => {
    await expect(() => service.deleteArtworkExhibition(exhibition.id, "0")).rejects.toHaveProperty("message", "The artwork with the given id was not found");
  });

  it('deleteArtworkExhibition should throw an error for an invalid exhibition', async() => {
    const artwork: ArtworkEntity = artworkList[0];
    await expect(() => service.deleteArtworkExhibition("0", artwork.id)).rejects.toHaveProperty("message", "The exhibition with the given id was not found");
  });

  it('deleteArtworkExhibition should throw an exception for an artwork not associated to the artist', async () => {
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.music.songName(),
      year: Math.floor(Math.random() * (2025)),
      description: faker.lorem.paragraph(),
      type: faker.lorem.word(),
      mainImage: faker.image.url()
    });

    await expect(() => service.deleteArtworkExhibition(exhibition.id, newArtwork.id)).rejects.toHaveProperty("message", "The artwork with the given id is not associated to the exhibition");
  });
});
