const util = require('../../utils/util.js')
const draw = require('../../utils/draw.js')
const animate = require('../../utils/animate.js')

const app = getApp()

const GAP = 86

var currentFaceParam = {
  lipTopY: 0.58,
  lipTopCp1X: 0.385,
  lipLeftX: 0.379,
  lipLeftY: 0.58,
  lipLeftCp1X: 0.397,
  lipLeftCp1Y: 0.58,
  lipLeftCp2X: 0.436,
  lipLeftCp2Y: 0.58,
  lipBottomY: 0.58,
  lipBottomCp1X: 0.385
}

Page({
  data: {
    isAnimating: false,
    moodName: 'calm',
    moodId: 3,
    showActions: true,
    showText: false,
    showHistory: false,
    sayText: '',
    sayTextSub: '',
  },

  onLoad() {
    this.drawFace(currentFaceParam)
    this.setData({
      feelings: app.globalData.feelings
    })
  },

  onShow() {
    let title = util.formatTime(new Date(Date.now() - 4 * 60 * 60 * 1000))
    wx.setNavigationBarTitle({ title: title })
  },


  drawFace(param) {
    // let canvasSize = draw.makeSize(240, 240)

    // let topY = param.topY,
    //     topCpLeftX = param.topCpLeftX,
    //     leftPoint = param.leftPoint,
    //     leftCpLeftPoint  = param.leftCpLeftPoint,
    //     leftCpRightPoint = param.leftCpRightPoint,
    //     bottomY = param.bottomY,
    //     bottomCpLeftX = param.bottomCpLeftX
    //
    // draw.face('mainCanvas', canvasSize, topY, topCpLeftX, leftPoint, leftCpLeftPoint, leftCpRightPoint, bottomY, bottomCpLeftX);

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

  setFaceParam(faceParam) {
    currentFaceParam = faceParam
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

  drawEcstasy() {

    let endParam = {
      lipTopY: 0.558,
      lipTopCp1X: 0.32,
      lipLeftX: 0.229,
      lipLeftY: 0.559,
      lipLeftCp1X: 0.209,
      lipLeftCp1Y: 0.711,
      lipLeftCp2X: 0.351,
      lipLeftCp2Y: 0.559,
      lipBottomY: 0.836,
      lipBottomCp1X: 0.288
    }

    this.animateFace(endParam, 10, 10, this.setFaceParam)
    this.setData({
      moodName: 'ecstasy',
      moodId: 0,
    })
  },

  drawHappy() {
    // console.info('Feeling Happy.')

    let endParam = {
      lipTopY: 0.71,
      lipTopCp1X: 0.385,
      lipLeftX: 0.284,
      lipLeftY: 0.584,
      lipLeftCp1X: 0.3,
      lipLeftCp1Y: 0.634,
      lipLeftCp2X: 0.3,
      lipLeftCp2Y: 0.634,
      lipBottomY: 0.71,
      lipBottomCp1X: 0.385
    }

    this.animateFace(endParam, 10, 10, this.setFaceParam)
    this.setData({
      moodName: 'happy',
      moodId: 1,
    })
  },

  drawPleased() {
    // console.info('Feeling Pleased.')

    let endParam = {
      lipTopY: 0.626,
      lipTopCp1X: 0.385,
      lipLeftX: 0.29,
      lipLeftY: 0.6,
      lipLeftCp1X: 0.37,
      lipLeftCp1Y: 0.7,
      lipLeftCp2X: 0.37,
      lipLeftCp2Y: 0.7,
      lipBottomY: 0.626,
      lipBottomCp1X: 0.385
    }

    this.animateFace(endParam, 10, 10, this.setFaceParam)
    this.setData({
      moodName: 'pleased',
      moodId: 2,
    })
  },

  drawCalm() {
    // console.info('Feeling Calm.')

    let endParam = {
      lipTopY: 0.58,
      lipTopCp1X: 0.385,
      lipLeftX: 0.379,
      lipLeftY: 0.58,
      lipLeftCp1X: 0.397,
      lipLeftCp1Y: 0.58,
      lipLeftCp2X: 0.436,
      lipLeftCp2Y: 0.58,
      lipBottomY: 0.58,
      lipBottomCp1X: 0.385
    }

    this.animateFace(endParam, 10, 10, this.setFaceParam)
    this.setData({
      moodName: 'calm',
      moodId: 3,
    })
  },

  drawUpset() {
    // console.info('Feeling Upset.')

    let endParam = {
      lipTopY: 0.5,
      lipTopCp1X: 0.415,
      lipLeftX: 0.35,
      lipLeftY: 0.65,
      lipLeftCp1X: 0.35,
      lipLeftCp1Y: 0.565,
      lipLeftCp2X: 0.35,
      lipLeftCp2Y: 0.565,
      lipBottomY: 0.5,
      lipBottomCp1X: 0.415
    }

    this.animateFace(endParam, 10, 10, this.setFaceParam)
    this.setData({
      moodName: 'upset',
      moodId: 4,
    })
  },

  drawOops() {
    // console.info('Feeling Oops.')

    let endParam = {
      lipTopY: 0.5,
      lipTopCp1X: 0.373,
      lipLeftX: 0.374,
      lipLeftY: 0.65,
      lipLeftCp1X: 0.391,
      lipLeftCp1Y: 0.786,
      lipLeftCp2X: 0.364,
      lipLeftCp2Y: 0.585,
      lipBottomY: 0.75,
      lipBottomCp1X: 0.415
    }

    this.animateFace(endParam, 10, 10, this.setFaceParam)
    this.setData({
      moodName: 'oops',
      moodId: 5,
    })
  },

  drawUgh() {
    // console.info('Feeling Ugh.')

    let endParam = {
      lipTopY: 0.617,
      lipTopCp1X: 0.373,
      lipLeftX: 0.264,
      lipLeftY: 0.637,
      lipLeftCp1X: 0.268,
      lipLeftCp1Y: 0.864,
      lipLeftCp2X: 0.265,
      lipLeftCp2Y: 0.546,
      lipBottomY: 0.714,
      lipBottomCp1X: 0.415
    }

    this.animateFace(endParam, 10, 10, this.setFaceParam)
    this.setData({
      moodName: 'ugh',
      moodId: 6,
    })
  },

  touchStartFace(e) {
    // this.touchMoveFace(e)
  },

  touchMoveFace(e) {

    if (this.data.showHistory) {
      this.setData({
        showHistory: false,
        showActions: true,
      })
    } else {
      let touchX = e.touches[0].clientX
      let touchY = e.touches[0].clientY

      if (util.isBetween(touchY, [0, GAP])) {
        this.drawEcstasy()
      } else if (util.isBetween(touchY, [GAP, GAP * 2])) {
        this.drawHappy()
      } else if (util.isBetween(touchY, [GAP * 2, GAP * 3])) {
        this.drawPleased()
      } else if (util.isBetween(touchY, [GAP * 3, GAP * 4])) {
        this.drawCalm()
      } else if (util.isBetween(touchY, [GAP * 4, GAP * 5])) {
        this.drawUpset()
      } else if (util.isBetween(touchY, [GAP * 5, GAP * 6])) {
        this.drawOops()
      } else if (util.isBetween(touchY, [GAP * 6, GAP * 7])) {
        this.drawUgh()
      }

      this.setData({
        showActions: false,
      })
    }
  },

  touchEndFace(e) {
    this.setData({
      showActions: true,
    })
  },

  tapFace(e) {
    this.touchMoveFace(e)
    this.setData({
      showActions: true,
    })
  },

  tapConfirmMood () {

  },

  tapAddText() {
    this.setData({
      showSay: true,
    })
  },

  confirmSayText (e) {
    let val = e.detail.value

    this.setData({
      showSay: false,
      showActions: true,
      sayText: val,
      sayTextSub: val != '' ? val.substr(0, 15) + '...' : ''
    })
  },

  tapShowHistory () {
    this.setData({
      showHistory: !this.data.showHistory,
      showActions: this.data.showHistory,
    })
  },

  saveMoodToStorage(mood) {
    let time = Date.now()

    let feelings = this.data.feelings
    let newFeel  = {
      id: this.data.moodId,
      say: this.data.sayText,
      time: time,
    }


  },

  animateMood() {

  },



})
