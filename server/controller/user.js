const Router = require("@koa/router")
const { default: fetch } = require("axios")

const { User } = require("../model/user")
const { genJwtToken } = require("../lib/jwt")
const config = require("../lib/config")

const UserRouter = new Router()

const WECHAT_CODE_TO_SESSION_URL = "https://api.weixin.qq.com/sns/jscode2session"

// POST /user/login
UserRouter.post("/login", async (ctx) => {
  const { code } = ctx.request.body

  try {
    const wechatResp = await fetch
      .get(WECHAT_CODE_TO_SESSION_URL, {
        params: {
          appid: config.wechat_app_id,
          secret: config.wechat_secret,
          js_code: code,
          grand_type: "authorization_code",
        },
      })
      .then((res) => res.data)
    const { openid: open_id } = wechatResp

    let user = await User.findOne({
      open_id,
    }).exec()

    if (!!user) {
      // 可以查到用户，返回用户信息和 token
      ctx.body = {
        user,
        jwt_token: genJwtToken(user, config.jwt_secret),
      }
      return
    }

    // 查不到用户，说明用户第一次登陆，向数据库中插入信息
    const newUser = new User({
      open_id,
      name: `用户${open_id}`,
      avatar: "",
    })

    user = await newUser.save()
    // 可以查到用户，返回用户信息和 token
    ctx.body = {
      user,
      jwt_token: genJwtToken(user, config.jwt_secret),
    }
  } catch (err) {
    console.error(err)

    ctx.status = 500
    ctx.body = err
    return
  }
})

// GET /user/info 获取登陆用户信息
UserRouter.get("/info", async (ctx) => {
  const { open_id } = ctx.user

  try {
    const user = await User.findOne({
      open_id,
    }).exec()

    ctx.body = user
  } catch (err) {
    console.error(err)

    ctx.status = 500
    ctx.body = err
    return
  }
})

module.exports = UserRouter
