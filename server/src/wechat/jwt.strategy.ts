import { ExtractJwt, Strategy } from "passport-jwt"
import { AuthService } from "./auth.service"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "../config/config.service"
import { AccountEntity } from "src/account/account.entity"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.config.jwt.secret
    })
  }

  async validate(payload: AccountEntity) {
    const user = await this.authService.validateUser(payload)
    if (!user) {
      throw new UnauthorizedException()
    }
    return JSON.parse(JSON.stringify(user))
  }
}
