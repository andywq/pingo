import { TypeOrmModuleOptions } from "@nestjs/typeorm"

export interface IOssOptions {
  region: string
  bucket: string
  accessKey: string
  secretKey: string
  domain: string
}

export interface IJwtOptions {
  expiresIn: string
  secret: string
}

export interface IWechatOptions {
  appId: string
  appSecret: string
}

export interface IConfig {
  name: string
  port: number
  database: TypeOrmModuleOptions
  jwt: IJwtOptions
  wechat: IWechatOptions
}
