//index.js

const OrderAPI = require("../../apis/order");

//获取应用实例
const app = getApp();

Page({
  data: {
    isAddMenuVisiable: false,
    isLoading: false,
    /** @type {Array<{name: string, products: Array<{name: string, desc: string}>}>} */
    orders: []
  },
  handleContainerTap: function (e) {
    if (this.data.isAddMenuVisiable && e.target.id !== "menu-btn") {
      this.setData({
        isAddMenuVisiable: false,
      });
    }
  },
  // 菜单入口
  handleToggleAddMenu: function (e) {
    this.setData({
      isAddMenuVisiable: !this.data.isAddMenuVisiable,
    });
  },
  handleCreate: function () {
    this.setData({
      isAddMenuVisiable: false,
    });
    wx.navigateTo({
      url: "../create/create",
    });
  },
  handleJoin: function () {
    this.setData({
      isAddMenuVisiable: false,
    });
    wx.navigateTo({
      url: "../join/join",
    });
  },

  handleTapOrderCard: function (e) {
    const i = e.target.dataset.index
    const o = this.data.orders[i]
    wx.navigateTo({
      url: `/pages/order/order?id=${o.id}`,
    })
  },

  // 生命周期
  onReady: function () {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  onShow: function () {
    this.refreshOrders()
  },
  onPullDownRefresh: function () {
    this.refreshOrders()
  },
  onReachBottomDistance: function () {
    this.loadMoreOrders()
  },

  // 加载
  refreshOrders: async function () {
    this.setData({
      isLoading: true
    })
    try {
      // wx.showLoading()
      const orders = await OrderAPI.list(5, 0)
      this.setData({
        orders
      })
    } catch (e) {
      console.log(e)
    }
    this.setData({
      isLoading: false
    })
    wx.stopPullDownRefresh({
      success: (res) => {},
    })
    // wx.hideLoading()
  },
  loadMoreOrders: async function () {
    this.setData({
      isLoading: true
    })
    try {
      const orders = await OrderAPI.load(5, this.data.orders.length)
      this.setData({
        orders: [...this.data.orders, ...orders]
      })
    } catch (e) {
      console.log(e)
    }
    this.setData({
      isLoading: false
    })
  }
});