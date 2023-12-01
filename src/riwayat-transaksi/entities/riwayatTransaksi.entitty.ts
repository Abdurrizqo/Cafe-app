import { Order } from "src/order/entities/order.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export enum JenisTransaksi {
    MASUK = 'masuk',
    KELUAR = 'keluar'
}

@Entity()
export class RiwayatTransaksi {
    @PrimaryGeneratedColumn("uuid")
    idRiwayatTransaksi: string;

    @Column({ type: 'datetime', nullable: true })
    tanggalTransaksi: Date

    @Column({ nullable: false })
    nilaiTransaksi: number;

    @Column({ nullable: false, type: "enum", enum: JenisTransaksi, default: JenisTransaksi.MASUK })
    jenisTansaksi: JenisTransaksi

    @Column({ nullable: false })
    TotalKas: number;

    @Column({ type: 'text', nullable: true })
    keteranganTransaksi: string

    @OneToOne(() => Order)
    @JoinColumn()
    idOrder: Order;
}