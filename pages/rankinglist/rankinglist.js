//ceshi.js
//获取应用实例
const app = getApp();
var pageno = 1;
var pagesize = 20;
var active = [];
var dengji = '';
var end = 20;
Page({
  data: {
    listTab: [
      { "code": "1", "text": "好友排行" },
      { "code": "2", "text": "总排行" },
      { "code": "3", "text": "省排行" },
      // { "code": "4", "text": "市排行" },
    ],
    ranklist: [],
    curIndex: 0,
    // curText: null,
    scrollLength: 0,
    path: app.globalData.serverUrl + '/static/images/wxpages/rankinglist',
  },
  //初始化数据
  initData: function (index) {
    var that = this
    this.setData({
      curIndex: index,
      curText: that.data.listTab[index].text,
    })
  },
  //tab点击事件，刷新数据
  reflashData: function (event) {
    var that = this
    wx.request({
      url: app.globalData.serverUrl + "/index/rank/getRank",
      method: "GET",
      header: {
        "content-type": "application/json"
      },
      data: {
        type: event.currentTarget.id,
        user_session: app.globalData.userSession//wx.getStorageSync('user_session'),
      },
      success: function (res) {
        var caseContent = res.data.data
        for (var ins in caseContent) {     
            var level = caseContent[ins].level
            var dengji = active[level]['name']
            caseContent[ins]['dengji'] = active[level]['id']
            caseContent[ins]['newimg'] = active[level]['image']
          
        }
        var avatarUrl = app.globalData.userData.avatarurl
        var nickname = app.globalData.userData.nickname
        //2018 ztf
        that.caseContent = caseContent;
        var caseNew = caseContent.slice(0, end);
        that.setData({
          ranklist: caseNew,
          avatarUrl: avatarUrl,
          nickname: nickname,
        });
      }
    });

    var index = event.currentTarget.dataset.index
    //移动滚动条,//200和35是我估算的
    // if (index > this.data.curIndex) {
    //   if (that.data.scrollLength < 148) {
    //     this.setData({
    //       scrollLength: that.data.scrollLength + 160 * (index - that.data.curIndex)
    //     })
    //   }
    // } else {
    //   if (that.data.scrollLength > 0) {
    //     this.setData({
    //       scrollLength: that.data.scrollLength - 160 * (that.data.curIndex - index)
    //     })
    //   }
    // }
    //移动view位置，改变选中颜色
    this.initData(index)


  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo, userSession, userData) {
      //更新数据
      app.globalData.userSession = userSession
      app.globalData.userData = userData
      app.globalData.userInfo = userInfo
    })

    this.initData(0)

    wx.request({
      url: app.globalData.serverUrl + "/index/rank/getRank",
      method: "GET",
      header: {
        "content-type": "application/json"
      },
      data: {
        type: 1,
        user_session: app.globalData.userSession//wx.getStorageSync('user_session'),
      },
      success: function (res) {

        active = res.data.level
        var caseContent = res.data.data
        for (var ins in caseContent){
          var level = caseContent[ins].level
          var dengji = active[level]['name']
          caseContent[ins]['dengji'] = active[level]['id']
          caseContent[ins]['newimg'] = active[level]['image']

        }
        var avatarUrl = app.globalData.userData.avatarurl
        var nickname = app.globalData.userData.nickname
    
        that.caseContent = caseContent;
        var caseNew = caseContent.slice(0,end);
        that.setData({
          ranklist: caseNew,
          avatarUrl: avatarUrl,
          nickname: nickname,
          level: dengji,
        });
      }
    });
    app.getShareInfo(function (data) {
      var data = data.info
      that.data.share_title = data.title
      console.log(data)
      that.data.share_desc = data.description
      that.data.share_img = data.img
      //console.log(that.data.share_title)
    }, 6)
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  reloadNew: function () {
    end +=20;
    var caseNew = this.caseContent.slice(0,end);
    this.setData({
      ranklist: caseNew,
    })
  },
  bindViewLevel: function () {
    wx.navigateTo({
      url: '../level/level'
    })
  },
  share: function (options) {
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
  // 再次挑战
  challent: function () {
    wx.navigateTo({
      url: '../fightroom/fightroom'
    })
  }

})
