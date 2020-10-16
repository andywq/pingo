const Koa = require("koa");
const Router = require("@koa/router");

const UserRouter = require("./controller/user");

const app = new Koa();
const router = new Router();

router.get("/ping", (ctx) => {
  ctx.response.body = "pong";
});

router.use("/user", UserRouter.routes());

app.use(router.routes());

app.listen(3000, () => {
  console.log("服务已启动 @3000");
});
