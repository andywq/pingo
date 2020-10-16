const Router = require("@koa/router");
const { sleep } = require("../lib/utils");

const UserRouter = new Router();

// GET /user 获取用户列表
UserRouter.get("/", (ctx) => {
  ctx.set("content-type", "application/json");
  ctx.body = JSON.stringify([
    {
      name: "alex",
    },
  ]);
});

// GET /user/:name 获取用户详情
UserRouter.get("/:name", async (ctx) => {
  await sleep(2);
  ctx.set("content-type", "application/json");
  ctx.body = JSON.stringify({
    name: ctx.params.name,
    age: 10,
  });
});

module.exports = UserRouter;
