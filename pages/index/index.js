// pages/index.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        title: '苹果',
        id:'AAPL',//'1810.HK',
        icon: 'iconfont icon-gongnengjieshao',
      },
      {
        title: '拼多多',
        icon: 'iconfont icon-shiyongshuoming',
      },
      {
        title: '理想汽车',
        icon: 'iconfont icon-guanyuwomen',
      },
      {
        title:'英伟达',
        icon: 'iconfont icon-shouye',
      },
      {
        title: '伯克希尔',//哈撒韦
        icon: 'iconfont icon-shouye',
      }, 
      {
        title: '渣打集团',
        icon: 'iconfont icon-shouye',
      }, 
      {
        title: '腾讯',
        icon: 'iconfont icon-shouye',
      }, 
      {
        title: '美团',
        icon: 'iconfont icon-shouye',
      }, 
      {
        title: '贵州茅台',
        icon: 'iconfont icon-shouye',
      }, 
      {
        title: '小米',
        id:'1810.HK',
        icon: 'iconfont icon-shouye',
      },
      {
        title: 'Plalantir',
        icon: 'iconfont icon-shouye',
      },
    ]
  },

  onTapList(e) {
    console.log('e==',e)
    const title = e.currentTarget.dataset.tab;
    console.log('title==',title)
    wx.navigateTo({
      url: `/pages/feature/index?title=${title}`,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})