const TOKEN = 'token'
const app =  getApp()
import request from '../../service/network'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';



Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    userInfo: null
  },

  handleGetUserInfo(e) {
    Toast.loading({
      message: '登录中',
      forbidClick: true,
    });
    const { userInfo } = e.detail
    wx.login({
      success: (res) => {
        const code = res.code
        request({
          url: "/user/passport/token",
          method: "post",
          data: {
            code,
            avatar: userInfo.avatarUrl,
            nickName: userInfo.nickName
          },
        }).then(res => {
          if (res.data.code === 0) {
            Toast.success('登录成功');
            const token = res.data.data
            console.log(token)
            wx.setStorageSync(TOKEN, token)
            app.globalData.token = token
            request({
              url: '/user/auth',
              header: {
                'Authorization': token
              }
            }).then(res => {
              if (res.data.code === 0) {
                const campusId = res.data.data.campusId
                const gender = res.data.data.gender
                app.globalData.campusId = campusId
                app.globalData.gender = gender
              } else {

              }
            })
            setTimeout(() => {
              this.handleGetUserInfoServer(token)
            }, 1300)
          }
        })
      },
    });
  },


  handleGetUserInfoServer(token) {
    request({
      url: "/user/info",
      header: {
        'context-type': 'application/json',
        'Authorization': token
      }
    }).then(res => {
      app.globalData.userInfo = res.data.data
      this.setData({
        userInfo: res.data.data,
        isLogin: true
      })
    }).catch(res => {
      this.setData({
        userInfo: null,
        isLogin: false
      })
    })
  },

  onShow() {
    const token = app.globalData.token
    const isLogin = app.globalData.isLogin
    if (token && isLogin) {
      this.handleGetUserInfoServer(token)
    }
  },

  showDialog() {
    Dialog.confirm({
      title: '确定退出？',
      message: '退出登录后将无法查看订单，重新登录即可查看',
    })
      .then(() => {
        this.handleLogout()
      })
      .catch(() => {
        // on cancel
      });
  },

  handleLogout() {
    const token = app.globalData.token
    request({
      url: '/user/passport/token',
      method: 'delete',
      header: {
        'Authorization': token
      }
    }).then(res => {
      this.setData({
        isLogin: false
      })
    })
  }

})