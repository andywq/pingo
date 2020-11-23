const { sleep, navigateBackOrIndex } = require("../../utils/util");
const OrderAPI = require("../../apis/order");
const regeneratorRuntime = require("../../utils/runtime");

// pages/join/join.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "",
    parts: ["", "", "", "", "", ""],
    len: 0,
    submitting: false
  },

  handleInput: function (e) {
    const fill = (e.detail.value + "      ").substr(0, 6)
    const parts = fill.split("")
    const code = e.detail.value.substr(0, 6);
    this.setData({
      code,
      parts,
      len: code.length
    })
  },

  handleSubmit: async function () {
    if (this.data.code.length < 6) {
      return
    }
    this.setData({
      submitting: true
    })

    try {
      // await wx.showLoading({mask: true})
      await OrderAPI.join(this.data.code)
    } catch (e) {
      wx.showToast({
        title: '加入失败',
      })
      return
    } finally {
      // wx.hideLoading()
      this.setData({
        submitting: false
      })
    }

    navigateBackOrIndex()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const app = getApp()
    console.log("dddd", app)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})