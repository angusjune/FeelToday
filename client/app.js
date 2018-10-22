const config = require('./config.js')

const MAX_LIMIT = 24

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

      if (this.userInfoReadyCallBack) {
        this.userInfoReadyCallBack(res)
      }
    })
    .catch(console.error)
  },

  /**
   * @description 在云开发数据库中获取指定 openid 的 feeling
   * @param {String} openId 
   * @param {Number} [page]
   * @param {Function} [callback]
   */
  getFeelings (openId, page, callback) {
    if (page === undefined) { page = 0 }

    collection.where({
      _openid: openId, 
    })
    .skip(page * MAX_LIMIT)
    .limit(MAX_LIMIT)
    .get()
    .then((res) => {
      // this.globalData.feelings = res.data || []

      if (typeof callback === 'function') {
        callback(res)
      }
    })
  },

  /**
   * 
   * @param {Object} data 
   * @param {Number} data.moodId
   * @param {String} data.say
   * @param {Number} data.time
   * @param {Function} [callback]
   */
  addFeeling (data, callback) {
    collection.add({
      data: {
        moodId: data.moodId,
        say: data.say,
        time: data.time,
      },
    })
    .then((res) => {
      // console.log(res)
      if (typeof callback === 'function') {
        callback(res)
      }
    })
  },

  /**
   * 
   * @param {String} id 
   * @param {Object} data 
   * @param {Function} [callback]
   */
  updateFeeling (id, data, callback) {
    collection.doc(id).update({
      data: data,
    })
    .then((res) => {
      // console.log(res)
      if (typeof callback === 'function') {
        callback(res)
      }
    })
  }

})
