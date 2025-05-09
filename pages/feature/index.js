// pages/feature/index.js
import serviceApi from '../../services/request'
import { mockDatas } from '../../utils/mock.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    filePath:''
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
    this.initDatas()
  },


  async generateSharingCard(){
    const canvas = this.selectComponent('#wxml2canvas');
    await canvas.draw();
    const filePath = await canvas.toTempFilePath();


    const fs = wx.getFileSystemManager()
    const that = this
    fs.readFile({
      filePath, // 这里可以直接使用 temp 路径
      encoding: 'base64',
      success(res) {
        const base64Data = 'data:image/png;base64,' + res.data
        console.log('base64Data==',base64Data)
      that.setData({
        filePath:base64Data
      })
        // 你可以将 base64Data 用作 image src，或上传
      },
      fail(err) {
        console.error('读取文件失败', err)
      }
    })

    console.log('filePath==',filePath)
    wx.previewImage({
      urls: [filePath],
    });
  },

  async initDatas(){
    // const res = await serviceApi(`/api/v1/stock/analysis/query/ticker_name=AAPL&date=2025-05-07`)
    console.log('res==',mockDatas)
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