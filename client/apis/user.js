const { fetch } = require("./utils")

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
    return fetch("POST", "/user/login", { code })
  }
}