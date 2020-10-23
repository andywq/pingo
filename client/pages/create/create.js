// pages/create/create.js
const OrderAPI = require("../../apis/order")
const { navigateBackOrIndex, sleep } = require("../../utils/util")

Page({
  data: {
    title: "QVM 拼水果",
    products: [{
      name: "山东红富士",
      desc: "整箱 24个每箱 甜脆",
      unit_price: 14.5,
      select_mode: "float"
    }, {
      name: "辽宁巨峰 A果",
      desc: "整箱 约6串 约15斤",
      unit_price: 88,
      select_mode: "int"
    }],

    isAddModalVisiable: false,
    isModifyModalVisiable: false,
    modifyProduct: null,
    modifyProductIndex: -1
  },

  handleSubmit: async function () {
    try {
      await wx.showLoading({mask: true})
      await OrderAPI.create(this.data)
    } catch (e) {
      wx.showToast({
        title: '提交失败请重试',
      })
      return
    } finally {
      wx.hideLoading()
    }

    navigateBackOrIndex()
  },

  handleTitleInput: function (e) {
    this.setData({
      title: e.detail.value
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
    this.data.products.push(v.detail)
    this.setData({
      products: this.data.products
    })
    console.log(this.data.products)
  },

  // 处理产品数据更新
  handleTapProductCard: function (v) {
    const product = this.data.products[v.target.dataset.index]
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
      [`products[${this.data.modifyProductIndex}]`]: v.detail
    })
  }
})