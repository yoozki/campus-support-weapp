const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    campusName: "广东邮电职业技术学院",
    showPicker: false,
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  onLoad() {
    const campusList = app.globalData.campusList
    this.setData({
      campusList
    })
    const campusId = app.globalData.campusId
    if (!campusId) {
      app.globalData.cammpusId = 1
    }
  },

  onConfirm(e) {
    const campusName = e.detail.value
    const campusId = e.detail.index + 1
    this.setData({
      campusName
    })
    app.globalData.cammpusId = campusId
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
  },

  test() {
    wx.navigateTo({
      url: '/pages/errandDeliveryInfo/errandDeliveryInfo?orderId=' + 2104022024207307
    });
  }

})