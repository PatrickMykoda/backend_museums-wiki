import { ArtistEntity } from '../../artist/artist.entity/artist.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm'

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
    @JoinTable()
    artists: ArtistEntity[];
}
