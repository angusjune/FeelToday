  const config = require('./config.js')

App({
  onLaunch () {
    // Initial cloud
    wx.cloud.init({
      traceUser: true,
      env: config.cloudEnv,
    })

    wx.cloud.callFunction({
      name: 'getUserInfo',
    })
    .then((res) => {
      this._getFeelings(config.dbCollection, res.result.openId) || []
      // this.globalData.feelings = feelings
    })
    .catch(console.error)

    // Get all the feelings of the user
    // let feelings = wx.getStorageSync('feelings') || []

    // this.globalData.feelings = feelings
  },

  /**
   * @description 在云开发数据库中获取指定用户的 feeling
   * @param {String} dbCollection
   * @param {String} openId 
   */
  _getFeelings (dbCollection, openId) {
    let db = wx.cloud.database()

    db.collection(dbCollection).where({
      _openid: openId,
    })
    .get({
      success: (res) => {
        this.globalData.feelings = res.result || []
      },
      complete: () => {
      }
    })
  },

  globalData: {
    feelings: []
  }
})
