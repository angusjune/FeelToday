const util = require('../../utils/util.js')
const draw = require('../../utils/draw.js')
const animate = require('../../utils/animate.js')

const app = getApp()

const GAP = 86

var currentFaceParam = {
  topY: 164,
  topCpLeftX: 47,
  leftPoint: draw.makePoint(44, 132),
  leftCpLeftPoint: draw.makePoint(74, 168),
  leftCpRightPoint: draw.makePoint(74, 168),
  bottomY: 164,
  bottomCpLeftX: 47
}

// var isAnimating = false

Page({
  data: {
    isAnimating: false,
    mood: 'calm',
  },

  onLoad() {
    // this.drawFace(currentFaceParam)
    this.drawCalm()
  },


  drawFace(param) {
    let canvasSize = draw.makeSize(240, 240)

    let topY = param.topY,
        topCpLeftX = param.topCpLeftX,
        leftPoint = param.leftPoint,
        leftCpLeftPoint  = param.leftCpLeftPoint,
        leftCpRightPoint = param.leftCpRightPoint,
        bottomY = param.bottomY,
        bottomCpLeftX = param.bottomCpLeftX

    draw.face('mainCanvas', canvasSize, topY, topCpLeftX, leftPoint, leftCpLeftPoint, leftCpRightPoint, bottomY, bottomCpLeftX);
  },

  setFaceParam(faceParam) {
    // console.log('Params set', faceParam)
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

    let topY = startParam.topY,
        topCpLeftX = startParam.topCpLeftX,
        leftPoint = startParam.leftPoint,
        leftCpLeftPoint = startParam.leftCpLeftPoint,
        leftCpRightPoint = startParam.leftCpRightPoint,
        bottomY = startParam.bottomY,
        bottomCpLeftX = startParam.bottomCpLeftX

    animate.number({
      start: startParam.topY,
      end: endParam.topY,
      diviedInto: diviedInto,
      interval: interval,
      callback: (number) => { topY = number }
    })

    animate.number({
      start: startParam.topCpLeftX,
      end: endParam.topCpLeftX,
      diviedInto: diviedInto,
      interval: interval,
      callback: (number) => { topCpLeftX = number }
    })

    animate.point({
      start: startParam.leftPoint,
      end: endParam.leftPoint,
      diviedInto: diviedInto,
      interval: interval,
      callback: (point) => { leftPoint = point }
    })

    animate.point({
      start: startParam.leftCpLeftPoint,
      end: endParam.leftCpLeftPoint,
      diviedInto: diviedInto,
      interval: interval,
      callback: (point) => { leftCpLeftPoint = point }
    })

    animate.point({
      start: startParam.leftCpRightPoint,
      end: endParam.leftCpRightPoint,
      diviedInto: diviedInto,
      interval: interval,
      callback: (point) => { leftCpRightPoint = point }
    })

    animate.number({
      start: startParam.bottomY,
      end: endParam.bottomY,
      diviedInto: diviedInto,
      interval: interval,
      callback: (number) => { bottomY = number }
    })

    animate.number({
      start: startParam.bottomCpLeftX,
      end: endParam.bottomCpLeftX,
      diviedInto: diviedInto,
      interval: interval,
      callback: (number) => { bottomCpLeftX = number }
    })

    let counter = diviedInto
    let loop = () => {
      setTimeout(() => {
          counter--

          let param = {
            topY: topY,
            topCpLeftX: topCpLeftX,
            leftPoint: leftPoint,
            leftCpLeftPoint: leftCpLeftPoint,
            leftCpRightPoint: leftCpRightPoint,
            bottomY: bottomY,
            bottomCpLeftX: bottomCpLeftX
          }

          this.drawFace(param)
          handle(param)

          if (counter > 0) loop()
          else that.setData({isAnimating: false})

       }, interval)
    }
    loop()
  },

  drawEcstasy() {
    console.info('Feeling Ecasty.')

    let endParam = {
      topY: 100,
      topCpLeftX: 47,
      leftPoint: draw.makePoint(44, 132),
      leftCpLeftPoint: draw.makePoint(74, 168),
      leftCpRightPoint: draw.makePoint(74, 168),
      bottomY: 200,
      bottomCpLeftX: 47
    }

    this.animateFace(endParam, 20, 10, this.setFaceParam)

  },

  drawHappy() {
    console.info('Feeling Happy.')

    let endParam = {
      topY: 220,
      topCpLeftX: 47,
      leftPoint: draw.makePoint(44, 132),
      leftCpLeftPoint: draw.makePoint(74, 168),
      leftCpRightPoint: draw.makePoint(74, 168),
      bottomY: 220,
      bottomCpLeftX: 47
    }

    this.animateFace(endParam, 20, 10, this.setFaceParam)
  },

  drawPleased() {
    console.info('Feeling Pleased.')

    let endParam = {
      topY: 164,
      topCpLeftX: 47,
      leftPoint: draw.makePoint(44, 132),
      leftCpLeftPoint: draw.makePoint(74, 168),
      leftCpRightPoint: draw.makePoint(74, 168),
      bottomY: 200,
      bottomCpLeftX: 47
    }

    this.animateFace(endParam, 20, 10, this.setFaceParam)
    this.setData({
      mood: 'pleased'
    })
  },

  drawCalm() {
    console.info('Feeling Calm.')

    let endParam = {
      topY: 150,
      topCpLeftX: 47,
      leftPoint: draw.makePoint(44, 132),
      leftCpLeftPoint: draw.makePoint(74, 168),
      leftCpRightPoint: draw.makePoint(74, 168),
      bottomY: 150,
      bottomCpLeftX: 47
    }

    this.animateFace(endParam, 20, 10, this.setFaceParam)
    this.setData({
      mood: 'calm'
    })
  },

  drawUpset() {
    console.info('Feeling Upset.')
  },

  drawOops() {
    console.info('Feeling Oops.')
  },

  drawUgh() {
    console.info('Feeling Ugh.')
  },

  touchStartFace(e) {
    // this.touchMoveFace(e)
  },

  touchMoveFace(e) {
    let touchX = e.touches[0].clientX
    let touchY = e.touches[0].clientY
    // console.log('touchY', touchY)

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
  },

  touchEndFace(e) {
    // let touchX = e.touches[0].clientX
    // let touchY = e.touches[0].clientY
  },

  tapFace(e) {
    this.touchMoveFace(e)
  },


})
