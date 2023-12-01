import { Order } from "src/order/entities/order.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Meja {
    @PrimaryGeneratedColumn("uuid")
    idMeja: string;

    @Column({ name: "nama_meja", unique: true, length: 60, nullable: false })
    namaMeja: string

    @OneToMany(() => Order, (order) => order.idOrder, {nullable:false})
    order:Order[]
}
