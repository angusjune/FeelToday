// components/feeling.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    feeling: Object,

  },

  /**
   * 组件的初始数据
   */
  data: {
    isFlipped: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapFeeling (e) {
      this.setData({
        isFlipped: !this.data.isFlipped
      })
    },
  }
})
