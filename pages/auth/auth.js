//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getUserInfo: function(e) {

    app.globalData.userInfo = e.detail.userInfo
    if (app.globalData.userInfo) {
      wx.showToast({
        title: '加载…',
        icon: 'loading',
        duration: 1000
      })

      var that = this
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function (userInfo, userSession, userData) {
        //更新数据
        app.globalData.userSession = userSession
        app.globalData.userData = userData
        app.globalData.userInfo = userInfo
        if(app.globalData.userSession){
          wx.redirectTo({
            url: '/pages/main/main',
          })
        }
      })

    }
  }
})
