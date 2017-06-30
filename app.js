App({
  onLaunch () {
    let feelings = wx.getStorageSync('feelings') || []
  },

  globalData: {
    feelings: null
  }
})
