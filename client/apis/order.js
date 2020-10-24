const { apiEndpoint } = require("./utils")

module.exports = class OrderAPI {
  /**
   * 加载订单列表
   * @param {number} limit 
   * @param {number} skip 
   */
  static load(limit, skip) {
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
}