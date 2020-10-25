// components/ProductCard.js
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
      let number = 0
      for (const m of d.members) {
        number += m.number
      }
      number = parseFloat(number.toFixed(4))

      this.setData({
        "totalNumber": number,
        "totalPrice": parseFloat((number * d.unit_price).toFixed(4))
      })
    }
  }
})
