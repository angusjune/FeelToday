App({
  onLaunch () {
    require('./sdk-v1.1.0')
    let feelings = wx.getStorageSync('feelings') || []

    this.globalData.feelings = feelings
  },

  globalData: {
    feelings: null
  }
})
