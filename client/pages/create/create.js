// pages/create/create.js
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

    isAddModalVisiable: false
  },

  handleSubmit: function () {
    console.log("submit", this.data)
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
    console.log(product.name)
    // console.log("handle product update", v.detail.index, v.detail.item)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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