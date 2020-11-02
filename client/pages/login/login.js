const UserAPI = require("../../apis/user")
const WechatAPI = require("../../apis/wechat")

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    if (!this.data.canIUse){
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          this.afterGetInfo(res.userInfo)
        }
      })
    }
  },
  getUserInfo: function(e) {
    this.afterGetInfo(JSON.parse(e.detail.rawData))
  },
  afterGetInfo: function(info) {
    UserAPI.updateNameAvatar(info.nickName, info.avatarUrl)
    wx.redirectTo({
      url: "/pages/index/index"
    })
  },
})
