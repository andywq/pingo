import { Inject, Injectable } from "@nestjs/common"
import { ConfigService } from "../config/config.service"
import axios from "axios"

@Injectable()
export class WechatService {
  private atm: AccessTokenManager

  constructor(readonly configService: ConfigService) {
    const { appId, appSecret } = configService.config.wechat
    this.atm = new AccessTokenManager(appId, appSecret)
  }

  // 登录凭证校验
  // https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
  async jscode2session(js_code) {
    const resp = await axios.get(
      "https://api.weixin.qq.com/sns/jscode2session",
      {
        params: {
          appid: this.configService.config.wechat.appId,
          secret: this.configService.config.wechat.appSecret,
          js_code,
          grant_type: "authorization_code"
        }
      }
    )
    return resp.data.openid
  }

  // 检查一段文本是否含有违法违规内容
  // https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/sec-check/security.msgSecCheck.html
  async msgSecCheck(content) {
    const access_token = await this.atm.getAccessToken()

    const resp = await axios.post(
      "https://api.weixin.qq.com/wxa/msg_sec_check",
      {
        content
      },
      {
        params: {
          access_token
        }
      }
    )

    const { errcode, errMsg } = resp.data
    if (errcode) {
      const err = new Error(`[WechatService] 内容不合法 ${errcode} ${errMsg}`)
      console.error(err)
      throw err
    }

    return true
  }
}

class AccessTokenManager {
  private accessToken: string = ""
  private expiresTime: number = 0 // 过期 unix 时间戳 ms

  private tokenPromise: Promise<string> = null

  constructor(private appId: string, private appSecret: string) {}

  private async refreshToken() {
    const resp = await axios.get("https://api.weixin.qq.com/cgi-bin/token", {
      params: {
        appid: this.appId,
        secret: this.appSecret,
        grant_type: "client_credential"
      }
    })

    const { access_token, expires_in, errcode, errmsg } = resp.data
    if (errcode) {
      const err = new Error(
        `[AccessTokenManager] failed to get wechat access_token ${errcode} ${errmsg}`
      )
      console.error(err)
      throw err
    }

    this.accessToken = access_token
    this.expiresTime = expires_in * 1000 + new Date().getTime() - 10
    return access_token
  }

  public getAccessToken() {
    if (this.expiresTime > new Date().getTime()) {
      return Promise.resolve(this.accessToken)
    }

    if (!this.tokenPromise) {
      this.tokenPromise = this.refreshToken()
    }

    return this.tokenPromise
  }
}
