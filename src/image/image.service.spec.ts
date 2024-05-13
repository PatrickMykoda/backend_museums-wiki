import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from './image.service';
import { Repository } from 'typeorm';
import { ImageEntity } from './image.entity/image.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ImageService', () => {
  let service: ImageService;
  let repository: Repository<ImageEntity>;
  let imageList: ImageEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ImageService],
    }).compile();

    service = module.get<ImageService>(ImageService);
    repository = module.get<Repository<ImageEntity>>(getRepositoryToken(ImageEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    imageList = [];
    for(let i = 0; i < 5; i++){
      const image: ImageEntity = await repository.save({
        source: faker.image.url(),
        altText: faker.lorem.sentence(),
        height: Math.floor(Math.random() * 2000),
        width: Math.floor(Math.random() * 2000)
      })
      imageList.push(image);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all images', async () => {
    const images: ImageEntity[] = await service.findAll();
    expect(images).not.toBeNull();
    expect(images).toHaveLength(imageList.length);
  });

  it('findOne should return an image by id', async () => {
    const storedImage: ImageEntity = imageList[0];
    const image: ImageEntity = await service.findOne(storedImage.id);
    expect(image).not.toBeNull();
    expect(image.source).toEqual(storedImage.source);
    expect(image.altText).toEqual(storedImage.altText);
    expect(image.height).toEqual(storedImage.height);
    expect(image.width).toEqual(storedImage.width);
  });

  it('findOne should throw an exception for an invalid image', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The image with the given id was not found");
  });

  it('create should return a new image', async () => {
    const image: ImageEntity = {
      id: "",
      source: faker.image.url(),
      altText: faker.lorem.sentence(),
      height: Math.floor(Math.random() * 2000),
      width: Math.floor(Math.random() * 2000),
      artwork: null
    }
 
    const newImage: ImageEntity = await service.create(image);
    expect(newImage).not.toBeNull()

    const storedImage: ImageEntity = await repository.findOne({where: {id: newImage.id}});
    expect(storedImage).not.toBeNull();
    expect(storedImage.source).toEqual(newImage.source);
    expect(storedImage.altText).toEqual(newImage.altText);
    expect(storedImage.height).toEqual(newImage.height);
    expect(storedImage.width).toEqual(newImage.width);
  });

  it('update should modify an image', async () => {
    const image: ImageEntity = imageList[0];
    image.source = "new-source.com";
    image.altText = "New alt text";
    const updatedImage: ImageEntity = await service.update(image.id, image);
    expect(updatedImage).not.toBeNull();
    const storedImage: ImageEntity = await repository.findOne({where: {id: image.id}});
    expect(storedImage).not.toBeNull();
    expect(storedImage.source).toEqual(image.source);
    expect(storedImage.altText).toEqual(image.altText);
  });

  it('update should throw an error for an invalid image', async () => {
    let image: ImageEntity = imageList[0];
    image = {
      ...image, source: "new-source.com", altText: "New alt text"
    }
    await expect(() => service.update("0", image)).rejects.toHaveProperty("message", "The image with the given id was not found");
  });

  it('delete should remove an image', async () => {
    const image: ImageEntity = imageList[0];
    await service.delete(image.id);
    const deletedImage: ImageEntity = await repository.findOne({where: {id: image.id}});
    expect(deletedImage).toBeNull();
  });

  it('delete should throw an exception for an invalid image', async () =>{
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The image with the given id was not found");
  });
});
