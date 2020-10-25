const formatTime = date => {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const sleep = (sec) => {
  return new Promise((res) => {
    setTimeout(res, sec * 1000)
  })
}

const navigateBackOrIndex = () => {
  const hasBack = getCurrentPages().length > 1
  if (hasBack) {
    wx.navigateBack({
      delta: 0,
    })
  } else {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  }
}

module.exports = {
  formatTime,
  sleep,
  navigateBackOrIndex
}