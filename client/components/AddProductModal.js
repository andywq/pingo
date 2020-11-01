// components/AddProductModal.js

//获取应用实例
const app = getApp();

Component({

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
    },

    buy_number: 0
  },

  methods: {
    handleClose() {
      this.triggerEvent("close")
    },
    handleDelete() {
      this.triggerEvent("delete", this.data.product)
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

      this.triggerEvent("submit", {
        ...this.data.product,
        _my_number: this.data.buy_number
      })
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
    },
    handleMyNumberInput(e) {
      let n = parseFloat(e.detail.value)
      if (isNaN(n)) {
        n = 0
      }

      if (this.data.product.select_mode == "int") {
        n = parseInt(n + "", 10)
      }

      this.setData({
        "buy_number": n
      })
    },
  },

  observers: {
    "product.select_mode": function(mode) {
      this.setData({
        "computed.selectModeIndex": this.data.consts.selectModeKeys.indexOf(mode)
      })
    },
    "data": function(data) {
      if (!!data) {
        if (!!data.members) {
          const m = data.members.find(v => v.account.id == app.globalData.account.id)
          if (!!m) {
            this.setData({
              buy_number: m.buy_number
            })
          }
        }

        this.setData({
          product: data
        })
      }
    }
  }
})
