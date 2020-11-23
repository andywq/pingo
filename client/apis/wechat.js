
const regeneratorRuntime = require("../utils/runtime");
module.exports = class WechatAPI {
  /**
   * @returns {Promise<{code: string}>}
   */
  static login() {
    return new Promise((res,rej) => {
      wx.login({
        success: res,
        fail: rej
      })
    })
  }

  /**
   * @returns {Promise<{ nickName: string, avatarUrl: string}>}
   */
  static getUserInfo() {
    return new Promise((res,rej) => {
      wx.getSetting({
        success: r => {
          if (r.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: rr => {
                res(rr.userInfo)
              },
              fail: rej
            })
          }
          res(null)
        },
        fail: rej
      })
    })
  }
}
