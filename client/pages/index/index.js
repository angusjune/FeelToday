const util = require('../../utils/util.js')
const draw = require('../../utils/draw.js')
const animate = require('../../utils/animate.js')
const moods = require('./moods.js')

const app = getApp()

// const DATE_OFFSET = - 2 * 60 * 60 * 1000 // Reset data at 2am
const DATE_OFFSET = 24 * 60 * 60 * 1000 - 50 // Reset date every 50ms for debugging purpose
const CANVAS_SIZE = draw.makeSize(120, 120)
const MOODS = moods.moods
const GAP  = Math.floor(603/MOODS.length) // Magic number 603, should be changed to device height?

const SAY__MAX = 84 // The max length of "say"

var currentFaceParam = MOODS[3].param

Page({
  data: {
    isAnimating: false,
    feelings: [],
    moodId: 3,
    showActions: true,
    showHistory: false,
    isHistoryFlipped: false, // Is there any history card been flipped?
    historyScrollTop: 0,
    sayText: '',
    sayTextTrimmed: '', // sayText after substr
    sayMaxLength: SAY__MAX,
    charCount: 0, // How many characters are there in "say" now?
  },

  onLoad(query) {
    this.drawFace(currentFaceParam)
    this.drawMood(3) // Default mood Id is 3

    let animation = wx.createAnimation()
    let imgAnimation = wx.createAnimation()

    this.animation = animation
    this.imgAnimation = imgAnimation

    let that = this
    wx.getSystemInfo ({
      success: (res) => {
        // Treating iPhone X specially
        let model = res.model.indexOf('iPhone X') > -1 ? 'iPhone X' : res.model
        that.setData ({ model: model })
      }
    })

    // Set date
    let date = util.formatTime(new Date(Date.now() + DATE_OFFSET))
    // Get pill menu position to determine date position
    let menuRect = wx.getMenuButtonBoundingClientRect()

    this.setData({
      dateText: date,
      dateStyle: {
        top: menuRect.top,
        height: menuRect.height
      }
    })

    this.setFeelingsData()
  },
  
  onShareAppMessage() {
    let that = this
    return {
      title: 'I am feeling:',
      path: `/pages/index/index?moodId=${that.moodId}&sayText=${that.sayText}&isShare=true`
    }
  },

  // Load feelings from cloud and set feeling data
  setFeelingsData() {
    let that = this
    // Set history feelings
    app.feelingsReadyCallBack = () => {
      console.log('feelings data set')

      if (app.globalData.feelings.length > 0) {
        that.setData({
          feelings: app.globalData.feelings.reverse(), // From new to old
        })

        that.getCurrentFeeling(app.globalData.feelings, (res) => {
          if (res != {}) {
            // If feelings data exists
            that.setData({
              moodId: res.moodId,
              sayText: res.say,
              sayTextTrimmed: util.subText(res.say),
            })
            that.drawMood(res.moodId)
          }
        })
      }
    }
  },


  setFaceParam(faceParam) {
    currentFaceParam = faceParam
  },

  drawFace(param) {
    let canvasSize = draw.makeSize(120, 120)

    let lipTopY = param.lipTopY,
        lipTopCp1X = param.lipTopCp1X,
        lipLeftX = param.lipLeftX,
        lipLeftY = param.lipLeftY,
        lipLeftCp1X = param.lipLeftCp1X,
        lipLeftCp1Y = param.lipLeftCp1Y,
        lipLeftCp2X = param.lipLeftCp2X,
        lipLeftCp2Y = param.lipLeftCp2Y,
        lipBottomY = param.lipBottomY,
        lipBottomCp1X = param.lipBottomCp1X
        color = param.color === undefined ? 'rgba(255, 255, 255, 1)' : param.color

    draw.face('mainCanvas', canvasSize, lipTopY, lipTopCp1X, lipLeftX, lipLeftY, lipLeftCp1X, lipLeftCp1Y, lipLeftCp2X, lipLeftCp2Y, lipBottomY, lipBottomCp1X, color)
  },


  /**
   * @description Animates the process between the former and the later face
   * @param {Object} endParam 需要变为的脸的最终参数
   * @param {number} [segment] 需要分几段去完成这个变化，数值越大，变化过程越流畅
   * @param {number} [time] 每段之间的间隔时间，单位为毫秒，数值越小，变化越快
   * @param {Function} [func] 每次变化后的回调
   * @param {Object} [colorParam] 脸的透明度值参数
   * @param {number} colorParam.start 0-1 之间取值
   * @param {number} colorParam.end
   */
  animateFace (endParam, segment, time, func, colorParam) {
    if (colorParam === undefined) {
      colorParam = {
        start: 1,
        end: 1,
      }
    }

    let handle = func ? func : () => {}

    let that = this
    let startParam = currentFaceParam

    if (JSON.stringify(startParam) == JSON.stringify(endParam) && colorParam.start === colorParam.end) return

    if (this.data.isAnimating) return
    else this.setData({isAnimating: true})


    let diviedInto = segment ? segment : 5
    let interval   = time ? time : 100

    let lipTopY = startParam.lipTopY,
        lipTopCp1X = startParam.lipTopCp1X,
        lipLeftX = startParam.lipLeftX,
        lipLeftY = startParam.lipLeftY,
        lipLeftCp1X = startParam.lipLeftCp1X,
        lipLeftCp1Y = startParam.lipLeftCp1Y,
        lipLeftCp2X = startParam.lipLeftCp2X,
        lipLeftCp2Y = startParam.lipLeftCp2Y,
        lipBottomY = startParam.lipBottomY,
        lipBottomCp1X = startParam.lipBottomCp1X,
        colorAlpha = colorParam.start

    animate.number({
      start: startParam.lipTopY,
      end: endParam.lipTopY,
      diviedInto: diviedInto,
      interval: interval,
      callback: (number) => { lipTopY = number }
    })

    animate.number({
      start: startParam.lipTopCp1X,
      end: endParam.lipTopCp1X,
      diviedInto: diviedInto,
      interval: interval,
      callback: (number) => { lipTopCp1X = number }
    })

    animate.number({
      start: startParam.lipLeftX,
      end: endParam.lipLeftX,
      diviedInto: diviedInto,
      interval: interval,
      callback: (number) => { lipLeftX = number }
    })

    animate.number({
      start: startParam.lipLeftY,
      end: endParam.lipLeftY,
      diviedInto: diviedInto,
      interval: interval,
      callback: (number) => { lipLeftY = number }
    })

    animate.number({
      start: startParam.lipLeftCp1X,
      end: endParam.lipLeftCp1X,
      diviedInto: diviedInto,
      interval: interval,
      callback: (number) => { lipLeftCp1X = number }
    })

    animate.number({
      start: startParam.lipLeftCp1Y,
      end: endParam.lipLeftCp1Y,
      diviedInto: diviedInto,
      interval: interval,
      callback: (number) => { lipLeftCp1Y = number }
    })

    animate.number({
      start: startParam.lipLeftCp2X,
      end: endParam.lipLeftCp2X,
      diviedInto: diviedInto,
      interval: interval,
      callback: (number) => { lipLeftCp2X = number }
    })

    animate.number({
      start: startParam.lipLeftCp2Y,
      end: endParam.lipLeftCp2Y,
      diviedInto: diviedInto,
      interval: interval,
      callback: (number) => { lipLeftCp2Y = number }
    })

    animate.number({
      start: startParam.lipBottomY,
      end: endParam.lipBottomY,
      diviedInto: diviedInto,
      interval: interval,
      callback: (number) => { lipBottomY = number }
    })

    animate.number({
      start: startParam.lipBottomCp1X,
      end: endParam.lipBottomCp1X,
      diviedInto: diviedInto,
      interval: interval,
      callback: (number) => { lipBottomCp1X = number }
    })

    // Animating color alpha
    animate.number({
      start: colorParam.start,
      end: colorParam.end,
      diviedInto: diviedInto,
      interval: interval,
      callback: (number) => { colorAlpha = number }
    })

    let counter = diviedInto
    let loop = () => {
      setTimeout(() => {
          counter--

          let param = {
            lipTopY: lipTopY,
            lipTopCp1X: lipTopCp1X,
            lipLeftX: lipLeftX,
            lipLeftY: lipLeftY,
            lipLeftCp1X: lipLeftCp1X,
            lipLeftCp1Y: lipLeftCp1Y,
            lipLeftCp2X: lipLeftCp2X,
            lipLeftCp2Y: lipLeftCp2Y,
            lipBottomY: lipBottomY,
            lipBottomCp1X: lipBottomCp1X,
            color: 'rgba(255, 255, 255, ' + colorAlpha + ')',
          }

          this.drawFace(param)
          handle(param)

          if (counter > 0) loop()
          else that.setData({ isAnimating: false })

       }, interval)
    }
    loop()
  },

  // The diffrence between drawFace() and drawMood() is that the latter also animates the background color
  drawMood(moodId) {
    let endParam = MOODS[moodId].param
    this.animateFace(endParam, 10, 10, this.setFaceParam)
    this.setData({ moodId: moodId })
  },

  showFace() {
    this.animateFace(currentFaceParam, 10, 10,this.setFaceParam, {start: 0, end: 1})
  },

  hideFace() {
    this.animateFace(currentFaceParam, 10, 10,this.setFaceParam, {start: 1, end: 0})
  },

  showActions() {
    this.setData({ showActions: true })
  },

  hideActions() {
    this.setData({ showActions: false })
  },

  showMask() {
    this.setData({ showMask: true })
  },

  hideMask() {
    this.setData({ showMask: false })
  },

  showSay() {
    this.setData({ showSay: true, })
    this.hideFace()
    this.hideActions()
  },

  hideSay() {
    this.setData({ showSay: false, })
    this.showFace()
    this.showActions()
  },

  showHistory() {
    this.setData({ showHistory: true })
    this.showMask()
    this.hideFace()
    this.hideActions()
  },

  hideHistory() {
    this.setData({ showHistory: false })
    this.hideMask()

    //@TODO setTimeout() is not a flexible solution
    setTimeout(()=>{
      this.showFace()
      this.showActions()
    }, 300)
  },

  faceChange(e) {
    this.hideActions()

    let touchY = e.touches[0].clientY
    for (let i = 0; i < MOODS.length; i++) {
      if (util.isBetween(touchY, [i * GAP, (i + 1) * GAP])) {
        this.drawMood(i)
        return
      }
    }
  },

  animateMoodSave() {
    this.animation.opacity(1).step({duration: 50})
    this.animation.translateY(500).rotate(20).step({duration: 850, delay: 300,  timingFunction: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)'})

    this.animation.opacity(0).step()
    this.animation.rotate(0).translateY(0).step()

    this.setData({
      animationData: this.animation.export(),
    })
  },

  onTouchMoveFace(e) {
    this.faceChange(e)
  },

  onTouchEndFace(e) {
    this.showActions()
  },

  onTapFace(e) {
    this.faceChange(e)
    this.showActions()
  },

  onTapConfirmMood() {
    let that = this
    this.saveFeelingToStorage()
    this.hideFace()
    this.hideActions()
    this.animateMoodSave()

    //@TODO setTimeout() is not a flexible solution
    setTimeout(() => {
      that.showFace()
      that.showActions()
    }, 1600)
  },

  onTapShowSay() {
    this.showSay()
  },

  // On textarea change
  onSayInput(e) {
    let val = e.detail.value
    
    this.setData({
      charCount: val.length
    })
  },

  // Submitting "Got something to say"
  onSubmitSay(e) {
    let val = e.detail.value.textarea

    this.setData({
      sayText: val,
      sayTextTrimmed: util.subText(val)
    })
    
    this.hideSay()
  },

  onTapShowHistory() {
    this.showHistory()
  },

  onTapHideHistory() {
    this.hideHistory()
  },

  onHistoryScroll(e) {
    let scrollTop = e.detail.scrollTop
    this.setData({
      historyScrollTop: scrollTop
    })
  },

  onTapFeeling(e) {    
    let index = e.currentTarget.dataset.index
    let isCurrentlyFlipped = e.currentTarget.dataset.isflipped === undefined ? false : e.currentTarget.dataset.isflipped
    let styles = []

    let offsetLeft = e.currentTarget.offsetLeft
    let offsetTop = e.currentTarget.offsetTop

    // How far should the card move to get to the center
    let translateX = 124 - offsetLeft
    let translateY = 124 - offsetTop + this.data.historyScrollTop

    // Make other cards back to their places
    for (let i = 0; i < this.data.feelings.length; i++) {
      let item = {
        x: 0,
        y: 0,
        z: 0,
        isFlipped: false
      }
      styles[i] = item
    }

    // Flip the card you just tapped
    styles[index] = {
      x: isCurrentlyFlipped === true ? 0 : translateX,
      y: isCurrentlyFlipped === true ? 0 : translateY,
      z: 9999,
      isFlipped: !isCurrentlyFlipped
    }

    this.setData({
      feelingStyles: styles
    })
  },

  // Save today's feeling to localStorage
  saveFeelingToStorage() {
    let time = Date.now()

    let feelings = this.data.feelings.reverse() // From old to new
    let newFeeling  = {
      moodId: this.data.moodId,
      say: this.data.sayText,
      time: time,
    }

    let now = Date.now() + DATE_OFFSET
    let isFeelingExist = false

    feelings.forEach((feeling, index) => {
      if (now - feeling.time < 24 * 60 * 60 * 1000) {
        isFeelingExist = true
        let index = feelings.indexOf(feeling)
        feelings[index] = newFeeling // Replace it with the new feeling
      }
    })

    // Only add feeling if it is not recorded today
    if (!isFeelingExist) {
      app.addFeeling(newFeeling)
    }


  },


  getCurrentFeeling(feelings, callback) {
    let now = Date.now() + DATE_OFFSET

    feelings.forEach((feeling) => {
      if (now - feeling.time < 24 * 60 * 60 * 1000) {
        // Within 24 hours
        callback({
          mood: feeling.mood,
          time: feeling.time,
          say: feeling.say
        })
      }
    })
  },

})
