import request from './service/network'

const TOKEN = 'token'

App({
  globalData: {
    token: null,
    userInfo: null,
    isLogin: false,
    campusId: 1,
  },

  onLaunch() {
    request({
      url: '/user/public/campus'
    }).then(res => {
      const campusList = res.data.data.map(item => item.campusName)
      this.globalData.campusList = campusList
    })
  },
})
