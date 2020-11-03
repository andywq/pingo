import { AccountEntity } from "../account/account.entity"
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  JoinColumn
} from "typeorm"
import { ProductEntity } from "./product.entity"

export enum OrderStatus {
  Open = "open",
  Closed = "closed"
}

@Entity("order")
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column("enum", {
    enum: OrderStatus,
    default: OrderStatus.Open
  })
  status: OrderStatus

  @Column()
  title: string

  @Column()
  created_at: Date

  @Column()
  updated_at: Date

  @Column()
  share_code: string

  @OneToMany(
    type => ProductEntity,
    product => product.order,
    {
      cascade: false
    }
  )
  products: ProductEntity[]

  @ManyToOne(type => AccountEntity, { cascade: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "creator_id" })
  creator: AccountEntity

  @ManyToMany(type => AccountEntity, { cascade: false, onDelete: "CASCADE" })
  @JoinTable({
    joinColumn: { name: "order_id" },
    inverseJoinColumn: { name: "account_id" }
  })
  members: AccountEntity[]
}

export interface IProduct {
  id: string
  name: string
  desc: string
  unit_price: number
  select_mode: string
  members: AccountEntity
}
