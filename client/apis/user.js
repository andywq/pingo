const { fetch } = require("./utils")

module.exports = class UserAPI {
  /**
   * 登录，并获取 OpenID
   * @param {string} code 
   * @returns {Promise<{
   *   accessToken: string
   *   account: {}
   * }>}
   */
  static login(code) {
    return fetch("POST", "/session/", { code })
  }

  // 更新用户名和头像到后端
  static updateNameAvatar(name, avatar_url) {
    return fetch("PUT", `/session/`, {
      name, avatar_url
    })
  }
}
