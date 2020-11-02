import { Module } from "@nestjs/common"
import { SessionController } from "./session.controller"
import { JwtModule } from "@nestjs/jwt"
import { AuthService } from "./auth.service"
import { JwtStrategy } from "./jwt.strategy"
import { PassportModule } from "@nestjs/passport"
import { MainModule } from "../main/main.module"
import { AccountModule } from "../account/account.module"
import { ConfigService } from "../config/config.service"
import { OrderController } from "./order.controller"
import { OrderService } from "../main/order.service"
import { ProductService } from "../main/product.service"
import { ProductMemberService } from "../main/product_member.service"

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt", session: true }),
    JwtModule.registerAsync({
      useExisting: ConfigService
    }),
    MainModule,
    AccountModule
  ],
  providers: [
    AuthService,
    JwtStrategy,
    OrderService,
    ProductService,
    ProductMemberService
  ],
  controllers: [SessionController, OrderController]
})
export class WechatModule {}
