var app = getApp();
var utils = require("../../util/utils.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies:[],
    totalCount:0,
    totalMovies:[],
    isEmpty:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    var categoryName = options.categoryname;
    this.setData({
      categoryName: categoryName
    })
    var publicUrl = app.globalUrl.doubanUrl;
    var allUrl = "";
    switch (options.categoryname){
      case "即将上映":
        console.log("即将上映");
        allUrl = publicUrl + "v2/movie/coming_soon";
        break;
      case "正在热映":
        allUrl = publicUrl + "v2/movie/in_theaters";
        break;
      case "排行榜":
        allUrl = publicUrl + "v2/movie/top250"
        break; 
    }
    this.setData({
      allUrl:allUrl
    })
    // 进行网络请求数据
    utils.http(allUrl,this.callback);
    // 在当前页面显示导航条加载动画
    wx.showNavigationBarLoading();
  },

  //下拉刷新
  onPullDownRefresh:function(){
    var refreshUrl = this.data.allUrl;
    // 防止 重复数据，因此将置空
    this.data.totalMovies = [];
    this.data.isEmpty = true;
    utils.http(refreshUrl,this.callback);
  },

  // 上拉加载
  onReachBottoms:function(event){
    // 上拉刷新的url需要变化 1：start :0 , 2 start:20  3  start:40  count=20
    var nextUrl = this.data.allUrl+"?start="+this.data.totalCount+"&count=20";
    utils.http(nextUrl,this.callback);
  },

  // 进行网络请求的回调函数
  callback:function(res){
    console.log(res);
    var movies = [];
    // 遍历网络请求数据
    for (var idx in res.subjects) {
      var subject = res.subjects[idx];
      console.log(idx)
      console.log(subject)
      var title = subject.title;
      // 名字过长处理一下
      if (title.length >= 6) {
        title = title.substring(0, 6) + '....';
      }
      // 每一部单独电影信息
      var temp = {
        title: title,
        coverageUrl: subject.images.large,
        star: utils.convertTostarsArrayKey(subject.rating.stars),
        average: subject.rating.average,
        movieid: subject.id,
        // 针对于评价的星星的显示路径问题
        movieMoreCondition:true
      };
      // 每三部一个组合的电影集合
      movies.push(temp);
    }

    var totalMovies = [];
    /** 
    concat:合并数组
    是不是第一次进入，第一次进入是不需要累加的
    非第一次进入的时候累加
    */
    if(!this.data.isEmpty){
      //非第一次进入  以前更新到data中的movies刚刚获取的movies
      totalMovies = this.data.movies.concat(movies);
    }else{
      //第一次进入
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    console.log("totalMovies")
    console.log(totalMovies)
    this.setData({
      movies:totalMovies
    })
    this.data.totalCount += 20;
    // 隐藏导航条加载动画
    wx.hideNavigationBarLoading();
  },

  // 设置导航条
  onReady:function(){
    wx.setNavigationBarTitle({
      title: this.data.categoryName,
    })
  },

  goMovieDetail:function(event){
    var movieId = event.currentTarget.dataset.movieid;
    console.log('movied')
    console.log(movieId)
    wx.navigateTo({
      url: '../movie-detail/movie-detail?movieid='+movieId,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})