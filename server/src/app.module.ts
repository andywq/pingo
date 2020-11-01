import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AppController } from "./app.controller"
import { ConfigModule } from "./config/config.module"
import { AccountModule } from "./account/account.module"
import { ConfigService } from "./config/config.service"
import { MainModule } from "./main/main.module"
import { WechatModule } from "./wechat/wechat.module"

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useExisting: ConfigService
    }),
    AccountModule,
    MainModule,
    WechatModule
  ],
  controllers: [AppController]
})
export class AppModule {}
