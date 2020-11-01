import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { OrderEntity } from "./order.entity"
import { OrderService } from "./order.service"
import { ProductEntity } from "./product.entity"
import { ProductService } from "./product.service"
import { ProductMemberEntity } from "./product_member.entity"
import { ProductMemberService } from "./product_member.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, ProductEntity, ProductMemberEntity])
  ],
  providers: [OrderService, ProductService, ProductMemberService],
  exports: [OrderService, ProductService, ProductMemberService]
})
export class MainModule {}
