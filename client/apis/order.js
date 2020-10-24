const { apiEndpoint } = require("./utils")

module.exports = class OrderAPI {
  /**
   * 加载订单列表
   * @param {number} limit 
   * @param {number} skip 
   */
  static list(limit, skip) {
    return new Promise((res, rej) => {
      wx.request({
        method: "GET",
        url: `${apiEndpoint}/v1/order`,
        data: {
          limit,
          skip
        },
        success: r => res(r.data),
        fail: rej
      })
    })
  }

  /**
   * 获取订单详情
   * @param {string} id 
   */
  static show(id) {
    return new Promise((res, rej) => {
      wx.request({
        method: "GET",
        url: `${apiEndpoint}/v1/order/${id}`,
        success: r => res(r.data),
        fail: rej
      })
    })
  }

  /**
   * 创建拼购订单
   * @param {{name: string, products: Array<{name: string, desc: string, unit_price: number, select_mode: string}>}} order 
   * @returns {Promise<void>}
   */
  static create(order) {
    return new Promise((res, rej) => {
      wx.request({
        method: "POST",
        url: `${apiEndpoint}/v1/order`,
        data: order,
        success: r => res(r.data),
        fail: rej
      })
    })
  }

  /**
   * 关闭订单
   * @param {string} orderId 
   */
  static close(orderId) {
    return new Promise((res, rej) => {
      wx.request({
        method: "POST",
        url: `${apiEndpoint}/v1/order/${orderId}/close`,
        success: r => res(r.data),
        fail: rej
      })
    })
  }

  /**
   * 根据拼购订单号加入拼购
   * @param {string} code 
   */
  static join(code) {
    return new Promise((res, rej) => {
      wx.request({
        method: "POST",
        url: `${apiEndpoint}/v1/order/join`,
        data: {
          code
        },
        success: r => res(r.data),
        fail: rej
      })
    })
  }

  /**
   * 删除订单中的商品
   * @param {string} orderId 
   * @param {string} productId 
   */
  static deleteProduct(orderId, productId) {
    return new Promise((res, rej) => {
      wx.request({
        method: "DELETE",
        url: `${apiEndpoint}/v1/order/${orderId}/product/${productId}`,
        success: r => res(r.data),
        fail: rej
      })
    })
  }

  /**
   * 更新订单中商品基本信息 name desc unit_price select_mode
   * @param {string} orderId 
   * @param {string} productId 
   * @param {string} info 
   */
  static updateProductInfo(orderId, productId, info) {
    return new Promise((res, rej) => {
      wx.request({
        method: "PATCH",
        url: `${apiEndpoint}/v1/order/${orderId}/product/${productId}`,
        data: {
          name: info.name,
          desc: info.desc,
          unit_price: info.unit_price,
          select_mode: info.select_mode
        },
        success: r => res(r.data),
        fail: rej
      })
    })
  }

  /**
   * 更新我的商品选购数量
   * @param {string} orderId 
   * @param {string} productId 
   * @param {number} myNumber 
   */
  static updateMyProductSelectNumber(orderId, productId, myNumber) {
    return new Promise((res, rej) => {
      wx.request({
        method: "PATCH",
        url: `${apiEndpoint}/v1/order/${orderId}/product/${productId}/my_number/${myNumber}`,
        success: r => res(r.data),
        fail: rej
      })
    })
  }
}