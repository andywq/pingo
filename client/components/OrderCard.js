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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    createdAt: "",
    totalPrice: 0,
    members: []
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
    },
    "data.products": function (v) {
      if (!v || v.length === 0) {
        return
      }
      let total = 0
      let membersMap = {}
      for (const p of v) {
        const ut = p.unit_price
        if (!p || !p.members) {
          continue
        }
        for (const m of p.members) {
          total += ut * m.number
          membersMap[m.id] = {
            avatar: m.avatar,
            name: m.name,
            id: m.id
          }
        }
      }
      this.setData({
        totalPrice: parseFloat(total.toFixed(4)),
        members: Object.keys(membersMap).map(k => membersMap[k])
      })
    }
  }
})