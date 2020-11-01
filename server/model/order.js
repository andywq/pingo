const mongoose = require("mongoose")
const { Schema } = mongoose

const memberSchema = {
  open_id: String,
  name: String,
  avatar: String,
}

const orderSchema = new Schema({
  title: String,
  status: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  creator: memberSchema,
  members: [memberSchema],
  products: [
    {
      name: String,
      desc: String,
      unit_price: Number,
      select_mode: String,
      members: [
        {
          ...memberSchema,
          number: Number,
        },
      ],
    },
  ],
})

// 用户 Model
const Order = mongoose.model("Order", orderSchema)

exports.Order = Order

exports.OrderPromiseActions = {
  update: function (query, update, option) {
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
  },
}
