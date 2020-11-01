import {
  Injectable,
  Inject,
  InternalServerErrorException,
  UnauthorizedException
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { AccountEntity } from "../account/account.entity"
import { AccountService } from "../account/account.service"
import axios from "axios"
import { ConfigService } from "src/config/config.service"

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
    } catch (e) {
      throw new InternalServerErrorException()
    }

    if (account == null) {
      throw new UnauthorizedException()
    }

    return {
      account,
      accessToken: this.jwtService.sign(account)
    }
  }

  async validateUser(payload: AccountEntity): Promise<AccountEntity> {
    return payload
  }
}
