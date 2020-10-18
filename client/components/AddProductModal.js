// components/AddProductModal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isOpen: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    name: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClose() {
      this.triggerEvent("close")
    },
    handleSubmit() {
      this.triggerEvent("submit", this.data)
    }
  }
})
