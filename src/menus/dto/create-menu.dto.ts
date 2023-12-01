import { ArrayMaxSize, IsBoolean, IsNotEmpty, IsNumber, IsString, Length, max } from "class-validator";

export class CreateMenuDto {
    @IsNotEmpty()
    @Length(1, 100)
    menuName: string;

    @IsString()
    @IsNotEmpty()
    harga: string;

    @IsString()
    @IsNotEmpty()
    stokHarian: string;

    @IsString()
    @IsNotEmpty()
    defaultStokHarian: string;

    @IsString()
    isDefaultStokActive: string;

    menuImage?: string;
}
