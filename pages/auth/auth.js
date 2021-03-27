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
    isDisabled: false,
  },


  showPicker() {
    const isDisabled = this.data.isDisabled
    if (!isDisabled) {
      this.setData({
        show: true
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

  onPickerConfirm(e) {
    console.log(e)
    this.setData({
      campusId: e.detail.index + 1,
      campusValue: e.detail.value,
      show: false
    })
  },

  authSubmit() {
    const token = app.globalData.token
    const realName = this.data.realName
    const campusId = this.data.campusId
    const studentId = this.data.studentId
    request({
      url: '/user/auth',
      method: 'post',
      data: {
        realName,
        campusId,
        studentId
      },
      header: {
        'Authorization': token
      }
    }).then(res => {
      Toast.success('提交成功!');
      setTimeout(()=> {
        this.onLoad()
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
        campus
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
        this.setData({
          realName: res.data.data.realName,
          campusValue: res.data.data.campus,
          studentId: res.data.data.studentId,
          isDisabled: true
        })
        
      }
    })
  }


 
})