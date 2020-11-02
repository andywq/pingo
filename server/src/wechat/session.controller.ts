import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  UseGuards,
  Req,
  Put,
  InternalServerErrorException
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthGuard } from "@nestjs/passport"
import { IRequest } from "./interfaces"
import { AccountService } from "../account/account.service"

@Controller("/api/wechat/session")
export class SessionController {
  @Inject()
  private authServ: AuthService
  @Inject()
  private accServ: AccountService

  @Get("/")
  @UseGuards(AuthGuard())
  session(@Req() request: IRequest) {
    return request.user
  }

  @Post("/")
  login(@Body() loginReq: ILoginRequest) {
    return this.authServ.login(loginReq.code)
  }

  @Put("/")
  @UseGuards(AuthGuard())
  async updateNameAvatar(
    @Req() request: IRequest,
    @Body() params: { name: string; avatar_url: string }
  ) {
    try {
      const u = await this.accServ.findByWXOpenId(request.user.wx_open_id)
      u.name = params.name
      u.avatar_url = params.avatar_url

      return this.accServ.saveOrUpdate(u)
    } catch (err) {
      console.error(err)
      throw new InternalServerErrorException(err)
    }
  }
}

interface ILoginRequest {
  code: string
}
