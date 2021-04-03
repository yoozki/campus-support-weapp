import request from '../../service/network'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';



const app = new getApp();

Page({

  data: {
    radio: '1',
    isShow: true,
  },

  handleNext() {
    const radio = this.data.radio
    if (radio === '1') {
      wx.navigateTo({
        url: "/pages/errand/errand"
      })
    } else if (radio === '2') {
      wx.navigateTo({
        url: "/pages/publishGoods/publishGoods"
      })
    }
  },

  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },

  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: name,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const token = app.globalData.token
    if (!token) {
      Dialog.alert({
        title: '请先登录',
        message: '请登录后再完成操作！'
      }).then(() => {
        wx.switchTab({
          url: '/pages/user/user'
        })
      });
    } else {
      if (token && this.data.isShow) {
        request({
          url: '/user/auth/',
          header: {
            'Authorization': token
          },
        }).then(res => {
            if (res.data.code === 0) {
              const campusName = res.data.data.campus
              const campusId = res.data.data.campusId
              this.setData({
                campusName: campusName,
                isShow: false
              })
              app.globalData.campusId = campusId
            } else {
              Dialog.confirm({
                title: '用户未进行认证',
                message: '点击确定跳转认证页面',
              }).then(() => {
                wx.navigateTo({
                  url: '/pages/auth/auth'
                })
              }).catch(() => {
                wx.switchTab({
                  url: '/pages/index/index'
                })
              });
            }
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})