import request from '../../service/network'
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    campusName: "广东邮电职业技术学院",
    isShow: true,
    showPicker: false
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const token = app.globalData.token
    if (token && this.data.isShow) {
      request({
        url: '/user/auth/',
        header: {
          'Authorization': token
        },
      }).then(res => {
          if (res.data.code === 0) {
            const campusName = res.data.data.campus
            const cammpusId = res.data.data.id
            this.setData({
              campusId: cammpusId,
              campusName: campusName,
              isShow: false
            })
          }
      })
    }
  },

  onLoad() {
    request({
      url: '/user/public/campus'
    }).then(res => {
      const campusList = res.data.data.map(item => item.campusName)
      this.setData({
        campusList: campusList
      })
      app.globalData.campusList = campusList
    })
  },

  onConfirm(e) {
    const campusName = e.detail.value
    const campusId = e.detail.index + 1
    this.setData({
      campusId,
      campusName
    })
    app.globalData.cammpusId = campusId
    console.log(app.globalData.cammpusId);
    this.handleClosePicker()
  },

  handleClosePicker() {
    this.setData({
      showPicker: false
    })
  },

  handleShowPicker() {
    this.setData({
      showPicker: true
    })
  }

})