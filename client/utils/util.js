function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth()
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  var monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  return monthNames[month] + ' ' + day + ', ' + year


  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function isBetween(value, array) {
  if (array[0] <= value && value < array[1]) return true
  else return false
}

function subText (val) {
  if (val.length > 15) {
    val = val.substr(0, 15) + '...'
  }
  return val
}

module.exports = {
  formatTime: formatTime,
  isBetween: isBetween,
  subText: subText,
}
