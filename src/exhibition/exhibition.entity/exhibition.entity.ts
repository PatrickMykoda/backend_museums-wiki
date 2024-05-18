import { ArtworkEntity } from "../../artwork/artwork.entity/artwork.entity";
import { MuseumEntity } from "../../museum/museum.entity/museum.entity";
import { SponsorEntity } from "../../sponsor/sponsor.entity/sponsor.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class ExhibitionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToOne(()=>MuseumEntity, museum => museum.exhibitions )
    museum: MuseumEntity;

    @OneToMany(()=> ArtworkEntity, artwork => artwork.exhibition)
    artworks: ArtworkEntity[];

    @ManyToOne(()=> SponsorEntity, sponsor => sponsor.exhibitions)
    sponsor: SponsorEntity;
}
