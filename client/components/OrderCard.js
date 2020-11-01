const {
  formatTime
} = require("../utils/util")

// components/OrderCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    index: {
      type: Number,
      value: true
    },
    data: {
      type: Object,
      value: {}
    },
    type: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    createdAt: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },

  observers: {
    "data.created_at": function (v) {
      this.setData({
        createdAt: formatTime(v)
      })
    }
  }
})