const Router = require("@koa/router")
const { Order, OrderPromiseActions } = require("../model/order")
const { genJwtToken } = require("../lib/jwt")
const config = require("../lib/config")
const UUID = require("uuid")

const OrderRouter = new Router()

// 创建订单
OrderRouter.post("/", async (ctx) => {
  try {
    const fontArgs = ctx.request.body
    const fontProducts = fontArgs.products || []
    console.log(ctx.request.body)
    const args = {
      title: fontArgs.title,
      status: "open",
      creator: ctx.user,
      members: [ctx.user],
      products: fontProducts.map((p) => ({
        ...p,
      })),
    }

    const newOrder = new Order(args)
    user = await newOrder.save()

    ctx.body = "Order Created Successfully"
  } catch (err) {
    console.error(err)
    ctx.status = 500
    ctx.body = err
    return
  }
})

// 获取用户加入的订单列表
OrderRouter.get("/", async (ctx) => {
  try {
    // TODO 分页，只能看到member自己的订单
    let orders = await Order.find({}).exec()
    ctx.body = orders
  } catch (err) {
    console.error(err)
    ctx.status = 500
    ctx.body = err
  }
})

// 获取订单详情
OrderRouter.get("/:id", async (ctx) => {
  try {
    let order = await Order.findOne({
      _id: ctx.params.id,
    }).exec()

    if (!!order) {
      ctx.body = order
      return
    } else {
      ctx.body = "Not found"
    }
  } catch (err) {
    console.error(err)
    ctx.status = 500
    ctx.body = err
  }
})

// 关闭订单
OrderRouter.post("/:id/close", async (ctx) => {
  try {
    console.log("===order id===" + ctx.params.id)
    let query = { _id: ctx.params.id }
    let update = { status: "closed" }
    let option = { multi: true }

    let order = await Order.findOne(query).exec()
    if (!!order) {
      console.log("==== Order exist====")
      await OrderPromiseActions.update(query, update, option).then(() => {
        ctx.status = 200
      })
      return
    } else {
      console.log("==== in else====")
      ctx.body = "Not found"
    }
  } catch (err) {
    console.error(err)
    ctx.status = 500
    ctx.body = err
  }
})

// 删除商品
OrderRouter.delete("/:orderId/product/:productId", async (ctx) => {
  try {
    const { orderId, productId } = ctx.params
    console.log("===order id===" + orderId)
    console.log("===product id===" + productId)

    const query = { _id: orderId }
    const option = { multi: true }
    const order = await Order.findOne(query).exec()
    if (!!order) {
      console.log("==== Order exist====")
      order.products = order.products.filter((p) => p._id != productId)
      let update = { products: order.products }
      await OrderPromiseActions.update(query, update, option).then(() => {
        ctx.status = 200
      })
      return
    } else {
      ctx.body = "Order Not found"
    }
  } catch (err) {
    console.error(err)
    ctx.status = 500
    ctx.body = err
  }
})

// 新增商品信息
OrderRouter.post("/:orderId/product", async (ctx) => {
  try {
    const { orderId } = ctx.params
    const query = { _id: orderId }
    const option = { multi: true }
    const order = await Order.findOne(query).exec()

    const newProduct = {
      name: ctx.request.body.name,
      desc: ctx.request.body.desc,
      unit_price: ctx.request.body.unit_price,
      select_mode: ctx.request.body.select_mode,
    }
    updatedProduct = order.products
    updatedProduct.push(newProduct)
    console.log("=2==" + updatedProduct)
    const update = { products: updatedProduct }
    console.log("=3==" + update.products)
    if (!!order) {
      console.log("==== Order exist====")
      await OrderPromiseActions.update(query, update, option).then(() => {
        ctx.status = 200
      })
      return
    } else {
      ctx.body = "Order Not found"
    }
  } catch (err) {
    console.error(err)
    ctx.status = 500
    ctx.body = err
  }
})

/**
 * 更新我的商品选购数量
 * @param {string} orderId
 * @param {string} productId
 * @param {number} myNumber
 */
OrderRouter.put("/:orderId/product/:productId/my_number/:myNumber", async (ctx) => {
  const { orderId, productId, myNumber } = ctx.params
  console.log("===order id===" + orderId)
  console.log("===product id===" + productId)
  console.log("===myNumber===" + myNumber)
  const { userId } = ctx.user
  try {
    const query = {
      _id: orderId,
    }
    const update = {
      $set: {
        "products.$[product].members.$[mem].number": myNumber,
      },
    }

    const arrayFilter = {
      arrayFilters: [{ "product._id": productId }, { "mem.userId": userId }],
      multi: true,
    }

    await OrderPromiseActions.update(query, update, arrayFilter).then(() => {
      ctx.status = 200
    })
    return
  } catch (err) {
    console.error(err)
    ctx.status = 500
    ctx.body = err
  }
})

// 更新商品信息
OrderRouter.put("/:orderId/product/:productId", async (ctx) => {
  try {
    const { orderId, productId } = ctx.params
    const { userId } = ctx.user
    console.log("===order id===" + orderId)
    console.log("===product id===" + productId)
    const query = { _id: orderId }
    const update = {
      $set: {
        "products.$[pro].name": ctx.request.body.name,
        "products.$[pro].desc": ctx.request.body.desc,
        "products.$[pro].unit_price": ctx.request.body.unit_price,
        "products.$[pro].select_mode": ctx.request.body.select_mode,
      },
    }
    const arrayFilter = {
      arrayFilters: [{ "pro._id": productId }],
      multi: true,
    }

    await OrderPromiseActions.update(query, update, arrayFilter).then(() => {
      ctx.status = 200
    })
    return
  } catch (err) {
    console.error(err)
    ctx.status = 500
    ctx.body = err
  }
})

module.exports = OrderRouter
