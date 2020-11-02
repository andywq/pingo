import { AccountEntity } from "../account/account.entity"
import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  TableForeignKey
} from "typeorm"
import { OrderEntity } from "./order.entity"
import { OrderService } from "./order.service"
import { ProductEntity } from "./product.entity"

@Entity("product_member")
export class ProductMemberEntity {
  @ManyToOne(type => ProductEntity, {
    primary: true,
    cascade: false,
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "product_id" })
  product: ProductEntity

  @ManyToOne(type => AccountEntity, {
    primary: true,
    cascade: false,
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "account_id" })
  account: AccountEntity

  // 冗余设计，加速统计金额
  @ManyToOne(type => OrderEntity, { cascade: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "order_id" })
  order: OrderEntity

  @Column({ type: "double" })
  buy_number: number // 购买数量
}
