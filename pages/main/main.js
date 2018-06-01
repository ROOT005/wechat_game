// pages/index/idemo.js

function countdown(that) {
  var EndTime = that.data.end_time || [];
  var NowTime = new Date().getTime();
  var level = that.data.level
  //console.log(NowTime+"--"+EndTime);
  var total_micro_second = EndTime - NowTime || [];
  if (total_micro_second>0){
    var ticket_num = Math.floor((3 * 3600 * 1000 - total_micro_second) / 3600 / 1000) * level
  }else{
    var ticket_num =  3* level
  }
  
  //console.log('剩余时间：' + total_micro_second);
  // 渲染倒计时时钟
  that.setData({
    clock: dateformat(total_micro_second),
    ticket_num: ticket_num
  });
  if (total_micro_second <= 0) {
    that.setData({
      clock: "等待领取",
      status:0
    });
  }
  setTimeout(function () {
    total_micro_second -= 1000;
    countdown(that);
  }, 1000)
}

// 时间格式化输出，如11:03 25:19 每1s都会调用一次
function dateformat(micro_second) {
  // 总秒数
  var second = Math.floor(micro_second / 1000);
  // 天数
  var day = Math.floor(second / 3600 / 24);
  // 小时
  var hr = Math.floor(second / 3600 % 24);
  // 分钟
  var min = Math.floor(second / 60 % 60);
  // 秒
  var sec = Math.floor(second % 60);
  return  hr + ":" + min + ":" + sec ;
}
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationData: '',
    animationData2: '',
    display:'none',
    uid:'',
    url:'',
    n:0,
    mename:'',
    meintro:'',
    clock:'',
    ticket_info:'',
    path: app.globalData.serverUrl + '/static/images/wxpages/index',
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getShareInfo(function(data){
      if(data.status==true){
        var data = data.info
        that.data.share_title = data.title
        that.data.share_desc = data.description
        that.data.share_img = data.img
      }
    },1)
    wx.showToast({
      title: '加载…',
      icon: 'loading',
      duration: 1000
    })

    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo, userSession, userData){
      //更新数据
      app.globalData.userSession = userSession
      app.globalData.userData = userData
      app.globalData.userInfo = userInfo

      console.log(app.globalData)
      that.setData({
        common: '', //一维数组，全部数据
        end_time: (app.globalData['userInfo']['ticket_time']+3600*3) * 1000, //项目截止时间，时间戳，单位毫秒,
        level: app.globalData['userData']['level'],
      })
      if (app.globalData['announce']!=null){
        that.setData({
          ann_title: app.globalData['announce']['title']+":",
          ann_content: app.globalData['announce']['content']
        })
      }
    })
      countdown(that);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    var n = 0
    setInterval(function () {
      var animation = wx.createAnimation({
        duration: 10,
        timingFunction: 'linear'
      })

      this.anima = animation
      if (n < 400) {
        this.anima.translate(-10 * n*0.12).step()
      }
      if(n>=400){
        n=0;
      }
      n++
      this.setData({
        ann: animation.export()
      })
    }.bind(this), 100)
  },  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
    var n = 0;
    //连续动画需要添加定时器,所传参数每次+1就行
    setInterval(function () {
      n = (this.data.n)+1 ;
      this.setData({
        n:n
      })
      if(n%3==0){
        var x = 1.6;
      }else if(n%3==1){
        var x = 1.4;
      }else if(n%3==2){
        var x= 1.2;
      }else{
        var x =0.9;
      }
      this.animation.scale(x, x).step()
      this.setData({
        animationData: this.animation.export()
      })
    }.bind(this), 300)
  
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      n:0
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    /**********2018-3-21 by ztf*************/
    var that = this;
    console.log(app.globalData.userSession);
   
    if (this.data.share_img != null) {
      return {
        title: this.data.share_title == null ? '汉字荣耀' : this.data.share_title,
        desc: this.data.share_desc == null ? '汉字荣耀' : this.data.share_desc,
        path: 'pages/wordwait/wordwait?usersession=' + app.globalData.userSession,
        //imageUrl: this.data.share_img == null ? null : this.data.share_desc,
        success: function (res) {
          that.setData({
            room_wait: 1,
          });
          wx.navigateTo({
            url: '../wordwait/wordwait'
          });
        },
      }
    } else {
      return {
        title: this.data.share_title == null ? '汉字荣耀' : this.data.share_title,
        desc: this.data.share_desc == null ? '汉字荣耀' : this.data.share_desc,
        path: 'pages/wordwait/wordwait?usersession=' + app.globalData.userSession,
        imageUrl: this.data.share_img == null ? null : this.data.share_desc,
        success: function (res) {
          that.setData({
            room_wait: 1,
          });
          wx.navigateTo({
            url: '../wordwait/wordwait'
          });
        },
      }
    }
    return {
      title: '汉字荣耀',
      path: 'pages/wordwait/wordwait?usersession=' + app.globalData.userSession,
      success: function (res) {
        that.setData({
          room_wait: 1,
        });
        wx.navigateTo({
          url: '../wordwait/wordwait'
        });
      },
    }
    /**********2018-3-21 by ztf*** end**********/
  },

  getTicket: function(e){
    var that = this
    var id = e.target.dataset.hi
    wx.request({
      url: app.globalData.serverUrl+'/index/index/getTicket',
      data: {user_session: app.globalData.userSession},
      success: function(res){
        if(res.data['ticket']<=0){
          that.setData({
            ticket_info:'时间未到'
          })
        }else{
          if (that.data.status==0){
            that.setData({
              end_time: new Date().getTime()+3*3600*1000
            })
          }
          that.setData({
            ticket_info: '体力+' + res.data['ticket'],
          })
          app.globalData.userData['ticket'] += res.data['ticket']
        }
       
        var animation1 = wx.createAnimation({
          duration: 1000,
          timingFunction: "ease",
          delay: 0,
          transformOrigin: "50% 50% 0",
        })
        that.animation1 = animation1
        animation1.translateY(-200).scale(2, 2).step()
        animation1.scale(0).step()
        animation1.translateY(200).step()
        that.setData({
          animationData2: animation1.export()
        })
      }
    })
  },
  /**
   * 页面跳转
   */
  clickMe: function (e) {
    wx.vibrateShort()
    var dis = this.data.display == 'none' ? '' : 'none';
    var id = e.target.dataset.hi
    if(id==1){
      var introduct=""
      var name = "排行榜"
    }else if(id==2){
      var introduct = ""
      var name = "好友对战"
    }
    // else if(id==3){
    //   var introduct = ""
    //   var name = "回复体力"
    // }
    else if(id==4){
      var introduct = ""
      var name = "多人对战"
    }else if(id==5){
      var introduct = ""
      var name = "个人中心"
    }else if(id==6){
      var introduct = ""
      var name = "商城"
    }
    this.setData({
      display:dis,
      uid :id,
      meintro: introduct,
      mename:name,
    })
    if (this.data.uid == 1) {
      this.setData({
        url: '../../pages/rankinglist/rankinglist'
      })
    } else if (this.data.uid == 2) {
      this.setData({
        url: '../../pages/wordwait/wordwait'
      })
      //console.log(this.data.uid)
    } 
    // else if (this.data.uid == 3) {
    //   this.setData({
    //     url: ''
    //   })
    // } 
    else if (this.data.uid == 4) {
      this.setData({
        url: '../fightroom/fightroom'
      })
    } else if (this.data.uid == 5) {
      this.setData({
        url: '../../pages/center/center'
      })
    } else if (this.data.uid == 6) {
      this.setData({
        url: ''
      })
    }
    wx.navigateTo({
      url: this.data.url
    })
   
  },
  into:function(e){
    if(this.data.uid==1){
      this.setData({
        url: '../../pages/rankinglist/rankinglist'
      })
    } else if (this.data.uid == 2) {
      this.setData({
        url: '../../pages/wordwait/wordwait'
      })
    } 
    // else if (this.data.uid == 3) {
    //   this.setData({
    //     url: ''
    //   })
    // } 
    else if (this.data.uid == 4) {
      this.setData({
        url: '../../pages/wordwait/wordwait'
      })
    } else if (this.data.uid == 5) {
      this.setData({
        url: ''
      })
    } else if (this.data.uid == 6) {
      this.setData({
        url: ''
      })
    }
    if(this.data.url!==''){
      wx.navigateTo({
        url: this.data.url
      })
    }
  
  },
  destroy:function(){
    this.setData({
      display: 'none'
    })
  }
})