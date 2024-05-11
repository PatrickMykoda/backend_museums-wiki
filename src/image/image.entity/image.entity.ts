import { ArtworkEntity } from '../../artwork/artwork.entity/artwork.entity';
import {Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

@Entity()
export class ImageEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    source: string;

    @Column()
    altText: string;

    @Column()
    height: number;

    @Column()
    width: number;

    @ManyToOne(()=> ArtworkEntity, artwork => artwork.images)
    artwork: ArtworkEntity;
}
