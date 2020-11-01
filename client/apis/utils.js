
// const apiEndpoint = "https://api.pingo.alexyan.cc"
// const apiEndpoint = "http://api.alexyan.cc/mock/104"
const apiEndpoint = "http://127.0.0.1:8080/api/wechat"

exports.fetch = function(method, url, data) {

  const app = getApp();
  const header = {}

  if (method != "GET") {
    header["Content-Type"] = "application/json"
  }

  if (app.globalData.accessToken) {
    header["Authorization"] = `Bearer ${app.globalData.accessToken}`
  }

  return new Promise((res, rej) => {
    wx.request({
      method,
      header,
      url: `${apiEndpoint}${url}`,
      data,
      success: r => res(r.data),
      fail: rej
    })
  })
}