import { IsNotEmpty, IsNumber } from "class-validator";

export class BayarDTO{
    @IsNumber()
    @IsNotEmpty()
    jumlahBayar: number
}