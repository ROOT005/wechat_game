var x;
var rea;
const app = getApp();
var serverUrl = app.globalData.serverUrl;
var wssUrl = app.globalData.wssUrl;
var input_content = '';//全局输入内容
var wordFinish = false;
var connetcLoss = false;
//答题倒计时
function ready(that){
  that.setData({
    rea: rea,
  });
  that.duration = 27-rea;
  if(rea>0){
    that.readyNum = setTimeout(function () {
      ready(that);
    }, 1000);
    rea--; 
  }else{
    clearTimeout(that.readyNum);
    clearTimeout(that.roteRea);
    start(that);
  }
}
//翻牌子
function rote(that){
  if (rea > 0) {    
    that.roteRea = setTimeout(function () {
      rote(that);
      var i;
      var len;
      for (i = 0, len = that.content.length; i < len; i++) {
        
        that.content[i]["list"][rea / 3]["opacity"] = 0;
      }
      that.setData({
        content: that.content,
      });
    }, 3000);
  }else{
    clearTimeout(that.roteRea);
  }
}
//获取题目
function start(that){
  x++;
  if (x > 5) {
    wordFinish = true;
    wx.redirectTo({
      url: '../wordstop/wordstop?roomid=' + that.roomid
    });
  }else{
    clearTimeout(that.readyNum);
    clearTimeout(that.roteRea);
   
    //如果断网
    if(connetcLoss){
      wx.showToast({
        title: "由于网络问题，您已放弃比赛",
        duration: 3000,
        icon: "none",
        image: "",
        mask: true,
        success:function(){
          wordFinish = true;
          wx.redirectTo({
            url: '../main/main'
          });
        }
      });
    }
   
    that.num = x-1;
    rea = 27;
    var msg3 = {
      cmd:'getquestion',
      user_session: that.user_session,
      roomid: that.roomid,
      num: that.num
    };
    var msg3 = JSON.stringify(msg3);
    wx.sendSocketMessage({
      data: msg3,
    });
  }
}


Page({
  data: {
    rea:'',
    num:'',
    content:'',
    door_show: true,
    myscore_num:0,
    otscore_num:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) { 
    x = 0;
    rea = 27;
    this.user_session = app.globalData.userSession;
    this.roomid = options.roomid;
    //获取自己的头像
    var headurl = app.globalData.userData.avatarurl;
    this.setData({
      left_head: headurl,
      right_head: options.right_head,
    });

    //开大门特效
    var animationleft = wx.createAnimation({
      duration: 4000,
      timingFunction: 'ease',
      transformOrigin: '40% 50% 0',
    });
    this.animationleft = animationleft;
    animationleft.rotate3d(0, 1, 0, 105).step();
    this.setData({
      animationLeft: animationleft.export()
    });

    var animationright = wx.createAnimation({
      duration: 4000,
      timingFunction: 'ease',
      transformOrigin: '60% 50% 0',
    });
    this.animationright = animationright;
    animationright.rotate3d(0, -1, 0, 105).step();
    this.setData({
      animationRight: animationright.export()
    });

    var that = this;
    var opendoor = setTimeout(function () {
      start(that);
      clearTimeout(opendoor);
      that.setData({
        door_show: false,
      });
    }, 4000);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;

    //处理socket相关数据
    wx.onSocketMessage(function (res) {
      var data = JSON.parse(res.data);
      switch (data.cmd) {
        case "getquestion":     //获取题目
            if(rea != 27){
              rea = 0;
            }else{
              var otscore = 0;
              var content = JSON.parse(res.data)['question'];
              input_content = '';
              that.content = JSON.parse(content);
              var keyw = that.content.pop()['options'].split('');
              for (var key in data.room) {
                var room = data.room[key];
                if (room.user_session != that.user_session) {
                  otscore = room.score;
                }
              }
              that.setData({
                num: x,
                input_content: '',
                content: that.content,
                input_show: false,
                otscore: otscore * 100 / 90,
                otscore_num: otscore,
                keyword:keyw,
              });
              if(!connetcLoss){
                ready(that);
                rote(that);
              }
              
            }
          break;
        case "answer":   //获取答案
          that.setData({
            input_show: true,
            input_content: "",
            myscore: data.score * 100 / 90,
            myscore_num: data.score
          });
          if (data.answer == true) {
            wx.showToast({
              title: "+" + (27 - that.myadd) + "分",
              icon: "none",
              image: "/images/right.png",
              mask: false,
            })
          } else {
            wx.vibrateShort();
            wx.showToast({
              title: "+0" + "分",
              icon: "none",
              image: "/images/wrong.png",
              mask: true,
            });
          }
          break;
        case "getresult":
          wordFinish = true;
          wx.redirectTo({
            url: '../wordstop/wordstop?roomid=' + that.roomid
          });
          break;
      }
    });
    wx.onSocketClose(function(res){
      if (!wordFinish){
        wx.showLoading({
          title: '网络故障,重连中',
          mask: true
        })
        connetcLoss = true;
        var reConnect = setInterval(function () {
          wx.connectSocket({
            url: wssUrl + "/socket",
            success: function () {
              clearInterval(reConnect);
              wx.hideLoading();
            }
          });
        }, 1000);

        var msg = {
          cmd: 'reg',
          user_session: app.globalData.userSession,
        }
        var msg1 = JSON.stringify(msg);
        wx.onSocketOpen(function (res) {
          connetcLoss = false;//连接成功
          wx.sendSocketMessage({
            data: msg1
          });
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
    if (x > 0 && x < 5) {
      wx.showToast({
        title: "",
        icon: "none",
        image: "/images/exit.png",
        mask: true,
      })
    }
    clearTimeout(this.roteRea);
    clearTimeout(this.readyNum);
    clearTimeout(this.check);
    clearTimeout(this.countDown);
    var that = this;
    wx.request({
      url: serverUrl+"/index/Gamebusiness/exit_room",
      data: {
        user_session: this.user_session,
        roomid: this.roomid,
        count: 2,
      },
      method: "POST",
      dataType: "json",
      responseType: "text",
      success: function (res) {
      },
    })
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
  onShareAppMessage: function () {
    
  },

  checkWord: function(e){
    input_content += e.currentTarget.dataset.word;
    this.setData({
      input_content: input_content,
    });
    if(input_content.length == this.content.length){
      var myscore;
      var myadd = this.duration;
      this.myadd = myadd;
      this.setData({
        keyword: ""
      });
      var answerMsg = {
        cmd: 'answer',
        user_session: this.user_session,
        roomid: this.roomid,
        num: this.num,
        answer: input_content,
        time: 27 - this.duration,
      };
      var answer = JSON.stringify(answerMsg);
      wx.sendSocketMessage({
        data: answer,
      });
      
    }
  },
  resetIn: function(){
    input_content = '';
    this.setData({
      input_content: input_content,
    });
  },
  calIn:function(){
    input_content=input_content.substring(0, input_content.length-1);
    this.setData({
      input_content: input_content,
    });
  },
});
