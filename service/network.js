export default function(options) {
  return new Promise((resolve, reject) => {
    const api = "http://119.29.164.40:10000"
    wx.request({
      url: api + options.url,
      method: options.method || 'get',
      data: options.data || {},
      header: options.header || {},
      success: resolve,
      fail: reject
    })
  })
}