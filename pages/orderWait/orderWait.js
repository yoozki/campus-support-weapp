const app = new getApp();
import request from '../../service/network'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  handleConfirm() {
    const token = app.globalData.token
    request({
      url: '/order/delivery/2103152240500185',
      method: 'put',
      header: {
        'Authorization': token
      },
    })
  },
  
  onLoad(options) {
    console.log(options.orderId)
    this.setData({
      orderId: options.orderId
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    request({
      url: '/order/public/2103152240500185',
    }).then(res => {
      const info = res.data.data
      const time = new Date(info.deliveryTime)
      const deliveryTimeValue = this.handleFormateTime(time)
      if (info.tagId === 1) {
        this.setData({
          tagValue: "快递"
        })
      } else if (info.tagId === 2) {
        this.setData({
          tagValue: "跑腿"
        })
      } else if (info.tagId === 3) {
        this.setData({
          tagValue: "代购",
          payCost: info.payCost
        })
      }
      this.setData({
        title: info.title,
        detail: info.detail,
        targetAddress: info.targetAddress,
        deliveryAddress: info.deliveryAddress,
        deliveryTimeValue: deliveryTimeValue,
        reward: info.reward
      })
    })
  },

  handleFormateTime(time) {
    const nowDate = new Date().getDate()
    let date = time.getDate()
    let hours = time.getHours()
    let minute = time.getMinutes()
    if (date - nowDate === 0) {
       date = "今天" 
    } else if (date - nowDate === 1) {
      date = "明天"
    } else if (date - nowDate === 2) {
      date = "后天"
    }
    if (hours < 10) { hours = '0' + hours }
    if (minute < 10) { minute = '0' + minute }
    return(date + ' ' + hours + ':' + minute + ' 前')
  }

})