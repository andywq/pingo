import { AccountEntity } from "src/account/account.entity"
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm"

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

  @ManyToOne(type => AccountEntity)
  Creator: AccountEntity
}
