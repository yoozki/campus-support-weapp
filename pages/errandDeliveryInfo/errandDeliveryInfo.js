const app = new getApp();
import request from '../../service/network'
import sexLimitUtils from '../../utils/sexLimitUtils'
import tagUtils from '../../utils/tagUtils'
import moment from '../../miniprogram_npm/moment/index'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showComplete: false,
    buttonShow: true,
    activeNames: ['0'],
    steps: [
      {
        desc: '已接单',
      },
      {
        desc: '已完成',
      }
    ],
    active: 0,
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  onCompleteClose() {
    this.setData({
      showComplete: false
    })
  },

  onCodeChange(e) {
    this.setData({
      code: e.detail
    })
  },

  cancelBtn() {
    const orderId = this.data.orderId
    Dialog.confirm({
      title: '确认取消？',
      message: '现在取消，将会被限制接单！',
    }).then(() => {
      const token = app.globalData.token
      request({
        url: '/errand/order/deliverer/' + orderId,
        method: 'delete',
        header: {
          'Authorization': token
        }
      }).then(res => {
        if (res.data.code === 0) {
          Toast.success('已取消');
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/errandDeliveryInfo/errandDeliveryInfo?orderId=' + orderId
            })
          }, 1200);
        } else {
          const msg = res.data.msg
          Notify({ type: 'danger', message: msg });
        }
      })
    })
  },

  codeSubmit() {
    const code = this.data.code
    const orderId = this.data.orderId * 1
    const token = app.globalData.token
    request({
      url: '/errand/order/complete/' + orderId + '?code=' + code,
      method: 'put',
      header: {
        'Authorization': token
      }
    }).then(res => {
      if (res.data.code === 0) {
        Toast.success('送达成功！');
        wx.redirectTo({
          url: '/pages/errandDeliveryInfo/errandDeliveryInfo?orderId=' + orderId
        })
      } else {
        const msg = res.data.msg
        Notify({ type: 'danger', message: msg });
      }
    })
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

  completeBtn() {
    this.setData({
      showComplete: true
    })
  },
  
  onLoad(options) {
    // console.log(options.orderId)
    // this.setData({
    //   orderId: options.orderId
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    const orderId = options.orderId
    const token = app.globalData.token
    request({
      url: '/errand/deliverer/' + orderId,
      header: {
        'Authorization': token
      },
    }).then(res => {
      const info = res.data.data
      const deliveryTime = info.deliveryTime
      const sexLimit = sexLimitUtils(info.sexLimit)
      const tagValue = tagUtils(info.tagId)
      const Countdown = moment(deliveryTime).diff(moment(new Date()))
      const status = info.status
      if (status != 3) {
        if (status === 4) {
          this.setData({
            deliveredTime: info.gmtModified,
            active: 1
          })
        }
        if (status === 5 || status === 6) {
          this.setData({
            "steps[1].desc": '已取消',
            cancelTime: info.gmtModified,
            active: 1
          })
        }
        this.setData({
          buttonShow: false
        })
      }
      this.setData({
        orderId: orderId,
        title: info.title,
        detail: info.detail,
        targetAddress: info.targetAddress,
        deliveryAddress: info.deliveryAddress,
        deliveryTime: deliveryTime,
        reward: info.reward,
        receiverName: info.receiverName,
        receiverPhone: info.receiverPhone,
        tagValue,
        sexLimit,
        deliveryTime,
        status,
        createTime: info.gmtCreate,
        Countdown: Countdown
      })
    })
  },

  // handleFormateTime(time) {
  //   const nowDate = new Date().getDate()
  //   let date = time.getDate()
  //   let hours = time.getHours()
  //   let minute = time.getMinutes()
  //   if (date - nowDate === 0) {
  //      date = "今天" 
  //   } else if (date - nowDate === 1) {
  //     date = "明天"
  //   } else if (date - nowDate === 2) {
  //     date = "后天"
  //   }
  //   if (hours < 10) { hours = '0' + hours }
  //   if (minute < 10) { minute = '0' + minute }
  //   return(date + ' ' + hours + ':' + minute + ' 前')
  // }

})