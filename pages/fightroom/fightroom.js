// pages/fightroom/fightroom.js
const app = getApp();
var serverUrl = app.globalData.serverUrl;
var wssUrl = app.globalData.wssUrl;
var tinyN;

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


Page({

  /**
   * 页面的初始数据
   */
  data: {
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
      app.globalData.userInfo = userInfo;
      
      //注册socket
      wx.connectSocket({
        url: wssUrl + "/socket",
      });
      console.log(wssUrl + "/socket");
      var msg = {
        cmd: 'reg',
        user_session: app.globalData.userSession,
      }
      console.log(app.globalData.userSession);
      var msg1 = JSON.stringify(msg);

      wx.onSocketOpen(function (res) {
        wx.sendSocketMessage({
          data: msg1
        });
      });

    });
    this.user_session = app.globalData.userSession;

    wx.request({
      url: app.globalData.serverUrl + '/index/index/getUserCenter',
      data: { user_session: app.globalData.userSession },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        var alllevel = res.data.alllevel;
        var userLevel = {};
        var persent;
        var level = app.globalData.userData.level;
        var score = app.globalData.userData.score;

        for (var i = 0; i < level && i < Object.keys(alllevel).length; i++) {
          if(i+1 < level){
            persent = 100;
          }else{
            persent = 100*(score - alllevel[i + 1].min_score) / (alllevel[i + 1].max_score - alllevel[i + 1].min_score);
          }
          userLevel[i] = {
            "power": i+1,
            "level_logo": alllevel[i+1].image,
            "progress": persent,
            "scoreduration": score < alllevel[i + 1].max_score ? score : alllevel[i + 1].max_score,
            "level_need": alllevel[i + 1].max_score,
          };
        }
        that.setData({
          startFight: false,
          userLevel: userLevel,
          u_level: level - 1,
          next_logo: serverUrl + "/static/images/wxpages/fightroom/level_" + level + ".png",
          suo_logo: serverUrl + "/static/images/wxpages/fightroom/suo.png",
        });
      }
    });
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
      if (datar.room != undefined && datar.result != 'error') {
        //添加数据
        
        for (var key in datar.room) {
          var room = datar.room[key];
          console.log(room.user_session);
          console.log(that.user_session);
          if (room.user_session != that.user_session) {
            wx.redirectTo({
              url: '../word/word?roomid=' + that.roomid + "&right_head=" + room.avatarurl,
            });
          }
        }
      } else if (datar.msg != undefined) {
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
    tinyN = 1;
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
    clearTimeout(this.check);
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 点击打开游戏
   */
  fight: function(e){
    var that = this;
    
    console.log(parseInt(e.currentTarget.dataset.hi)+1);
    startCheck(that);
    var msg = {
      cmd: 'getroom',
      user_session: app.globalData.userSession,
      roomlevel: parseInt(e.currentTarget.dataset.hi) + 1,
      count: 2,
    }
    console.log(app.globalData.userSession);
    var msg2 = JSON.stringify(msg);
    wx.sendSocketMessage({
      data: msg2,
    });

    //动画
    var animation1 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay: 0
    });
    animation1.opacity(1).scale(1.5, 1.5).translateY(-200).step();
    animation1.opacity(0).scale(1, 1).step();

    var animation2 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay: 300
    });
    animation2.translateX(180).step()

    var animation3 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay: 300
    });
    animation3.translateX(-150).step();
    that.setData({
      startFight: true,
      animation1: animation1.export(),
      animation2: animation2.export(),
      animation3: animation3.export(),
    })
  }

  
})