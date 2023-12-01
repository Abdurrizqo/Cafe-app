import { IsNotEmpty, IsNumber } from "class-validator";
import { JenisTransaksi } from "../entities/riwayatTransaksi.entitty";

export class RiwayatTransaksiDTO {

    @IsNotEmpty()
    tanggalAwal: Date;

    @IsNotEmpty()
    tanggalAkhir: Date;

    jenisTransaksi?: JenisTransaksi;
}