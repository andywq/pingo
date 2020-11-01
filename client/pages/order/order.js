const OrderAPI = require("../../apis/order")
const {
  navigateBackOrIndex
} = require("../../utils/util")

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
    console.log(options)
    this.setData({
      "id": options.id
    })
  },
  onShow: function () {
    this.refresh()
  },
  onPullDownRefresh: function () {
    this.refresh()
  },

  refresh: async function () {
    wx.showLoading()
    this.isLoading = true

    try {
      const order = await OrderAPI.show(this.data.id)
      const readonly = order.status === "closed"

      let total = 0
      for (const p of order.products) {
        for (const m of p.members) {
          total += m.buy_number
        }
      }
      order.total = total

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

  handleClose: function () {
    wx.showModal({
      title: "您确定要结束此次拼购吗？结束后无法编辑。",
      success: async ({
        confirm
      }) => {
        if (!confirm) {
          return
        }

        try {
          wx.showLoading()
          await OrderAPI.close(this.data.id)
          navigateBackOrIndex()
        } catch (err) {
          console.log(err)
          wx.showToast({
            title: '关闭失败',
          })
        } finally {
          wx.hideLoading()
        }
      }
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
  handleSubmitAddModal: async function (v) {
    this.setData({
      isAddModalVisiable: false
    })
    this.data.order.products.push(v.detail)
    this.setData({
      "order.products": this.data.order.products
    })

    if (this.data.id) {
      // TODO 提交更新
      wx.showLoading()
      try {
        await OrderAPI.addProduct(this.data.id, v.detail)
      } catch (err) {
        console.error(err)
        wx.showToast({
          title: '更新失败，请重试',
        })
      }
      wx.hideLoading()
      this.refresh()
    }
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
  handleSubmitModifyModal: async function (v) {
    this.setData({
      isModifyModalVisiable: false
    })

    try {
      wx.showLoading()
      await OrderAPI.updateProductInfo(this.data.id, v.detail.id, v.detail)
      await OrderAPI.updateMyProductSelectNumber(this.data.id, v.detail.id, v.detail._my_number)
    } catch (error) {
      console.error(error)
      wx.showToast({
        title: '更新失败，请重试',
      })
    }
    wx.hideLoading()
    this.refresh()
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