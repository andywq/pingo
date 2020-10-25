const mongoose = require("mongoose")

/**
 * 初始化数据库
 * @param {string} host
 * @param {number} port
 * @param {string} dbName
 * @param {string} user
 * @param {string} pwd
 */
exports.setup = async function (host, port, dbName, user, pass) {
  let connectOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }

  if (!!pass) {
    connectOpts = {
      user,
      pass,
      ...connectOpts,
    }
  }

  mongoose.connect(`mongodb://${host}:${port}/${dbName}`, connectOpts)

  return new Promise((res, rej) => {
    mongoose.connection.on("error", (err) => {
      console.error("数据库连接失败")
      rej(err)
    })
    mongoose.connection.on("open", () => {
      console.error("数据库连接成功")
      res()
    })
  })
}
