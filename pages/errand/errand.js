import request from '../../service/network'
const app = new getApp()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import TimeUtils from '../../utils/timeUtils'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonDisabled: true,
    showTimePicker: false,
    currentDate: new Date().getTime() + '',
    minDate: new Date().getTime() + 60 * 1000 * 30,
    maxDate: new Date().getTime() + 24 * 60 * 60 * 1000 * 2,
    sexLimitRadio: 0,
    tagRadio: 1,
    orderInfo: {},
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      } else if (type === 'day') {
        return `${value}日`;
      } else if (type == 'hour') {
        return `${value}时`;
      } else if (type == 'minute') {
        return `${value}分`
      }
      return value;
    },
    filter(type, options) {
      if (type === 'minute') {
        return options.filter((option) => option % 10 === 0);
      }
      return options;
    },
  },

  onSexLimitClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      sexLimitRadio: name,
      'orderInfo.sexLimit': name
    });
    this.verifyDisabled()
  },

  onTagClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      tagRadio: name,
      'orderInfo.tagId': name
    });
    this.verifyDisabled()
  },

  handlePublish() {
    Toast.loading({
      message: '提交中...',
      forbidClick: true,
    });
    const token = app.globalData.token
    const orderInfo = this.data.orderInfo
    const campusId = app.globalData.campusId
    request({
      url: '/errand/receiver',
      header: {
        'Authorization': token
      },
      data: {
        targetAddress: orderInfo.targetAddress,
        deliveryAddress: orderInfo.deliveryAddress,
        deliveryTime: orderInfo.deliveryTime,
        title: orderInfo.title,
        detail: orderInfo.detail,
        receiverName: orderInfo.receiverName,
        receiverPhone: orderInfo.receiverPhone,
        reward: orderInfo.reward,
        sexLimit: orderInfo.sexLimit,
        tagId: orderInfo.tagId,
        campusId: campusId
      },
      method: 'post'
    }).then(res => {
      if (res.data.code === 0) {
        Toast.success('提交成功');
        const orderId = res.data.data
        setTimeout(() => {
          wx.redirectTo({
            url: "/pages/errandPay/errandPay?orderId=" + orderId
          })
        }, 1200);
      } else {
        Toast.fail("提交失败")
      }
    })
  },

  verifyDisabled() {
    const orderInfo = this.data.orderInfo
    var length = 0;
    for (var key in orderInfo) {
      if (orderInfo[key] === "") {
        this.setData({
          buttonDisabled: true
        })
        return
      }
      length++;
    }
    if (length === 10) {
      this.setData({
        buttonDisabled: false
      })
    }
  },

  onFieldTargetAddress(e) {
      this.setData({
        'orderInfo.targetAddress': e.detail
      })
      this.verifyDisabled()
  },

  onFieldDeliveryAddress(e) {
    this.setData({
      'orderInfo.deliveryAddress': e.detail
    })
    this.verifyDisabled()
  },

  onFieldTitle(e) {
    this.setData({
      'orderInfo.title': e.detail
    })
    this.verifyDisabled()
  },

  onFieldDetail(e) {
    this.setData({
      'orderInfo.detail': e.detail
    })
    this.verifyDisabled()
  },

  onFieldReceiverName(e) {
    this.setData({
      'orderInfo.receiverName': e.detail
    })
    this.verifyDisabled()
  },

  onFieldReceiverPhone(e) {
    this.setData({
      'orderInfo.receiverPhone': e.detail
    })
    this.verifyDisabled()
  },

  onFieldReward(e) {
    this.setData({
      'orderInfo.reward': e.detail
    })
    this.verifyDisabled()
  },

  handleShowTimePicker() {
    this.setData({
      showTimePicker: true
    })
  },

  handleCloseTimePicker() {
    this.setData({
      showTimePicker: false
    })
  },

  onInput(event) {
    this.setData({
      currentTime: event.detail,
    });
  },

  handleFormateTime(date) {
    var Y = date.getFullYear() + '-';
    var M = ((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1) + '-') : ((date.getMonth() + 1) + '-');
    var D = (date.getDate() < 10) ? ('0' + date.getDate() + ' ') : (date.getDate() + ' ');
    var h = (date.getHours() < 10) ? ('0' + date.getHours() + ':') : (date.getHours() + ':');
    var m = (date.getMinutes() < 10) ? ('0' + date.getMinutes() + ':') : (date.getMinutes() + ':');
    var s = (date.getSeconds() < 10) ? ('0' + date.getSeconds()) : (date.getSeconds());
    return Y + M + D + h + m + s;
  },

  handleConfirm(e) {
    this.setData({
      showTimePicker: false
    })
    const time = new Date(e.detail)
    const deliveryTime = this.handleFormateTime(time)
    // const nowDate = new Date().getDate()
    // let date = time.getDate()
    // let hours = time.getHours()
    // let minute = time.getMinutes()
    // if (date - nowDate === 0) {
    //    date = "今天" 
    // } else if (date - nowDate === 1) {
    //   date = "明天"
    // } else if (date - nowDate === 2) {
    //   date = "后天"
    // }
    // if (hours < 10) { hours = '0' + hours }
    // if (minute < 10) { minute = '0' + minute }
    const deliveryTimeValue = TimeUtils(time)
    this.setData({
      // deliveryTimeValue: date + ' ' + hours + ':' + minute + ' 前',
      deliveryTimeValue: deliveryTimeValue,
      'orderInfo.deliveryTime': deliveryTime
    })
    this.verifyDisabled()
  },
})