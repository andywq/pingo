const { apiEndpoint } = require("./utils")

module.exports = class UserAPI {
  /**
   * 登录，并获取 OpenID
   * @param {string} code 
   * @returns {Promise<{
   *   session_id: string
   *   open_id: string
   *   union_id: strng
   * }>}
   */
  static login(code) {
    return new Promise((res, rej) => {
      wx.request({
        url: `${apiEndpoint}/v1/login`,
        data: {
          code
        },
        success: r => res(r.data),
        fail: rej
      })
    })
  }
}