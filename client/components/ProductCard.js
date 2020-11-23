// components/ProductCard.js
const regeneratorRuntime = require("../utils/runtime");
Component({
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

  data: {
    totalNumber: 0,
    totalPrice: 0
  },

  methods: {
  },

  observers: {
    "data": function(d) {
      if (!d || !d.members) {
        return
      }
      let totalNumber = 0
      for (const m of d.members) {
        totalNumber += m.buy_number
      }
      totalNumber = parseFloat(totalNumber.toFixed(4))

      this.setData({
        "totalNumber": totalNumber,
        "totalPrice": parseFloat((totalNumber * d.unit_price).toFixed(4))
      })
    }
  }
})
