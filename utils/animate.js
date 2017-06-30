const draw = require('draw.js')

function animateNumber(args) {
  if (args.start === undefined || args.end === undefined) {
    console.error('start or end number is not defined')
    return
  }

  let start = args.start,
      end   = args.end,
      diviedInto = args.diviedInto ? args.diviedInto : 5,
      interval   = args.interval ? args.interval : 100,
      callback   = typeof args.callback === 'function' ? args.callback : () => {}

  let counter = diviedInto
  let hop = (args.end - args.start) / diviedInto
  let currentNum = start

  let loop = () => {
    setTimeout(() => {
        counter--
        currentNum += hop
        callback(currentNum)
        if (counter > 0) {
           loop()
        }
     }, interval)
  }

  loop()
}


function animatePoint(args) {
  if (args.start === undefined || args.end === undefined) {
    console.error('start or end point is not defined')
    return
  }

  let start      = args.start,
      end        = args.end,
      diviedInto = args.diviedInto ? args.diviedInto : 5,
      interval   = args.interval ? args.interval : 100,
      callback   = typeof args.callback === 'function' ? args.callback : () => {}

  let startX = start.x,
      startY = start.y,
      endX   = end.x,
      endY   = end.y

  let x = startX,
      y = startY

  animateNumber({
    start: startX,
    end: endX,
    diviedInto: diviedInto,
    interval: interval,
    callback: (res) => { x = res }
  })

  animateNumber({
    start: startY,
    end: endY,
    diviedInto: diviedInto,
    interval: interval,
    callback: (res) => { y = res }
  })

  let counter = diviedInto
  let loop = () => {
    setTimeout(() => {
        counter--
        callback(draw.makePoint(x, y))
        if (counter > 0)
           loop()
     }, interval)
  }

  loop()
}

module.exports = {
  number: animateNumber,
  point: animatePoint,
}
