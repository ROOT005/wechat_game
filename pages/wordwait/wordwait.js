// pages/wordwait/wordwait.js
const app = getApp();
var tinyN;
var total_micro_second;
var serverUrl = app.globalData.serverUrl;
var wssUrl = app.globalData.wssUrl;
var globalRoomid = app.globalData.globalRoomid;
var goToword = false; //是否跳转到游戏页面

//等待动画
function startCheck(that) {
  that.check = setTimeout(function () {
    tinyN++;
    startCheck(that);
  }, 1000);
  that.setData({
    tinyN: tinyN,
  });
}

//找到房间倒计时
function count_down(that) {
  that.setData({
    clock: total_micro_second
  });
  if (total_micro_second > 0) {
    that.countDown = setTimeout(function () {
      // 放在最后--
      total_micro_second--;
      count_down(that);
    }, 1000)
  }
  if (total_micro_second == 0) {
    clearTimeout(that.countDown);
    goToword = true;
    //传参数到word
    wx.redirectTo({
      url: '../word/word?roomid=' + that.roomid + "&right_head=" + that.data.right_head,
    });

  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clock: '',
    room_wait: 0,
    inviteFriend:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //调用应用实例的方法获取全局数据
    var that = this;
    app.getUserInfo(function (userInfo, userSession, userData) {
      //更新数据
      app.globalData.userSession = userSession
      app.globalData.userData = userData
      app.globalData.userInfo = userInfo

      //初始化参数
      total_micro_second = 3;
      tinyN = 1;
      that.user_session = app.globalData.userSession;

      //获取自己的头像
      var headurl = app.globalData.userData.avatarurl;
      that.setData({
        left_head: headurl,
        sourceUrl: app.globalData.sorceUrl,
      });

      startCheck(that);
      
      //注册socket
      wx.connectSocket({
        url: wssUrl + "/socket",
      });
      var msg = {
        cmd: 'reg',
        user_session: app.globalData.userSession,
      }
      var msg1 = JSON.stringify(msg);
      
      //判断是否从邀请进入
      if (options.usersession != null) {//是
        wx.onSocketOpen(function (res) {
          wx.sendSocketMessage({
            data: msg1
          });
          console.log(options);
          var msg = {
            cmd: 'getroom',
            user_session: app.globalData.userSession,
            roomlevel: 1,
            count: 2,
            friend_session: options.usersession,
          }
          var msg2 = JSON.stringify(msg);
          wx.sendSocketMessage({
            data: msg2,
          });
        });
          
      } else {
          
          wx.onSocketOpen(function (res) {
            wx.sendSocketMessage({
              data: msg1
            });
          });
          //加心跳
          setInterval(function () {
            var msgCheck = {
              cmd: 'check',
              user_session: app.globalData.userSession,
            }
            var msgch = JSON.stringify(msgCheck);
            wx.sendSocketMessage({
              data: msgch,
            });
          }, 30000);
      }
    })
    app.getShareInfo(function (data) {
      var data = data.info
      that.data.share_title = data.title
      that.data.share_desc = data.description
      that.data.share_img = data.img
    }, 5)

    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay: 300
    });
    animation.translateX(200).step()
    that.setData({
      animation: animation.export(),
    })
    var animation1 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay: 300
    });
    animation1.translateX(-200).step();
    that.setData({
      animation1: animation1.export(),
    })
    var animation2 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay: 300
    });
    animation2.translateX(180).step()
    that.setData({
      animation2: animation2.export(),
    })

    var animation3 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay: 300
    });
    animation3.translateX(-150).step();
    that.setData({
      animation3: animation3.export(),
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.onSocketMessage(function (res) {
      var datar = JSON.parse(res.data);
      //globalRoomid = datar.roomid;
      that.roomid = datar.roomid;
      if (datar.room != undefined) {     
        if (datar.result != 'error') {
          clearTimeout(that.check);
          tinyN = 0;
          count_down(that);

          //添加数据
          for (var key in datar.room) {
            var room = datar.room[key];
            if (room.user_session != that.user_session) {

              that.setData({
                room_wait: 1,
                right_head: room.avatarurl,
              });
            }
          }
        } 
      } else if (datar.msg != undefined){
        wx.showToast({
          title: datar.msg,
          duration: 3000,
          icon: "none",
          image: "",
          mask: true,
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.clock > 0 && this.data.clock < 4) {
      clearTimeout(this.countDown);
      clearTimeout(this.check);
      wx.showToast({
        title: "",
        icon: "none",
        image: "/images/exit.png",
        mask: true,
      });
    }
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
    var that = this;
   
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
          startCheck(that);
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
          startCheck(that);
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
        startCheck(that);
      },
    }
  },
  roomType: function () {
    //按钮动画
    var button_animation = wx.createAnimation({
      duration: 100,
      timingFunction: 'ease',
    });
    this.button_animation = button_animation;
    button_animation.opacity(0.5).scale(1.15, 1.15).step();
    button_animation.opacity(1).scale(1, 1).step();
    this.setData({
      button_animation: button_animation.export(),
      room_wait: 1,
      inviteFriend: true,
    });

    //申请普通房间
    var that = this;
    var msg = {
      cmd: 'getroom',
      user_session: app.globalData.userSession,
      roomlevel: 1,
      count: 2,
    }
    console.log(msg2);
    var msg2 = JSON.stringify(msg);
    wx.sendSocketMessage({
      data: msg2,
    });
    startCheck(that);

  },
})