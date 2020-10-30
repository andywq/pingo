const mongoose = require("mongoose")
const { Schema } = mongoose

const orderSchema = new Schema({
  title: String,
  status: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  creator: {
    id: String,
    name: String,
    avatar: String,
  },
  products: [
    {
      name: String,
      desc: String,
      unit_price: Number,
      select_mode: String,
      members: [
        {
          userid: String,
          name: String,
          number: Number,
          avatar: String,
        },
      ],
    },
  ],
})

// 用户 Model
exports.Order = mongoose.model("Order", orderSchema)

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
