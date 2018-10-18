const config = require('./config.js')

// Initial cloud
wx.cloud.init({
  traceUser: true,
  env: config.cloudEnv,
})
const db = wx.cloud.database()
const collection = db.collection(config.dbCollection)

App({
  globalData: {
    feelings: [],
    openId: '',
  },

  onLaunch () {
    wx.cloud.callFunction({
      name: 'getUserInfo',
    })
    .then((res) => {
      this.globalData.openId = res.result.openId
      this.getFeelings(res.result.openId)
    })
    .catch(console.error)
  },

  /**
   * @description 在云开发数据库中获取指定用户的 feeling
   * @param {String} dbCollection
   * @param {String} openId 
   */
  getFeelings (openId) {
    collection.where({
      _openid: openId, 
    })
    .get({
      success: (res) => {
        this.globalData.feelings = res.data || []

        if (this.feelingsReadyCallBack) {
          this.feelingsReadyCallBack(res)
        }
      }
    })
  },

  /**
   * 
   * @param {Object} content 
   * @param {Number} content.moodId
   * @param {String} content.say
   * @param {Number} content.time
   * @param {Function} callback
   */
  addFeeling (content, callback) {
    console.log(callback)
    collection.add({
      data: {
        moodId: content.moodId,
        say: content.say,
        time: content.time,
      },
    })
    .then((res) => {
      console.log(res)
      callback()
    })
  },


})
