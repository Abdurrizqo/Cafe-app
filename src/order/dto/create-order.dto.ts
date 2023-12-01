import { IsNotEmpty } from "class-validator";

export class CreateOrderDto {
    @IsNotEmpty()
    listMenu: {
        menuId: string;
        jumlahPesanan: number;
    }[];

    @IsNotEmpty()
    meja: string;

    catatan: string;
}
