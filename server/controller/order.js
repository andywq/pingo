const Router = require("@koa/router")
const { Order, OrderPromiseActions } = require("../model/order")
const { genJwtToken } = require("../lib/jwt")
const config = require("../lib/config")
const UUID = require("uuid")

const OrderRouter = new Router()

// create order

OrderRouter.post("/", async (ctx) => {
  try {
    const fontArgs = ctx.request.body
    const fontProducts = fontArgs.products || []
    console.log(ctx.request.body)
    const args = {
      title: fontArgs.title,
      status: "open",
      creator: ctx.user,
      products: fontProducts.map((p) => ({
        // id: UUID.v4(),
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

OrderRouter.get("/", async (ctx) => {
  try {
    let order = await Order.find({}).exec()
    ctx.body = {
      order,
    }
  } catch (err) {
    console.error(err)
    ctx.status = 500
    ctx.body = err
  }
})

OrderRouter.get("/:id", async (ctx) => {
  try {
    console.log("===order id===" + ctx.params.id)
    // console.log("===product id===" + ctx.request.products.id)
    let order = await Order.findOne({
      _id: ctx.params.id,
    }).exec()

    if (!!order) {
      ctx.body = {
        order,
      }
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

OrderRouter.post("/:id/close", async (ctx) => {
  try {
    console.log("===order id===" + ctx.params.id)
    let query = { _id: ctx.params.id }
    let update = { status: "closed" }
    let option = { multi: true }

    let order = await Order.findOne(query).exec()
    if (!!order) {
      console.log("==== Order exist====")
      await updatePromise(query, update, option).then(() => {
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
      await updatePromise(query, update, option).then(() => {
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
OrderRouter.post("/:orderId/product/:productId", async (ctx) => {
  try {
    const { orderId, productId } = ctx.params
    console.log("===order id===" + orderId)
    console.log("===product id===" + productId)
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
      await updatePromise(query, update, option).then(() => {
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
OrderRouter.patch("/:orderId/product/:productId/my_number/:myNumber", async (ctx) => {
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

    await updatePromise(Order, query, update, arrayFilter).then(() => {
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
OrderRouter.patch("/:orderId/product/:productId", async (ctx) => {
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

    await updatePromise(query, update, arrayFilter).then(() => {
      ctx.status = 200
    })
    return
  } catch (err) {
    console.error(err)
    ctx.status = 500
    ctx.body = err
  }
})

async function updatePromise(query, update, option) {
  return new Promise((res, rej) => {
    Order.update(query, update, option, function (err, resp) {
      if (err) {
        console.log("Err==" + err)
        rej(err)
      } else {
        console.log("Res==" + resp)
        res(resp)
      }
    })
  })
}

module.exports = OrderRouter
