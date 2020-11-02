const UserAPI = require("../../apis/user")
const WechatAPI = require("../../apis/wechat")

// pages/loading/loading.js
Page({
  onReady: async function () {
    const app = getApp()
    if (app.globalData.account && app.globalData.account.name) {
      wx.redirectTo({
        url: "/pages/index/index"
      })
      return
    }

    const wechatUserInfo = await WechatAPI.getUserInfo()
    if (!wechatUserInfo) {
      wx.nave
      wx.redirectTo({
        url: "/pages/login/login"
      })
      return
    }

    UserAPI.updateNameAvatar(wechatUserInfo.nickName, wechatUserInfo.avatarUrl)
    wx.navigateTo({
      url: "/pages/index/index"
    })

  }
})