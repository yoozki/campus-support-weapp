import request from '../../service/network'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'


const app = new getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userAuth: {},
    campus: [],
    show: false,
    showSex: false,
    isDisabled: false,
    sex: 1,
  },

  onChange(event) {
    this.setData({
      sex: event.detail,
    });
  },

  showPicker() {
    const isDisabled = this.data.isDisabled
    if (!isDisabled) {
      this.setData({
        show: true
      })
    }
  },

  showSexPicker() {
    const isDisabled = this.data.isDisabled
    if (!isDisabled) {
      this.setData({
        showSex: true
      })
    }
  },

  onRealNameChange(e) {
    this.setData({
      realName: e.detail
    })
  },

  onStudentIdChange(e) {
    this.setData({
      studentId: e.detail
    })
  },
  
  onPickerClose() {
    this.setData({
      show: false
    })
  },

  onSexPickerClose() {
    this.setData({
      showSex: false
    })
  },

  onPickerConfirm(e) {
    this.setData({
      campusId: e.detail.index + 1,
      campusValue: e.detail.value,
      show: false
    })
  },

  onSexPickerConfirm(e) {
    this.setData({
      sex: e.detail.index + 1,
      sexValue: e.detail.value,
      showSex: false
    })
  },

  authSubmit() {
    const token = app.globalData.token
    const realName = this.data.realName
    const campusId = this.data.campusId
    const studentId = this.data.studentId
    const gender = this.data.sex
    request({
      url: '/user/auth',
      method: 'post',
      data: {
        realName,
        campusId,
        studentId,
        gender
      },
      header: {
        'Authorization': token
      }
    }).then(res => {
      Toast.success('提交成功!');
      setTimeout(()=> {
        wx.redirectTo({
          url: '/pages/auth/auth'
        })
      }, 2000)
    })
  },

  onShow() {
    request({
      url: '/user/public/campus'
    }).then((res) => {
      const campusList = res.data.data
      var campus = []
      for (var i = 0; i < campusList.length; i++) {
        campus.push(campusList[i].campusName)
      }
      this.setData({
        campus,
        sexs: ['男', '女']
      })
    })
    const token = app.globalData.token
    request({
      url: '/user/auth',
      header: {
        'Authorization': token
      }
    }).then(res => {
      if (res.data.code === 0) {
        const gender = res.data.data.gender
        var sexValue = ''
        if (gender === 1) {
          sexValue = '男'
        } else if (gender === 2) {
          sexValue = '女'
        }
        this.setData({
          realName: res.data.data.realName,
          campusValue: res.data.data.campusName,
          sexValue: sexValue,
          studentId: res.data.data.studentId,
          isDisabled: true
        })
        
      }
    })
  }


 
})