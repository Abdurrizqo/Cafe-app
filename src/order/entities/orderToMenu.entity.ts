import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Menu } from "src/menus/entities/menu.entity";

@Entity()
export class OrderToMenu {
    @PrimaryGeneratedColumn("uuid")
    idOrderToMenu: string;

    @ManyToOne(() => Order, (order) => order.idOrder, { nullable: false })
    orderMenu: Order;

    @ManyToOne(() => Menu, (menu) => menu.idMenu, { nullable: false })
    menu: Menu;

    @Column({ nullable: false })
    jumlahPesanan: number;
}