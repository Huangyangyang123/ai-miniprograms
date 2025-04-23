const BASE_URL = 'https://api.example.com'//自己的请求域名

const request = (url, method = 'GET', data = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + url,
      method,
      data,
      header: {
        'content-type': 'application/json'
      },
      success: res => resolve(res),
      fail: err => reject(err)
    })
  })
}

export default request