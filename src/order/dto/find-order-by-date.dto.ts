import { IsString } from "class-validator";

export class FindOrderByDateDTO {
    @IsString()
    todayStart: string

    @IsString()
    todayEnd: string;

    isPaid: boolean;
}
