import {IsDate, IsNotEmpty, IsString, IsUrl} from 'class-validator';

export class ArtistDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly birthplace: string;

    @IsString()
    @IsNotEmpty()
    readonly birthdate: string;

    @IsUrl()
    @IsNotEmpty()
    readonly image: string;
}
