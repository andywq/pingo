// components/LoginAlert.js
const UserAPI = require("../apis/user")

Component({
  data: {
    isShow: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  methods: {
    getUserInfo: function (e) {
      if (e.detail.errMsg !== "getUserInfo:ok") {
        return
      }
      this.afterGetInfo(JSON.parse(e.detail.rawData))
    },
    afterGetInfo: async function (info) {
      try {
        await UserAPI.updateNameAvatar(info.nickName, info.avatarUrl)
        this.setData({
          isShow: false
        })
        const app = getApp()
        app.globalData.account.avatar_url = info.avatarUrl
        app.globalData.account.name = info.nickName
      } catch (err) {
        wx.showToast({
          title: '提交信息失败，请重试',
          icon: "none"
        })
        console.log(err)
      }
    },
  },
  attached: async function () {
    if (!this.data.canIUse) {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          this.afterGetInfo(res.userInfo)
        }
      })
    } else {
      const app = getApp()
      await app.globalData.loginPromise
      if (!app.globalData.account.avatar_url) {
        this.setData({
          isShow: true
        })
      }
    }
  }
})