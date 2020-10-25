const mongoose = require("mongoose")
const { Schema } = mongoose

// 定义字段
const userSchema = new Schema({
  open_id: String, // 微信 OpenID
  name: String,
  avatar: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
})

// 注册索引
userSchema.index({ open_id: 1 })

// 用户 Model
exports.User = mongoose.model("User", userSchema)
