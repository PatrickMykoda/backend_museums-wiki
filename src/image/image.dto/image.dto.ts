import {IsNotEmpty, IsNumber, IsString, IsUrl} from 'class-validator';

export class ImageDto {

    @IsUrl()
    @IsNotEmpty()
    readonly source: string;

    @IsString()
    @IsNotEmpty()
    readonly altText: string;

    @IsNumber()
    @IsNotEmpty()
    readonly height: number;

    @IsNumber()
    @IsNotEmpty()
    readonly width: number;
}
