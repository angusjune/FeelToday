App({
  onLaunch () {
    require('./sdk-v1.1.1')
    let feelings = wx.getStorageSync('feelings') || []

    this.globalData.feelings = feelings
  },

  globalData: {
    feelings: null
  }
})
