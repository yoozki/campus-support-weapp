import request from '../../service/network'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

const timeOut = 30
const app = getApp();
const moment = require('moment')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const orderId = options.orderId
    const token = app.globalData.token
    request({
      url: '/errand/receiver/' + orderId,
      header: {
        'Authorization': token
      },
    }).then(res => {
      const receiverName = res.data.data.receiverName
      const receiverPhone = res.data.data.receiverPhone
      const targetAddress = res.data.data.targetAddress
      const deliveryAddress = res.data.data.deliveryAddress
      const title = res.data.data.title
      const detail = res.data.data.detail
      const reward = res.data.data.reward
      const deliveryTime = res.data.data.deliveryTime
      const sexLimit = res.data.data.sexLimit
      const tagId = res.data.data.tagId
      const campusId = res.data.data.campusId
      const gmtModified = res.data.data.gmtModified
      const nowTime = moment(moment().format('YYYY-MM-DD HH:mm:ss'))
      const Countdown = (timeOut - (nowTime.diff(moment(gmtModified), "seconds"))) * 1000
      const campusName = app.globalData.campusList[campusId - 1]
      var tagName = ""
      if (tagId === 1) {
        tagName = "快递"
      } else if (tagId === 2) {
        tagName = "跑腿"
      }
      this.setData({
        orderId,
        receiverName,
        receiverPhone,
        targetAddress,
        deliveryAddress,
        title,
        detail,
        reward,
        deliveryTime,
        sexLimit,
        tagName,
        campusName,
        Countdown
      })
    })
  },

  countdownFinished() {
    Dialog.alert({
      title: '订单付款时间超时',
      message: '请重新发布任务！',
      theme: 'round-button',
    }).then(() => {
      wx.switchTab({
        url: '/pages/publish/publish'
      })
    });
  },

  onSubmit() {
    Toast.loading({
      message: '支付中...',
      forbidClick: true,
      duration: 0
    });
    const orderId = this.data.orderId
    const token = app.globalData.token
    request({
      url: '/errand/receiver/payment/' + orderId,
      method: 'put',
      header: {
        'Authorization': token
      },
    }).then(res => {
      if (res.data.code === 0) {
        Toast.success("支付成功！")
        setTimeout(() => {
          wx.redirectTo({
            url: "/pages/errandInfo/errandInfo?orderId=" + orderId
          })
        }, 1200);
      } else if (res.data.code === 10601) {
        Toast.fail('账号余额不足,支付失败！');
      }
    })
  }
})