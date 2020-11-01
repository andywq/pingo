const UserAPI = require("./apis/user")

//app.js
App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: async res => {
        // 发送 res.code 到后台换取 sessionKey, unionId: id
        try {
          const { accessToken, account } = await UserAPI.login(res.code)
          this.globalData.accessToken = accessToken
          this.globalData.account = account
        } catch (error) {
          console.error(error)
          wx.showModal({
            title: "登录失败",
            content: JSON.stringify(error)
          })
        }
      }
    })
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     console.log("get setting s", res)
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo
    //           console.log("获取到微信用户信息", res)
    //         }
    //       })
    //     } else {
    //       // 未登录情况下跳转到登录页面
    //       console.log("未登录")
    //       setTimeout(() => {

    //         wx.navigateTo({
    //           url: "/pages/login/login"
    //         }).then(console.log, console.log)
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    accessToken: null,
    account: null
  }
})
