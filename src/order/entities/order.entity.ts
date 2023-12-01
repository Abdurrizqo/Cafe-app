import { Meja } from "src/meja/entities/meja.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderToMenu } from "./orderToMenu.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn("uuid")
    idOrder: string;

    @OneToMany(() => OrderToMenu, (orderToMenu) => orderToMenu.orderMenu)
    orderToMenu: OrderToMenu[]

    @ManyToOne(() => Meja, (meja) => meja.order, { cascade: ["update"], nullable: false })
    @JoinColumn()
    meja: Meja;

    @Column({ nullable: false })
    nomerAntrian: number;

    @Column({ type: "datetime", nullable: false })
    tanggalDatang: Date;

    @Column({ type: "longtext", nullable: true })
    catatan: string;

    @Column({ nullable: false, default: false })
    isPaid: boolean
}
