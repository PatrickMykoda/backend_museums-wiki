import {IsNotEmpty, IsString, IsUrl} from 'class-validator';

export class SponsorDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsUrl()
    @IsNotEmpty()
    readonly website: string;
}
