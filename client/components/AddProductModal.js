// components/AddProductModal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isOpen: {
      type: Boolean,
      value: true
    },
    data: {
      type: Object,
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    product: {
      name: "", // 名称
      desc: "", // 描述
      unit_price: 0, // 单价
      select_mode: "int" // 选购模式，整数选购、小数选购 int || float 
    },
    consts: {
      selectModeNames: ["购买数量仅为整数", "购买数量可为小数"],
      selectModeKeys: ["int", "float"]
    },
    computed: {
      selectModeIndex: 0
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClose() {
      this.triggerEvent("close")
    },
    handleSubmit() {
      const p = this.data.product
      if (!p.name) {
        wx.showToast({
          title: "请填写商品名称",
          icon: "none"
        })
        return
      }

      this.triggerEvent("submit", this.data.product)
    },
    handleSelectModeChange(e) {
      const mode = this.data.consts.selectModeKeys[e.detail.value]
      this.setData({
        "product.select_mode": mode
      })
    },
    handleNameInput(e) {
      this.setData({
        "product.name": e.detail.value
      })
    },
    handleDescInput(e) {
      this.setData({
        "product.desc": e.detail.value
      })
    },
    handleUnitPriceInput(e) {
      let price = parseFloat(e.detail.value)
      if (isNaN(price)) {
        price = 0.0
      }
      this.setData({
        "product.unit_price": price
      })
    }
  },

  observers: {
    "product.select_mode": function(mode) {
      this.setData({
        "computed.selectModeIndex": this.data.consts.selectModeKeys.indexOf(mode)
      })
    },
    "data": function(data) {
      console.log(data)
      if (!!data) {
        this.setData({
          product: data
        })
      }
    }
  }
})
