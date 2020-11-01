
// const apiEndpoint = "https://api.pingo.alexyan.cc"
// const apiEndpoint = "http://api.alexyan.cc/mock/104"
const apiEndpoint = "http://127.0.0.1:9099"

exports.fetch = function(method, url, data) {

  const app = getApp();
  const header = {}

  if (method != "GET") {
    header["content-type"] = "application/json"
  }

  if (app.globalData.session) {
    header["authorization"] = `Bearer ${app.globalData.session}`
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