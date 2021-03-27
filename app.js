const TOKEN = 'token'

App({
  globalData: {
    token: null,
    userInfo: null,
    isLogin: false,
    campusId: 1,
  },

  onLaunch() {
    // 展示本地存储能力
    // const token = wx.getStorageSync(TOKEN)
    // if (token) {
    //   wx.request({
    //     url: 'http://localhost:10000/user/passport/verify/token',
    //     header: {
    //       'content-type':'application/json',
    //       'Authorization': token
    //     },
    //     method: 'POST',
    //     success: (res)=>{
    //       if (res.data.code != 10000) {
    //         wx.removeStorageSync(TOKEN)
    //       } else {
    //         this.globalData.isLogin = true
    //       }
    //     },
    //     fail: ()=>{},
    //     complete: ()=>{}
    //   });
    // }
  },
})
