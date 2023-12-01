import { IsNotEmpty, Length } from "class-validator";

export class CreateMejaDto {
    @IsNotEmpty()
    @Length(1,100)
    namaMeja: string
}
