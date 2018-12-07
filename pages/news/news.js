// pages/news/news.js

//引入
var newsData = require("../data/newsdata.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrls:[
      "../images/banner1.jpg",
      "../images/banner2.jpg",
      "../images/banner3.jpg"
    ],
    content:"时尚新闻内容",
    indicatorDots:true,
    autoplay:true,
    interval:2000,
    circular:true,
    userData: "",

    test:[{init:3333}],
    test2:{init2:4444}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //页面初始化options为页面跳转所带来的参数

    //this。setData可以让view重绘
    this.setData({
      userData: newsData.initNewsDataKey
    })
  },

  // 跳转到详情页面
  goToNewsDetail: function (event) {
    console.log(event);
    var newsId = event.currentTarget.dataset.newsid;
    wx.navigateTo({
      url: 'news-detail/news-detail?newsid=' + newsId,
    })
  }

})