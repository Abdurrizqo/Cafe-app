import { OrderToMenu } from "src/order/entities/orderToMenu.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class Menu {
    @PrimaryGeneratedColumn("uuid")
    idMenu: string;

    @Column({ name: "menu_name", length: 100, nullable: false, unique: true })
    menuName: string;

    @Column({ name: "harga", nullable: false })
    harga: number;

    @Column({ name: "stok_harian", default: 0 })
    stokHarian: number;

    @Column({ name: "default_stok_harian", default: 0 })
    defaultStokHarian: number;

    @Column({ name: "is_default_stok_active", default: false })
    isDefaultStokActive: boolean

    @Column({ nullable: true })
    menuImage: String

    @OneToMany(() => OrderToMenu, (orderToMenu) => orderToMenu.menu)
    orderToMenu: OrderToMenu[]
}