// const apiEndpoint = "https://api.pingo.alexyan.cc/api/wechat";
const apiEndpoint = "http://127.0.0.1:8080/api/wechat"

exports.fetch = async function (method, url, data) {
  const app = getApp();
  if (method !== "POST" || url !== "/session/") {
    await app.globalData.loginPromise
  }

  const header = {};
  if (method != "GET") {
    header["Content-Type"] = "application/json";
  }

  if (app.globalData.accessToken) {
    header["Authorization"] = `Bearer ${app.globalData.accessToken}`;
  }

  return new Promise((res, rej) => {
    wx.request({
      method,
      header,
      url: `${apiEndpoint}${url}`,
      data,
      success: (r) => {
        if (r.statusCode >= 400) {
          rej(r.data);
          return;
        }
        res(r.data);
      },
      fail: rej,
    });
  });
};