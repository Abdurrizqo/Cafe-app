import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { JenisTransaksi } from "../entities/riwayatTransaksi.entitty";

export class CreateTransaksiDTO {
    @IsNotEmpty()
    @IsString()
    nilaiTransaksi: string;

    @IsNotEmpty()
    jenisTransaksi: JenisTransaksi;

    @IsNotEmpty()
    @IsString()
    KeteranganTransaksi: string;

    TotalKas?: number;
}