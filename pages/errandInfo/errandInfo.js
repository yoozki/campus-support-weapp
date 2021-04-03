import request from '../../service/network'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    steps: [
      {
        text: '用户下单',
      },
      {
        text: '正在跑腿',
      },
      {
        text: '跑腿完成',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const orderId = options.orderId
    const token = app.globalData.token
    request({
      url: '/errand/order/receiver/' + orderId,
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
      const gmtCreate = res.data.data.gmtCreate
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
        gmtModified,
        gmtCreate
      })
    })
  },



})