const OrderAPI = require("../../apis/order")

Page({
  data: {
    id: "",
    readonly: false,
    isLoading: false,
    order: null,

    statusTM: {
      open: "进行中",
      closed: "已结束"
    },
    isAddModalVisiable: false,
    isModifyModalVisiable: false,
    modifyProduct: null,
    modifyProductIndex: -1
  },

  onLoad: function (options) {
    this.setData({
      "id": options.id
    })
  },
  onReady: function () {
    this.refresh()
  },
  onPullDownRefresh: function () {
    this.refresh()
  },

  refresh: async function () {
    // if (!this.data.id) {
    //   return
    // }
    wx.showLoading()
    this.isLoading = true

    try {
      const order = await OrderAPI.show(this.data.id)
      const readonly = order.status === "closed"
      this.setData({
        order,
        readonly
      })
    } catch (error) {
      console.log(error)
    }

    this.isLoading = false
    wx.hideLoading()
  },


  handleTitleInput: function (e) {
    this.setData({
      "order.title": e.detail.value
    })
  },

  // 新增商品模态框
  handleAddProduct: function () {
    this.setData({
      isAddModalVisiable: true
    })
  },
  handleCloseAddModal: function () {
    this.setData({
      isAddModalVisiable: false
    })
  },
  handleSubmitAddModal: function (v) {
    this.setData({
      isAddModalVisiable: false
    })
    this.data.order.products.push(v.detail)
    this.setData({
      "order.products": this.data.order.products
    })
  },

  // 处理产品数据更新
  handleTapProductCard: function (v) {
    const product = this.data.order.products[v.target.dataset.index]
    this.setData({
      modifyProduct: product,
      modifyProductIndex: v.target.dataset.index,
      isModifyModalVisiable: true
    })
  },
  handleCloseModifyModal: function () {
    this.setData({
      isModifyModalVisiable: false
    })
  },
  handleSubmitModifyModal: function (v) {
    this.setData({
      isModifyModalVisiable: false
    })
    this.setData({
      [`order.products[${this.data.modifyProductIndex}]`]: v.detail
    })
  },
  handleDeleteModifyModal: async function (v) {
    const p = v.detail
    if (p.members && p.members.length > 0) {
      wx.showToast({
        icon: "none",
        title: '商品已经有人订购，删除前需要联系对方取消订购',
      })
      return
    }
    
    this.setData({
      isModifyModalVisiable: false
    })

    // 订单 ID 商品 ID
    await OrderAPI.deleteProduct(this.data.order.id, v.detail.id)
    this.refresh()
  }
})