// pages/login/login.js
const app =  getApp();
const TOKEN = 'token'

Page({

  handleGetUserInfo(e) {
    const { userInfo } = e.detail
    wx.login({
      success: (res) => {
        const code = res.code
        wx.request({
          url: 'http://localhost:10000/user/passport/token',
          method: 'post',
          data: {
            code,
            avatar: userInfo.avatarUrl,
            nickName: userInfo.nickName
          },
          success: (res)=>{
            const token = res.data.data
            console.log(token)
            wx.setStorageSync(TOKEN, token)
            app.globalData.token = token
            wx.navigateBack({
              delta: 1
            })
          },
          fail: ()=>{},
          complete: ()=>{}
        });
        
      },
    });
  },

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

})