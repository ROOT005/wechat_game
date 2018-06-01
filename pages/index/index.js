//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow: function(){
    // console.log('index onShow')
  },
  onLoad: function () {
    
    console.log('index onLoad')
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.checkSession({
        success: function (e) { // 登录未过期
          wx.redirectTo({
            url: '/pages/main/main',
          })
        },
        fail: function(e){
          wx.getSetting({
            success: res =>{
              if (res.authSetting['scope.userInfo']) { // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                wx.getUserInfo({
                  success: res => {
                    app.globalData.userInfo = res.userInfo
                    if(app.globalData.userInfo){
                      wx.login({
                        success: res => {
                          
                          if (res.code) {
                            wx.request({
                              url: app.globalData.serverUrl +'/index/login/login',
                              data: { code: res.code, userinfo: app.globalData.userInfo },
                              success: function (res) {
                                
                                if (res.data.status) {
                                  
                                  app.globalData.userSession = res.data.user_session
                                  app.globalData.userData = res.data.userdata

                                  console.log(app.globalData.userSession)
                                  wx.redirectTo({
                                    url: '/pages/main/main',
                                  })

                                }
                              },
                              fail: function (e) {
                                console.log(e)
                              }
                            })
                          }
                        }
                      })
                    } else {
                      console.log('获取用户信息失败')
                    }
                  }
                })
              }else{ // 
                wx.getUserInfo({
                  success: res=>{
                    app.globalData.userInfo = res.userInfo
                    if(app.globalData.userInfo){ // 获取到了用户信息
                      wx.login({
                        success: res => {
                          
                          if(res.code){
                            wx.request({
                              url: app.globalData.serverUrl +'/index/login/login',
                              data: { code: res.code, userinfo: app.globalData.userInfo },
                              success: function (res) {
                                
                                if(res.data.status){
                                  
                                  app.globalData.userSession = res.data.user_session
                                  app.globalData.userData = res.data.userdata
                                  
                                  wx.redirectTo({
                                    url: '/pages/main/main',
                                  });
                                }
                              },
                              fail: function(e){
                                console.log(e)
                              }
                            })
                          }
                        }
                      })
                    }else{
                      console.log('获取用户信息失败')
                    }
                  },
                  fail: res => {
                    console.log('拒绝授权')
                    wx.redirectTo({
                      url: '/pages/auth/auth',
                    })
                  }
                })


              }
            }
          })
        }
      })




    
  }

})
