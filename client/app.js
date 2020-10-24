const UserAPI = require("./apis/user")

//app.js
App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: async res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.globalData.session = await UserAPI.login(res.code)
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log("get setting s", res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })
  },
  globalData: {
    // userInfo: null // id: xxx
    userInfo: {
      id: 111
    }
  }
})