const util = require('../../utils/util.js')
const draw = require('../../utils/draw.js')
const animate = require('../../utils/animate.js')
const moods = require('./moods.js')

const app = getApp()

// const DATE_OFFSET = - 2 * 60 * 60 * 1000 // Reset data at 2am
const DATE_OFFSET = 24 * 60 * 60 * 1000 - 50 // Reset date every 50ms, debug only
const CANVAS_SIZE = draw.makeSize(120, 120)
const MOODS = moods.moods
const GAP  = Math.floor(603/MOODS.length) // Magic number 603

var currentFaceParam = MOODS[3].param

Page({
  data: {
    isAnimating: false,
    feelings: [],
    moodName: 'calm',
    moodId: 3,
    showActions: true,
    showHistory: false,
    sayText: '',
    sayTextTrimmed: '', // sayText after substr
    animationData: {},
    charCount: 0, // how many characters are in "say" now?

  },

  onLoad() {
    this.drawFace(currentFaceParam)
    this.drawMood(3) // Default mood Id is 3

    let animation = wx.createAnimation()
    let imgAnimation = wx.createAnimation()

    this.animation = animation
    this.imgAnimation = imgAnimation


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

  },

  onShow() {
    let menuRect = wx.getMenuButtonBoundingClientRect()
    console.log(menuRect)

    if (app.globalData.feelings.length > 0) {
      this.setData({
        feelings: app.globalData.feelings.reverse(), // From new to old
      })

      this.getCurrentFeeling(app.globalData.feelings, (res) => {
        if (res != {}) {
          // If feelings data exists
          this.setData({
            moodName: MOODS[res.mood].name,
            moodId: res.mood,
            sayText: res.say,
            sayTextTrimmed: util.subText(res.say),
          })
          this.drawMood(res.mood)
        }
      })
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

    draw.face('mainCanvas', canvasSize, lipTopY, lipTopCp1X, lipLeftX, lipLeftY, lipLeftCp1X, lipLeftCp1Y, lipLeftCp2X, lipLeftCp2Y, lipBottomY, lipBottomCp1X)
  },

  animateFace (endParam, segment, time, func) {

    let handle = func ? func : () => {}

    let that = this
    let startParam = currentFaceParam

    if (JSON.stringify(startParam) == JSON.stringify(endParam)) return

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
        lipBottomCp1X = startParam.lipBottomCp1X

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
          }

          this.drawFace(param)
          handle(param)

          if (counter > 0) loop()
          else that.setData({ isAnimating: false })

       }, interval)
    }
    loop()
  },

  drawMood(moodId) {
    let endParam = MOODS[moodId].param
    this.animateFace(endParam, 10, 10, this.setFaceParam)
    this.setData({
      moodName: MOODS[moodId].name,
      moodId: moodId,
    })
  },

  uiChange(e) {
    if (this.data.showHistory) {
      this.setData({
        showHistory: false,
        showActions: true,
      })
    } else {
      let touchY = e.touches[0].clientY

      this.setData({
        showActions: false,
      })

      for (let i = 0; i < MOODS.length; i++) {
        if (util.isBetween(touchY, [i * GAP, (i + 1) * GAP])) {
          this.drawMood(i)
          return
        }
      }
    }
  },


  onTouchMoveFace(e) {
    this.uiChange(e)
  },

  onTouchEndFace(e) {
    this.setData({
      showActions: true,
    })
  },

  onTapFace(e) {
    this.uiChange(e)
    this.setData({
      showActions: true,
    })
  },

  onTapConfirmMood () {
    this.saveFeelingToStorage()
    this.animateMood()
  },


  onTapShowSay() {
    this.setData({
      showSay: true,
    })
    draw.clear('mainCanvas', CANVAS_SIZE)
  },

  // On textarea change
  onSayInput(e) {
    let val = e.detail.value

  },

  // Submitting "Got something to say"
  onSubmitSay (e) {
    let val = e.detail.value.textarea

    this.setData({
      showSay: false,
      showActions: true,
      sayText: val,
      sayTextTrimmed: util.subText(val)
    })
    this.drawFace(currentFaceParam)
  },

  // Show history mood list
  onTapShowHistory() {
    this.setData({
      showHistory: !this.data.showHistory,
      showActions: this.data.showHistory,
    })
  },

  // Save today's feeling to localStorage
  saveFeelingToStorage() {
    let time = Date.now()

    let feelings = this.data.feelings.reverse() // From old to new
    let newFeeling  = {
      mood: this.data.moodId,
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

    if (!isFeelingExist) {
      feelings.push(newFeeling)
    }

    wx.setStorage({
      key: 'feelings',
      data: feelings,
      success: (res) => {
        console.log('Feeling stored: ', res)
        this.setData({ feelings: feelings.reverse() })
      },
      fail: (err) => {
        console.error('Handle rejected promise here: ', err)
      }
    })
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


  animateMood() {
    this.animation.opacity(1).width('120rpx').height('120rpx').left('315rpx').top('543rpx').step({duration: 600, timingFunction: 'ease'})
    this.animation.left('60rpx').top('1026rpx').step({duration: 650, delay: 50, timingFunction: 'ease'})
    this.animation.opacity(0).step({duration: 200, delay: 700})

    this.imgAnimation.width('100rpx').height('100rpx').step({duration: 600, timingFunction: 'ease'})

    this.setData({
      animationData: this.animation.export(),
      imgAnimation: this.imgAnimation.export()
    })

    setTimeout(() => {
      this.setData({
        showHistory: true,
        showActions: false,
      })
    }, 600)

    setTimeout(() => {

    }, 3000)
  },





})
