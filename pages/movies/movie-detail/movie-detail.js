var app = getApp();
var utils = require("../../util/utils.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //页面初始化，options为页面跳转所带来的参数
    console.log("test");
    var test_list = ["a","b","c"];
    var test_string = test_list.toString();
    console.log(test_string);
    var movieId = options.movieid;
    // url地址
    var detailMovieUrl = app.globalUrl.doubanUrl + "v2/movie/subject/" + movieId;
    utils.http(detailMovieUrl, this.callback);
  },

  callback:function(data){
    console.log("电影详细信息")
    console.log(data)
    /**
     * 1. 电影图片：images
     * 2. 制片国家/地区：countries
     * 3.电影名称：title
     * 4.整体名称：original_title
     * 5.想看人数：wish_count
     * 6.短评数量：comments_count
     * 7.年代：year
     * 8.电影类型：genres
     * 9.评星：stars=rating.stars
     * 10:评分： score=rating.average
     * 11.导演：director
     * 12.主演：casts
     * 13.主演信息：castsInfo  ,,这边只放图片 
     * 14.简介：summary
     */

    // 在整理数据前，需要对字段进行判断，因为有些字段可能没有
    if(!data){
      return;
    };

    // 导演信息处理
    var director = {
      avatar:"",
      name:"",
    }
    if(data.directors[0]!=null){
      if(data.directors[0].avatars != null){
        director.avatar = data.directors[0].avatars.large;
      }
      director.name = data.directors[0].name;
    }

    var temp = {
      movieImg : data.images.large,
      country : data.countries.toString(),
      title:data.title,
      original_title: data.original_title,
      wishCount: data.wish_count,
      commentsCount: data.comments_count,
      year:data.year,
      genres:data.genres,
      stars: utils.convertTostarsArrayKey(data.rating.stars),
      score:data.rating.average,
      director: director,
      casts: utils.convertToCastString(data.casts),
      castsInfo: utils.converToCastArray(data.casts),
      summary:data.summary,
      // 针对于评价的星星的显示路径问题
      movieMoreCondition: true
    }
    console.log("temp");
    console.log(temp);
    this.setData({
      movie:temp
    })
    
    wx.setNavigationBarTitle({
      title: utils.cutTitleString(this.data.movie.title, 0, 6)
    })
  },

   

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})