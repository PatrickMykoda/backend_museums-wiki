import { ExhibitionEntity } from "../../exhibition/exhibition.entity/exhibition.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SponsorEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    website: string;

    @OneToMany(()=> ExhibitionEntity, exhibition => exhibition.sponsor)
    exhibitions: ExhibitionEntity[];
}
