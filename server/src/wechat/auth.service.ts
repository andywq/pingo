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

@Injectable()
export class AuthService {
  @Inject()
  private readonly jwtService: JwtService

  @Inject()
  private readonly accountService: AccountService

  @Inject()
  private readonly configService: ConfigService

  async login(
    js_code: string
  ): Promise<{
    account: AccountEntity
    accessToken: string
  }> {
    let account: AccountEntity

    try {
      const wechatResp = await axios.get(
        "https://api.weixin.qq.com/sns/jscode2session",
        {
          params: {
            appid: this.configService.config.wechat.appId,
            secret: this.configService.config.wechat.appSecret,
            js_code,
            grand_type: "authorization_code"
          }
        }
      )

      account = await this.accountService.findByWXOpenId(wechatResp.data.openid)

      // 用户不存在，创建一个
      if (account == null) {
        account = new AccountEntity()
        account.name = ""
        account.wx_open_id = wechatResp.data.openid
        account.avatar_url = ""
        account.created_at = new Date()

        account = await this.accountService.saveOrUpdate(account)
      }
    } catch (e) {
      throw new InternalServerErrorException()
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
