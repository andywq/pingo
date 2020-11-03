const UserAPI = require("./apis/user")
const WechatAPI = require("./apis/wechat")

//app.js
App({
  onLaunch: async function () {
    this.globalData.loginPromise = new Promise(async (res, rej) => {
      try {
        const {
          code
        } = await WechatAPI.login()
        const {
          accessToken,
          account
        } = await UserAPI.login(code)
        this.globalData.accessToken = accessToken
        this.globalData.account = account
        res()
      } catch (err) {
        console.log(err)
        rej(err)
      }
    })
  },
  globalData: {
    accessToken: null,
    account: null,
    loginPromise: null
  },
})