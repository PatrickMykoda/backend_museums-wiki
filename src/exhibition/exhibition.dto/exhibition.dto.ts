import {IsNotEmpty, IsString} from 'class-validator';

export class ExhibitionDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}
