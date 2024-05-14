import { Test, TestingModule } from '@nestjs/testing';
import { ArtworkImageService } from './artwork-image.service';
import { ImageEntity } from '../image/image.entity/image.entity';
import { Repository } from 'typeorm';
import { ArtworkEntity } from '../artwork/artwork.entity/artwork.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ArtworkImageService', () => {
  let service: ArtworkImageService;
  let imageRepository: Repository<ImageEntity>;
  let artworkRepository: Repository<ArtworkEntity>;
  let artwork: ArtworkEntity;
  let imageList: ImageEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ArtworkImageService],
    }).compile();

    service = module.get<ArtworkImageService>(ArtworkImageService);
    artworkRepository = module.get<Repository<ArtworkEntity>>(getRepositoryToken(ArtworkEntity));
    imageRepository = module.get<Repository<ImageEntity>>(getRepositoryToken(ImageEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    artworkRepository.clear();
    imageRepository.clear();

    imageList = [];
    for(let i = 0; i < 5; i++){
      const image: ImageEntity = await imageRepository.save({
        source: faker.image.url(),
        altText: faker.lorem.sentence(),
        height: Math.floor(Math.random() * 2000),
        width: Math.floor(Math.random() * 2000),
      });
      imageList.push(image);
    }

    artwork = await artworkRepository.save({
      name: faker.music.songName(),
      year: Math.floor(Math.random() * (2025)),
      description: faker.lorem.paragraph(),
      type: faker.lorem.word(),
      mainImage: faker.image.url(),
      images: imageList
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addImageArtwork should add an artwork to an exhibition', async () => {
    const newImage: ImageEntity = await imageRepository.save({
      source: faker.image.url(),
      altText: faker.lorem.sentence(),
      height: Math.floor(Math.random() * 2000),
      width: Math.floor(Math.random() * 2000),
    });
    
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.music.songName(),
      year: Math.floor(Math.random() * (2025)),
      description: faker.lorem.paragraph(),
      type: faker.lorem.word(),
      mainImage: faker.image.url()
    });

    const result: ArtworkEntity = await service.addImageArtwork(newArtwork.id, newImage.id); 

    expect(result.images.length).toBe(1);
    expect(result.images).not.toBeNull();
    expect(result.images[0].source).toBe(newImage.source);
    expect(result.images[0].altText).toBe(newImage.altText);
    expect(result.images[0].height).toBe(newImage.height);
    expect(result.images[0].width).toBe(newImage.width);
  });

  it('addImageArtwork should throw an exception for an invalid image', async () => {
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.music.songName(),
      year: Math.floor(Math.random() * (2025)),
      description: faker.lorem.paragraph(),
      type: faker.lorem.word(),
      mainImage: faker.image.url()
    })

    await expect(() => service.addImageArtwork(newArtwork.id, "0")).rejects.toHaveProperty("message", "The image with the given id was not found");
  });

  it('addImageArtwork should throw an exception for an invalid artwork', async () => {
    const newImage: ImageEntity = await imageRepository.save({
      source: faker.image.url(),
      altText: faker.lorem.sentence(),
      height: Math.floor(Math.random() * 2000),
      width: Math.floor(Math.random() * 2000),
    });
    await expect(() => service.addImageArtwork("0", newImage.id)).rejects.toHaveProperty("message", "The artwork with the given id was not found");
  });

  it('findImageByArtworkIdImageId should return an image by artwork', async () => {
    const image: ImageEntity = imageList[0];
    const storedImage: ImageEntity = await service.findImageByArtworkIdImageId(artwork.id, image.id);
    expect(storedImage).not.toBeNull();
    expect(storedImage.source).toBe(image.source);
    expect(storedImage.altText).toBe(image.altText);
    expect(storedImage.height).toBe(image.height);
    expect(storedImage.width).toBe(image.width);
  });

  it('findImageByArtworkIdImageId should throw an exception for an invalid image', async () => {
    await expect(() => service.findImageByArtworkIdImageId(artwork.id, "0",)).rejects.toHaveProperty("message", "The image with the given id was not found");
  });

  it('findImageByArtworkIdImageId should throw an exception for an invalid artwork', async () => {
    const image: ImageEntity = imageList[0];
    await expect(() => service.findImageByArtworkIdImageId("0", image.id)).rejects.toHaveProperty("message", "The artwork with the given id was not found");
  });

  it('findImageByArtworkIdImageId should throw an exception for an image not associated to the artwork', async () => {
    const newImage: ImageEntity = await imageRepository.save({
      source: faker.image.url(),
      altText: faker.lorem.sentence(),
      height: Math.floor(Math.random() * 2000),
      width: Math.floor(Math.random() * 2000),
    });

    await expect(() => service.findImageByArtworkIdImageId(artwork.id, newImage.id)).rejects.toHaveProperty("message", "The image with the given id is not associated to the artwork");
  });

  it('findImagesByArtworkId should return the images of an artwork', async () => {
    const images: ImageEntity[] = await service.findImagesByArtworkId(artwork.id);
    expect(images.length).toBe(5);
  });

  it('findImagesByArtworkId should throw an error for an invalid artwork', async () => {
    await expect(() => service.findImagesByArtworkId("0")).rejects.toHaveProperty("message", "The artwork with the given id was not found");
  });

  it('associateImagesArtwork should update the image list for an artwork', async() => {
    const newImage: ImageEntity = await imageRepository.save({
      source: faker.image.url(),
      altText: faker.lorem.sentence(),
      height: Math.floor(Math.random() * 2000),
      width: Math.floor(Math.random() * 2000),
    });

    const updatedArtwork: ArtworkEntity = await service.associateImagesArtwork(artwork.id, [newImage]);
    expect(updatedArtwork.images.length).toBe(1);

    expect(updatedArtwork.images[0].source).toBe(newImage.source);
    expect(updatedArtwork.images[0].altText).toBe(newImage.altText);
    expect(updatedArtwork.images[0].height).toBe(newImage.height);
    expect(updatedArtwork.images[0].width).toBe(newImage.width);
  });

  it('associateImagesArtwork should should throw an error for an invalid artwork', async() => {
    const newImage: ImageEntity = await imageRepository.save({
      source: faker.image.url(),
      altText: faker.lorem.sentence(),
      height: Math.floor(Math.random() * 2000),
      width: Math.floor(Math.random() * 2000),
    });

    await expect(() => service.associateImagesArtwork("0", [newImage])).rejects.toHaveProperty("message", "The artwork with the given id was not found");
  });

  it('associateImagesArtwork should throw an error for an invalid image', async() => {
    const newImage: ImageEntity = imageList[0];
    newImage.id = "0";
    await expect(() => service.associateImagesArtwork(artwork.id, [newImage])).rejects.toHaveProperty("message", "The image with the given id was not found");
  });

  it('deleteImageArtwork should remove an artwork from an exhibition', async() => {
    const image: ImageEntity = imageList[0];

    await service.deleteImageArtwork(artwork.id, image.id);

    const storedArtwork: ArtworkEntity = await artworkRepository.findOne({where: {id: artwork.id}, relations: ["images"]});
    const deletedImage: ImageEntity = storedArtwork.images.find(e => e.id === image.id);
    expect(deletedImage).toBeUndefined();
  });

  it('deleteImageArtwork should throw an error for an invalid image', async() => {
    await expect(() => service.deleteImageArtwork(artwork.id, "0")).rejects.toHaveProperty("message", "The image with the given id was not found");
  });

  it('deleteImageArtwork should throw an error for an invalid artwork', async() => {
    const image: ImageEntity = imageList[0];
    await expect(() => service.deleteImageArtwork("0", image.id)).rejects.toHaveProperty("message", "The artwork with the given id was not found");
  });

  it('deleteImageArtwork should throw an exception for an image not associated to the artwork', async () => {
    const newImage: ImageEntity = await imageRepository.save({
      source: faker.image.url(),
      altText: faker.lorem.sentence(),
      height: Math.floor(Math.random() * 2000),
      width: Math.floor(Math.random() * 2000),
    });

    await expect(() => service.deleteImageArtwork(artwork.id, newImage.id)).rejects.toHaveProperty("message", "The image with the given id is not associated to the artwork");
  });
});
