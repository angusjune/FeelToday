App({
  onLaunch () {
    let feelings = wx.getStorageSync('feelings') || []

    this.globalData.feelings = feelings
  },

  globalData: {
    feelings: null
  }
})
