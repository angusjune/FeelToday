const config = require('./config.js')

const MAX_LIMIT = 20

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
    dataPageCount: 0,
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
   * @param {String} openId 
   * @param {Number} page
   */
  getFeelings (openId, page) {
    if (page === undefined) { page = 0 }

    collection.where({
      _openid: openId, 
    })
    .skip(page * MAX_LIMIT)
    .limit(MAX_LIMIT)
    .get()
    .then((res) => {
      this.globalData.feelings = res.data || []

      if (this.feelingsReadyCallBack) {
        this.feelingsReadyCallBack(res)
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
    collection.add({
      data: {
        moodId: content.moodId,
        say: content.say,
        time: content.time,
      },
    })
    .then((res) => {
      console.log(res)
      if (typeof callback === 'function') {
        callback()
      }
    })
  },

  /**
   * 
   * @param {String} id 
   * @param {Object} data 
   */
  updateFeeling (id, data) {
    collection.doc(id).update({
      data: data,
    })
    .then((res) => {
      console.log(res)
    })
  }

})
