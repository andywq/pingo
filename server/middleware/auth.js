const { verifyJwtToken } = require("../lib/jwt")
const config = require("../lib/config")

/**
 * Auth 授权中间件
 * @param {*} ctx
 * @param {*} next
 */
module.exports = async (ctx, next) => {
  // 登陆页面无需鉴权
  if (ctx.request.url === "/user/login" && ctx.request.method === "POST") {
    await next()
    return
  }

  const authHeader = ctx.request.header["authorization"]
  if (!authHeader) {
    ctx.status = 401
    ctx.body = "missing authorization"
    return
  }

  const token = authHeader.split(" ")[1]
  if (!token) {
    ctx.status = 401
    ctx.body = "invalid authorization format"
    return
  }

  const user = verifyJwtToken(token, config.jwt_secret)
  if (!user) {
    ctx.status = 401
    ctx.body = "invalid authorization"
    return
  }

  ctx.user = user

  console.log("鉴权成功", user)

  await next()
}
