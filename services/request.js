const BASE_URL = 'https://hsbc.xiangshengyue.com'//自己的请求域名

const serviceApi = (url, method = 'GET', data = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + url,
      method,
      data,
      header: {
        'content-type': 'application/json'
      },
      success: res => resolve(res?.data),
      fail: err => reject(err)
    })
  })
}

export default serviceApi