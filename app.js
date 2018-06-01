//app.js
App({
  onLaunch: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']){ // 没有授权
          wx.authorize({
            scope: 'scope.userInfo',
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
  },
  onHide: function(){
    
  },
  globalData: {
    serverUrl:'https://wxword.yiqianyun.com',
    sorceUrl:'https://wxword.yiqianyun.com',
    wssUrl:'wss://wxword.yiqianyun.com',
    globalRoomid:'',
    userInfo: null,
    userData: null,
    userSession: null,
    shareInfo: null,
    announce: null,
  }, 
  // 登录 / 授权
  getUserInfo: function(cb){
    var that = this
    
    if(this.globalData.userSession){
      typeof cb == "function" && cb(this.globalData.userInfo, this.globalData.userSession, this.globalData.userData)
    }else{
      
      wx.getUserInfo({
        success: res => {

          this.globalData.userInfo = res.userInfo
          that.globalData.userInfo = res.userInfo

          if (this.globalData.userInfo){
            wx.login({
              success: res =>{
                if(res.code){
                  wx.request({
                    url: this.globalData.serverUrl+'/index/login/login',
                    data: { code: res.code, userinfo: this.globalData.userInfo },
                    success: function(res){
                      
                      if(res.data.status){

                        that.globalData.userSession = res.data.user_session
                        that.globalData.userData = res.data.userdata
                        that.globalData.userInfo = res.data.userinfo
                        that.globalData.announce = res.data.announce
                        
                        typeof cb == "function" && cb(that.globalData.userInfo, that.globalData.userSession, that.globalData.userData)
                      }
                    },
                    fail: function(e){
                      console.log('third server error')
                    }          
                  })
                }else{
                  console.log('login code error')
                }
              }
            })
          }else{
            console.log('获取用户信息失败')
          }
        }, 
        fail: res => {

          wx.redirectTo({
            url: '/pages/auth/auth',
          })
        } // end fail
      }) // end wx.getUserInfo

    }
  },
  getShareInfo: function(cb, id){
    var that = this
    wx.request({
      url: this.globalData.serverUrl+'/index/index/shareinfo',
      data: { type: id },
      success: function(res){
        console.log(res.data)
        that.globalData.shareInfo = res.data
        typeof cb == "function" && cb(that.globalData.shareInfo)
      },
      fail: function(e){
        console.log(e)
      }
    })
  }

  
  



})