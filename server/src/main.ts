import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ConfigService } from "./config/config.service"
import { Logger } from "@nestjs/common"
import { join } from "path"

import * as bodyParser from "body-parser"
import * as hbs from "hbs"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const { config, mode } = app.get(ConfigService)

  app.useStaticAssets(join(__dirname, "..", "public"))
  app.setBaseViewsDir(join(__dirname, "..", "views"))
  app.setViewEngine("hbs")
  hbs.registerPartials(join(__dirname, "..", "views/partials"))
  app.use(bodyParser.json({ limit: "5mb" }))
  app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }))

  await app.listen(config.port)

  Logger.log(`Running on :${config.port} in ${mode} mode.`)
}

bootstrap()
