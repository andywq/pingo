const { fetch } = require("./utils")

module.exports = class OrderAPI {
  /**
   * 加载订单列表
   * @param {number} limit 
   * @param {number} skip 
   */
  static list(limit, skip) {
    return fetch("GET", "/order", {limit, skip})
  }

  /**
   * 获取订单详情
   * @param {string} id 
   */
  static show(id) {
    return fetch("GET", `/order/${id}`)
  }

  /**
   * 获取订单详情
   * @param {string} id 
   */
  static export(id) {
    return fetch("GET", `/order/${id}/export`)
  }

  /**
   * 创建拼购订单
   * @param {{name: string, products: Array<{name: string, desc: string, unit_price: number, select_mode: string}>}} order 
   * @returns {Promise<void>}
   */
  static create(order) {
    return fetch("POST", `/order`, order)
  }

  /**
   * 关闭订单
   * @param {string} orderId 
   */
  static close(orderId) {
    return fetch("POST", `/order/${orderId}/close`)
  }

  /**
   * 根据拼购订单号加入拼购
   * @param {string} code 
   */
  static join(code) {
    return fetch("POST", `/order/join`, { code })
  }

  /**
   * 添加订单中的商品
   * @param {string} orderId 
   * @param {any} product 
   */
  static addProduct(orderId, product) {
    return fetch("POST", `/order/${orderId}/product/`, product)
  }
  /**
   * 删除订单中的商品
   * @param {string} orderId 
   * @param {string} productId 
   */
  static deleteProduct(orderId, productId) {
    return fetch("DELETE", `/order/${orderId}/product/${productId}`)
  }

  /**
   * 更新订单中商品基本信息 name desc unit_price select_mode
   * @param {string} orderId 
   * @param {string} productId 
   * @param {string} info 
   */
  static updateProductInfo(orderId, productId, info) {
    return fetch("PUT", `/order/${orderId}/product/${productId}`, {
      name: info.name,
      desc: info.desc,
      unit_price: info.unit_price,
      select_mode: info.select_mode
    })
  }

  /**
   * 更新我的商品选购数量
   * @param {string} orderId 
   * @param {string} productId 
   * @param {number} buy_number 
   */
  static updateMyProductSelectNumber(orderId, productId, buy_number) {
    return fetch("PUT", `/order/${orderId}/product/${productId}/member`, {
      buy_number
    })
  }
}