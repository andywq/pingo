/**
 * 休眠指定时长
 * @param {number} sec 秒
 * @returns {Promise<void>}
 */
exports.sleep = function (sec) {
  return new Promise((res) => {
    setTimeout(res, sec * 1000);
  });
};
