//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    isAddMenuVisiable: false,
  },

  handleToggleAddMenu: function () {
    this.setData({
      isAddMenuVisiable: !this.data.isAddMenuVisiable,
    });
  },
  handleCreate: function() {
    this.setData({
      isAddMenuVisiable: false,
    });
    wx.navigateTo({
      url: "../create/create",
    });
  },
  handleJoin: function() {
    this.setData({
      isAddMenuVisiable: false,
    });
    wx.navigateTo({
      url: "../join/join",
    });
  },

  onLoad: function () {
   // 加载列表
  },
});
