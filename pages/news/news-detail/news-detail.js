var newsDetailData = require("../../data/newsdata.js");

Page({

  data: {
    isPlayer:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    console.log(newsDetailData.initNewsDataKey[options.newsid])
    //--------将 页面详细数据返回到 页面上------
    this.setData(newsDetailData.initNewsDataKey[options.newsid])
    wx.setStorageSync('key', 'data');
    // // -------收藏动作的第一次判断---------
    // //第一次进入的时候判断是否存在本地存储以及是否收藏
    var newsCollect = wx.getStorageSync("newsCollect1");
    // 如果newsCollect存在，则代表以前收藏过或者是以前取消过收藏
    if(newsCollect){
      var newCollect = newsCollect[options.newsid];
      this.setData({
        collected:newCollect
      })
    }else{
      //第一次进入，根本不存数据
      var newsCollect = {};
      // 我把当前唯一id扔到newsCollect对象中，然后默认制定false
      newsCollect[options.newsid] = false;
      // 扔到本地存储中去
      wx.setStorageSync("newsCollect1", newsCollect);
    }
  },

  //收藏文章动作
  collectTap:function(event){
    //注意：newsCollect所有数据的集合
    var newsCollect = wx.getStorageSync('newsCollect1');
    // 注意： newCollect是当前一条数据 键值对。
    var newCollect = newsCollect[this.data.newsid];
    // 点击的时候，如果收藏取消，如果未收藏的收藏
    newCollect = !newCollect;
    // 更新到本地储存中
    newsCollect[this.data.newsid] = newCollect;
    wx.setStorageSync('newsCollect1', newsCollect);
    // 更新视图
    this.setData({
      //暂时不知道的，因为我根本不知道视图是怎么改变的
      // 传递 collected数据到 wxml文件中显示出来。
      collected:newsCollect[this.data.newsid]
    });

    // 收藏的提示框
    wx.showToast({
      title: newsCollect[this.data.newsid] ? "收藏成功" :"取消收藏",
      icon:"success",
      duration: 800,
      mask:true
    });
  },

  // collectTap: function (event) {
  //   wx.showToast({
  //     title: 'shouc ',
  //   })
  // },

  // 分享
  onShareAppMessage: function () {
    return {
      title: newsDetailData.initNewsDataKey[this.data.newsid].title,
      path: 'pages/news/news-detail/news-detail'
    }
  },

  // 点击音乐播放按键
  // playerMusicTap: function (event) {
  //   var that = this;
  //   // 播放音乐应该判断当前音乐是否在播放
  //   wx.getBackgroundAudioPlayerState({
  //     success : function(res){
  //       const status = res.status;
  //       console.log('status')
  //       console.log(status)
  //       if(status != 1){
  //         //没有在播放，则让他进入播放状态：
  //         wx.playBackgroundAudio({
  //           dataUrl: newsDetailData.initNewsDataKey[that.data.newsid].music.url,
  //           title: newsDetailData.initNewsDataKey[that.data.newsid].music.title,
  //           coverImgUrl: ""
  //         })
  //         that.setData({
  //           isPlayer:true
  //         })
  //       }else{
  //         wx.pauseBackgroundAudio();
  //         that.setData({
  //           isPlayer : false
  //         })
  //       }
  //     } 
  //   })   
  // }
  // --该接口不行，点击无反应。
  // playerMusicTap: function (event){
  //   wx.getBackgroundAudioPlayerState({
  //     success(res) {
  //       const status = res.status
  //       console.log('status')
  //       console.log(status)
  //     }
  //   })
  // }

  playerMusicTap: function (event) {
    wx.playBackgroundAudio({
      dataUrl: newsDetailData.initNewsDataKey[this.data.newsid].music.url,
      title: newsDetailData.initNewsDataKey[this.data.newsid].music.title,
      coverImgUrl: ""
    })
  } 

})