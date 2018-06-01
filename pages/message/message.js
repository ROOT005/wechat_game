// pages/message/message.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mesvalue:'',
    radiovalue:0,
    items: [
      { name: '1', value: '我要吐槽'},
      { name: '2', value: '功能建议' },
      { name: '3', value: '交互建议' },
      { name: '4',value: 'bug反馈' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    app.getUserInfo(function (userInfo, userSession, userData) {
      //更新数据
      app.globalData.userSession = userSession
      console.log(app.globalData.userSession)
    }
    )
    var that = this
    app.getShareInfo(function (data) {
      var data = data.info
      that.data.share_title = data.title
      console.log(data)
      that.data.share_desc = data.description
      that.data.share_img = data.img
      //console.log(that.data.share_title)
    }, 5)
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
  onShareAppMessage: function () {
    if (this.data.share_img != null) {
      return {
        title: this.data.share_title == null ? '汉字荣耀' : this.data.share_title,
        desc: this.data.share_desc == null ? '汉字荣耀' : this.data.share_desc,
        path: '/pages/message/message',
        //imageUrl: this.data.share_img == null ? null : this.data.share_desc,
      }
    } else {
      return {
        title: this.data.share_title == null ? '汉字荣耀' : this.data.share_title,
        desc: this.data.share_desc == null ? '汉字荣耀' : this.data.share_desc,
        path: '/pages/message/message',
        imageUrl: this.data.share_img == null ? null : this.data.share_desc,
      }
    }
  },
  charChange: function (e) {
    this.setData({
      mesvalue: e.detail.value
    })
  },
  radiochange:function(e){
    this.setData({
      radiovalue:e.detail.value
    })
  },
  submes:function(){
    var that = this
    if (!that.data.mesvalue) {
      wx.showToast({
        title: '请输入您的建议',
        icon: 'none',
        duration: 2000
      })
    } else if (!that.data.radiovalue){
      wx.showToast({
        title: '请选择建议类型',
        icon: 'none',
        duration: 2000
      })
    }else{
      console.log(that.data.radiovalue)
    wx.request({
      url: app.globalData.serverUrl + '/index/index/suggest',
      data: { user_session: app.globalData.userSession, comment: that.data.mesvalue, type: that.data.radiovalue},
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        if(res.data.status){
          wx.showToast({
            title: res.data.info,
            icon:'success',
            duration:2000
          })
          var total_micro_second = 1;
          setTimeout(function () {
            total_micro_second = total_micro_second-1;
            if (total_micro_second == 0) {
              wx.redirectTo({
                url: '../../pages/main/main',
              })
            }
          }, 1000)
          
          
        }else{
          wx.showToast({
            title: res.data.info,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
    }
  }
})