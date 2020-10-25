const Koa = require("koa");
const Router = require("@koa/router");

const config = require("./lib/config")
const UserRouter = require("./controller/user");

const app = new Koa();
const router = new Router();

// 配置
//   - 数据库信息：host 端口 用户名 密码
//   - 服务端口
// 鉴权
// 日志
// 路由

app.use(async (ctx, next) => {
  const st = new Date().getTime()
  await next()
  const et = new Date().getTime()
  console.log("request used", et - st, "ms")
})

router.get("/ping", (ctx) => {
  ctx.response.body = "pong";
});
router.use("/user", UserRouter.routes());

app.use(router.routes());

app.listen(config.port, () => {
  console.log(`服务已启动 @${config.port}`);
});
