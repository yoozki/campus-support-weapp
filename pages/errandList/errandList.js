import request from '../../service/network'
import moment from '../../miniprogram_npm/moment/index'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';

const app =  getApp();
const pattern = /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[0-35-9]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|6[2567]\d{2}|4(?:(?:10|4[01])\d{3}|[68]\d{4}|[579]\d{2}))\d{6}$/


Page({

  data: {
    tagOption: [
      { text: '全部', value: 0 },
      { text: '快递', value: 1 },
      { text: '跑腿', value: 2 },
    ],
    sexLimitOption: [
      { text: '不限男女', value: 0 },
      { text: '仅限男', value: 1 },
      { text: '仅限女', value: 2 },
    ],
    sortOption: [
      { text: '默认排序', value: "default" },
      { text: '赏金排序', value: "reward" },
      { text: '时间排序', value: "deliveryTime" },
    ],
    tagId: 0,
    sort: "default",
    isLoading: true,
    sexLimit: 0,
    current: 1,
    show: false
  },

  deliveryTimeFormat(deliveryTime) {
    moment.calendarFormat = function (myMoment, now) {
      var diff = myMoment.diff(now, 'days', true);
      var nextMonth = now.clone().add(1, 'month');
      var retVal =  diff < -6 ? 'sameElse' :
          diff < -1 ? 'lastWeek' :
          diff < 0 ? 'lastDay' :
          diff < 1 ? 'sameDay' :
          diff < 2 ? 'nextDay' :
          // 设置后天的定义
          diff < 3 ? 'afterNextDay' :
          (myMoment.month() === now.month() && myMoment.year() === now.year()) ? 'thisMonth' :
          (nextMonth.month() === myMoment.month() && nextMonth.year() === myMoment.year()) ? 'nextMonth' : 'sameElse';
      return retVal;
    }
    return moment(deliveryTime).calendar(null, {
      sameDay: '[今天] HH:MM [前]',
      nextDay: '[明天] HH:MM [前]',
      afterNextDay: '[后天] HH:MM [前]',
    })
  },

  sortOptionChange(value) {
    const sort = value.detail
    this.setData({
      sort,
      errandList: null,
      isLoading: true,
    })
    this.getErrandList()
  },

  tagOptionChange(value) {
    const tagId = value.detail
    this.setData({
      tagId,
      errandList: null,
      isLoading: true
    })
    this.getErrandList()
  },

  sexLimitOptionChange(value) {
    const sexLimit = value.detail
    this.setData({
      sexLimit,
      errandList: null,
      isLoading: true
    })
    this.getErrandList()
  },

  onLoad(options) {
    const campusList = app.globalData.campusList
    const tagId = options.tagId * 1
    const campusId = app.globalData.campusId
    if (tagId) {
      this.setData({
        tagId
      })
    } else {
      const tagId = 0
      this.setData({
        tagId
      })
    }
    this.setData({
      campusList,
      campusId
    })
    this.getErrandList()
  },

  replace(errandList) {
    for (var i = 0; i < errandList.length; i++) {
      const deliveryTime = this.deliveryTimeFormat(errandList[i].deliveryTime)
      errandList[i].deliveryTime = deliveryTime
    }
  },

  getErrandList() {
    const tagId = this.data.tagId
    const campusId = this.data.campusId
    const current = this.data.current
    if (tagId) {
      const sort = this.data.sort
      const sexLimit = this.data.sexLimit
      request({
        url: '/search/errand/list',
        data: {
          tagId,
          sexLimit,
          campusId,
          current,
          sort
        }
      }).then(res => {
        if (res.data.code === 0) {
          const errandList = res.data.data.errandList
          this.replace(errandList)
          this.setData({
            isLoading: false,
            errandList
          })
        }
      })
    } else {
      const sort = this.data.sort
      const sexLimit = this.data.sexLimit
      request({
        url: '/search/errand/list',
        data: {
          isLoading: false,
          sexLimit,
          campusId,
          current,
          sort
        }
      }).then(res => {
        if (res.data.code === 0) {
          const errandList = res.data.data.errandList
          this.replace(errandList)
          this.setData({
            isLoading: false,
            errandList
          })
        }
      })
    }
  },

  onSearch(e) {
    this.setData({
      isLoading: true
    })
    const keyword = e.detail
    const tagId = this.data.tagId
    const campusId = this.data.campusId
    const sexLimit = this.data.sexLimit
    if (tagId) {
      request({
        url: '/search/errand/list',
        data: {
          isLoading: false,
          keyword,
          tagId,
          campusId,
          sexLimit
        }
      }).then(res => {
        const errandList = res.data.data.errandList
        this.replace(errandList)
        this.setData({
          errandList
        })
      })
    } else {
      request({
        url: '/search/errand/list',
        data: {
          isLoading: false,
          keyword,
          campusId,
          sexLimit
        }
      }).then(res => {
        const errandList = res.data.data.errandList
        this.replace(errandList)
        this.setData({
          isLoading: false,
          errandList
        })
      })
    }
  },

  deliverySumbit(e) {
    const token = app.globalData.token
    if (token == null) {
      Dialog.alert({
        title: '请先登录',
        message: '请登录后再完成操作！'
      }).then(res => {
        wx.switchTab({
          url: '/pages/user/user'
        })
      })
    } else {
      this.setData({
        orderId: e.target.dataset.index,
        show: true
      })
    }
  },

  onClose() {
    this.setData({
      show: false
    })
  },

  onChange(e) {
    this.setData({
      delivererPhone: e.detail
    })
  },

  submit() {
    const orderId = this.data.orderId
    const delivererPhone = this.data.delivererPhone
    if (!pattern.test(delivererPhone)) {
      Notify({ type: 'danger', message: '用户手机格式错误' });
      return
    }
    const token = app.globalData.token
    request({
      url: '/errand/deliverer/accept/' + orderId + '?delivererPhone=' + delivererPhone.toString(),
      method: 'put',
      header: {
        'Authorization': token
      }
    }).then(res => {
      if (res.data.code === 0) {
        wx.redirectTo({
          url: '/pages/errandDeliveryInfo/errandDeliveryInfo?orderId=' + orderId
        });
      } else {
        Notify({ type: 'danger', message: res.data.msg });
      }
    })
  }

})