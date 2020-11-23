import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from "typeorm"
import { OrderEntity } from "./order.entity"

@Entity("product")
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  desc: string

  @Column({ type: "double" })
  unit_price: number

  @Column()
  select_mode: string

  @Column()
  created_at: Date

  @Column()
  updated_at: Date

  @ManyToOne(
    type => OrderEntity,
    order => order.products,
    {
      cascade: false,
      onDelete: "CASCADE"
    }
  )
  @JoinColumn({ name: "order_id" })
  order: OrderEntity
}
