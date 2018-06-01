// pages/index/wordstop.js
const app = getApp();
var wssUrl = app.globalData.wssUrl;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    room_id :'',
    leftscore:200,
    rightscore:400,
    lefthead:'',
    righthead:'',
    leftfont:'',
    failfont:'',
    lheadpic:'',
    rheadpic:'',
    rightscorepic:'lred.png',
    leftscorepic:'rblue.png',
    kopic:'ko.png',
    kowidth:50,
    koleft:45,
    animationData:'',
    animationData2:'',
    path: app.globalData.sorceUrl+'/static/images/wxpages/index/',
    level_name:'',
    ticket:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options
    var that = this
    var msg3 = {
      cmd: 'getresult',
      user_session: app.globalData.userSession,
      roomid: options.roomid,
    };
    var msg3 = JSON.stringify(msg3);
    wx.sendSocketMessage({
      data: msg3,
    });
    wx.onSocketMessage(function (res) {
      var data = res.data
      var data = JSON.parse(data);
      console.log(data.room);
      if(data.result){
        data = data.room;
      for (var key in data) {
          var room = data[key];
          console.log(data[key]['add']);
          console.log("room_score" + room['score'])
          if (room['user_session'] == app.globalData.userSession) {
            that.setData({
              leftscore: room['score'],
              lheadpic: room['avatarurl'],
              ticket:room['ticket']
            });
          } else {
            that.setData({
              rightscore: room['score'],
              rheadpic: room['avatarurl'],
            });
          }
        }//thisthis
      if (that.data.leftscore > that.data.rightscore) {
          that.setData({
            lefthead: 'win-head.png',
            righthead: 'fail-head.png',
            leftper:50,
            rightper:50,
            lefttop: 20,
            righttop: 15,
            lefta: 0,
            righta: 25,
            leftfont: 'win.png',
            rightfont: 'fail.png',
            leftscorepic: 'lred.png',
            rightscorepic: 'rblue.png',
          })
        } //thisthis
      else if (that.data.leftscore < that.data.rightscore) {
          that.setData({
            lefthead: 'fail-head.png',
            righthead: 'win-head.png',
            leftper: 50,
            rightper: 50,
            lefttop: 20,
            righttop: 20,
            lefta:25,
            righta:20,
            leftfont: 'fail.png',
            rightfont: 'win.png',
            leftscorepic: 'lblue.png',
            rightscorepic: 'rred.png',
          })
        } //thisthis
      else {
          that.setData({
            lefthead: 'win-head.png',
            righthead: 'fail-head.png',
            leftfont: '',
            rightfont: '',
            leftscorepic: 'lred.png',
            rightscorepic: 'rblue.png',
            kopic: 'pj.png',
            rightper: 50,
            leftper:50,
            lefttop: 20,
            righttop: 20,
            lefta: 0,
            righta: 0,
            kowidth: 100,
            koleft: 36,
          })
        }//thisthis
    if (that.data.leftscore > that.data.rightscore) {
        var animation = wx.createAnimation({
          duration: 1000,
          timingFunction: 'ease',
        })
        var animation2 = wx.createAnimation({
          duration: 1000,
          timingFunction: 'ease',
        })
        that.animation = animation
        that.animation2 = animation2
        animation.scale(1.3, 1.3).translateX(30).step()
        animation2.scale(0.7, 0.7).translateX(30).step()
        that.setData({
          animationData: animation.export(),
          animationData2: animation2.export()
        })
        }//thisthis

        else if (that.data.leftscore < that.data.rightscore) {
          var animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease',
          })
          var animation2 = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease',
          })
          that.animation = animation
          that.animation2 = animation2
          animation2.scale(1.3, 1.3).translateX(-30).step()
          animation.scale(0.7, 0.7).translateX(-30).step()
          that.setData({
            animationData: animation.export(),
            animationData2: animation2.export()
          })
        }



      }
    });
   
  wx.request({
    url: app.globalData.serverUrl +'/index/index/getUserCenter',
    data: {user_session: app.globalData.userSession },
    method: 'GET',
    header: { 'content-type': 'application/json' },
    success:function(res){
      var data = res.data
      app.globalData.userData['level'] = data['userdata']['level']
      app.globalData.userData['all_game'] = data['userdata']['all_game']
      app.globalData.userData['ticket'] = data['userdata']['ticket']
      app.globalData.userData['win_game'] = data['userdata']['win_game']
      that.setData({
        level_name: data['level']['name'],
      })
    }
  })

  app.getShareInfo(function (data) {
    var data = data.info
    that.data.share_title = data.title
    that.data.share_desc = data.description
    that.data.share_img = data.img
  }, 4)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  onShareAppMessage: function (options) {
    if (this.data.share_img != null) {
      return {
        title: this.data.share_title == null ? '汉字荣耀' : this.data.share_title,
        desc: this.data.share_desc == null ? '汉字荣耀' : this.data.share_desc,
        path: '/pages/main/main',
        //imageUrl: this.data.share_img == null ? null : this.data.share_desc,
      }
    } else {
      return {
        title: this.data.share_title == null ? '汉字荣耀' : this.data.share_title,
        desc: this.data.share_desc == null ? '汉字荣耀' : this.data.share_desc,
        path: '/pages/main/main',
        imageUrl: this.data.share_img == null ? null : this.data.share_desc,
      }
    }
  },
  back:function(){
    wx.redirectTo({
      url: '../main/main',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})