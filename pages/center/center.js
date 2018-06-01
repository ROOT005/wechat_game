// pages/center/center.js
const app = getApp()
Page({
  data: {
    level_name:'',
    lavel_img:'',
    f_rank:'',
    ticket:'',
    score:'',
    win_game:'',
    all_game:'',
    win_per:'',
    headpic:'',
    showModalStatus: false,
    level: [],
    path: app.globalData.serverUrl + '/static/images/wxpages/index',
    animationData2: {},
    animationData: {},
    n: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.getShareInfo(function (data) {
      var data = data.info
      that.data.share_title = data.title
      // console.log(data)
      that.data.share_desc = data.description
      that.data.share_img = data.img
      //console.log(that.data.share_title)
    }, 3)
  },

  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭 
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示 
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
    var n = 0;
    //连续动画需要添加定时器,所传参数每次+1就行
    setInterval(function () {
      n = (this.data.n) + 1;
      this.setData({
        n: n
      })
      if (n % 3 == 0) {
        var x = 1;
      } else if (n % 3 == 1) {
        var x = 1.03;
      } else if (n % 3 == 2) {
        var x = 1.06;
      } else {
        var x = 0.1;
      }
      this.animation.scale(x, x).step()
      this.setData({
        animationData2: this.animation.export()
      })
    }.bind(this), 300)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    var that = this
    wx.request({
      url: app.globalData.serverUrl+'/index/index/getUserCenter',
      data: { user_session: app.globalData.userSession},
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        var data = res.data
        var level = res.data.alllevel
        console.log(res.data.alllevel)
        if (data['userdata']['all_game']==0){
          that.setData({
            headpic: data['userdata']['avatarurl'],
            level_name: data['level']['name'],
            level_img: data['level']['img'],
            f_rank: data['f_rank'],
            ticket: data['userdata']['ticket'],
            score: data['userdata']['score'],
            win_game: data['userdata']['win_game'],
            all_game: data['userdata']['all_game'],
            win_per: 0,
            level: level
          })
        }else{
        that.setData({
          headpic:data['userdata']['avatarurl'],
          level_name: data['level']['name'],
          level_img: data['level']['img'],
          f_rank: data['f_rank'],
          ticket: data['userdata']['ticket'],
          score: data['userdata']['score'],
          win_game: data['userdata']['win_game'],
          all_game: data['userdata']['all_game'],
          win_per: (data['userdata']['win_game'] / data['userdata']['all_game']*100).toFixed(2),
          level: level
        })
      }
      }
    })
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
  onShareAppMessage: function () {
    if (this.data.share_img != null) {
      return {
        title: this.data.share_title == null ? '汉字荣耀' : this.data.share_title,
        desc: this.data.share_desc == null ? '汉字荣耀' : this.data.share_desc,
        path: '/pages/center/center',
        //imageUrl: this.data.share_img == null ? null : this.data.share_desc,
      }
    } else {
      return {
        title: this.data.share_title == null ? '汉字荣耀' : this.data.share_title,
        desc: this.data.share_desc == null ? '汉字荣耀' : this.data.share_desc,
        path: '/pages/center/center',
        imageUrl: this.data.share_img == null ? null : this.data.share_desc,
      }
    }

  },

  suggest:function(){
    wx.navigateTo({
      url:  '../../pages/message/message',
    })
  },
  return:function(){
    wx.navigateTo({
      url: '../../pages/main/main',
    })
  }
})
