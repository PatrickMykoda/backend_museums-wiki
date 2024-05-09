import { ArtistEntity } from 'src/artist/artist.entity/artist.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm'

@Entity()
export class MovementEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    countryOfOrigin: string;

    @ManyToMany(()=> ArtistEntity, artist => artist.movements)
    artists: ArtistEntity[];
}
