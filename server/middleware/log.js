/**
 * HTTP 请求日志中间件
 * @param {*} ctx
 * @param {*} next
 */
module.exports = async (ctx, next) => {
  console.log(`${ctx.request.method} ${ctx.request.url} start`)
  const st = new Date().getTime()
  await next()
  const et = new Date().getTime()
  console.log(`${ctx.request.method} ${ctx.request.url} ${ctx.response.status} finish ${et - st}ms`)
}
