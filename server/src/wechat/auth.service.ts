import {
  Injectable,
  Inject,
  InternalServerErrorException
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { AccountEntity } from "../account/account.entity"
import { AccountService } from "../account/account.service"
import { ConfigService } from "../config/config.service"
import axios from "axios"
import { WechatService } from "./wechat.service"

@Injectable()
export class AuthService {
  @Inject()
  private readonly jwtService: JwtService

  @Inject()
  private readonly accountService: AccountService

  @Inject()
  private readonly configService: ConfigService

  @Inject()
  private readonly wechatServ: WechatService

  async login(
    js_code: string
  ): Promise<{
    account: AccountEntity
    accessToken: string
  }> {
    let account: AccountEntity

    try {
      const openId = await this.wechatServ.jscode2session(js_code)

      account = await this.accountService.findByWXOpenId(openId)

      // 用户不存在，创建一个
      if (account == null) {
        account = new AccountEntity()
        account.name = ""
        account.wx_open_id = openId
        account.avatar_url = ""
        account.created_at = new Date()

        account = await this.accountService.saveOrUpdate(account)
      }
    } catch (e) {
      console.error(e)
      throw new InternalServerErrorException(e)
    }

    const payload = JSON.parse(JSON.stringify(account))

    return {
      account,
      accessToken: this.jwtService.sign(payload)
    }
  }

  async validateUser(payload: AccountEntity): Promise<AccountEntity> {
    // 用户没有状态，此处无需校验
    return payload
  }
}
