const Koa = require("koa")
const Router = require("@koa/router")
const bodyParser = require("koa-bodyparser")

const config = require("./lib/config")
const { setup: setupDB } = require("./model/setup")

const LogMiddleware = require("./middleware/log")
const AuthMiddleware = require("./middleware/auth")

const UserRouter = require("./controller/user")
const OrderRouter = require("./controller/order")
// 启动
async function boot() {
  try {
    // 初始化数据库
    await setupDB(config.mongo_host, config.mongo_port, config.mongo_db_name, config.mongo_user, config.mongo_password)

    // 初始化 Web 服务器
    const app = new Koa()
    const router = new Router()

    // 中间件注册
    app.use(LogMiddleware)
    app.use(bodyParser())
    app.use(AuthMiddleware)

    // 路由注册
    router.use("/user", UserRouter.routes())
    // router.use("/order", OrderRouter.routes())

    router.use("/order", OrderRouter.routes())

    // 启动
    app.use(router.routes())
    app.listen(config.port, () => {
      console.log(`服务已启动 @${config.port}`)
    })
  } catch (error) {
    console.error("启动失败", error)
    process.exit(1)
  }
}

boot()
