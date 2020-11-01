import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  UseGuards,
  Req
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthGuard } from "@nestjs/passport"
import { IRequest } from "./interfaces"

@Controller("/api/wechat/session")
export class SessionController {
  @Inject()
  private authService: AuthService

  @Get("/")
  @UseGuards(AuthGuard())
  session(@Req() request: IRequest) {
    return request.user
  }

  @Post("/")
  login(@Body() loginReq: ILoginRequest) {
    return this.authService.login(loginReq.code)
  }
}

interface ILoginRequest {
  code: string
}
