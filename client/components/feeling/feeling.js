const util = require('../../utils/util.js')


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    feeling: {
      type: Object,
    },

    isFlipped: {
      type: Boolean,
      value: false,
    }
  },

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的初始数据
   */
  data: {
    isFlipped: false,
  },

  lifetimes: {
    ready () {
      let timestamp = this.data.feeling.time
      // Set time to human language
      this.setData({
        dateFormatted: util.formatTime(new Date(timestamp))
      })
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
  }
})
