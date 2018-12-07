var app = getApp();
var utils = require("../util/utils.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    comingSoon:[],
    inTheaters:[],
    Top250:[],
    searchData:[],
    containerShow:true,
    searchPanelShow:false,
    currentTime:0,
    tempTime:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var inTheaters = app.globalUrl.doubanUrl +"v2/movie/in_theaters?start=0&count=3";
    var comingSoon = app.globalUrl.doubanUrl +"v2/movie/coming_soon?start=0&count=3";
    var Top250 = app.globalUrl.doubanUrl +"v2/movie/coming_soon?start=0&count=3";

    this.http(inTheaters,  this.callback, "inTheaters","正在热映");
    this.http(comingSoon, this.callback, "comingSoon","即将上映");
    this.http(Top250, this.callback, "Top250","排行榜");
    wx.showNavigationBarLoading();
  },

  //定义一个http函数
  /**
   * url:请求地址
   * callback:数据回调函数
   * category:请求的数据类型
   * categoryName:类型的标题
   * 
   */
  http: function (url, callback, category,categoryName){
    wx.request({
      url: url,
      // url:"http://t.yushu.im/v2/movie/in_theaters",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success : function(res){
        callback(res.data, category, categoryName)
      }        
    })
  },
  
  // 定义一个callback函数
  callback: function (res, category, categoryName){
    console.log(res);
    // 处理数据 数据的过滤存储
    /** 
     * 
    1.大图
    2.标题
    3.星星
    4.评分
    5.id
    */

    var movies = [];
    // 遍历网络请求数据
    for (var idx in res.subjects){
      var subject = res.subjects[idx];
      console.log(idx)
      console.log(subject)
      var title = subject.title;
      // 名字过长处理一下
      if (title.length >= 6){
        title = title.substring(0,6) + '....';
      }
      // 每一部单独电影信息
      var temp = {
        title : title,
        coverageUrl : subject.images.large,
        star: utils.convertTostarsArrayKey(subject.rating.stars),
        average : subject.rating.average,
        movieid : subject.id,
        movieMoreCondition:false
      };
      // 每三部一个组合的电影集合
      movies.push(temp);
      // console.log('')
    }

    //问题：因为类型不同  readyData = {'comingSoon': xxxx}
    var readyData = {};
    readyData[category] = {
      movies:movies,
      categoryName: categoryName

    }
    console.log("readyData");
    console.log(readyData);
    // 更新数据
    this.setData(readyData);
    wx.hideNavigationBarLoading();
  },

  // 跳转到更多页面
  movieMoreTap:function(event){
    console.log('event')
    console.log(event)
    var categoryName = event.currentTarget.dataset.categoryname;
    wx.navigateTo({
      url: 'movie-more/movie-more?categoryname='+categoryName,
    })
  },

  // 跳转到电影详细页面
  goMovieDetail: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    console.log('movied')
    console.log(movieId)
    wx.navigateTo({
      url: 'movie-detail/movie-detail?movieid=' + movieId,
    })
  },

  onBindFocus:function(event){
    this.setData({
      containerShow:false,
      searchPanelShow:true
    })
  },

  onBindBlur:function(event){
    var time = new Date().getTime();
    // 网络请求
    // 获取用户输入信息
    var text = event.detail.value;
    //确定url
    var searchUrl = app.globalUrl.doubanUrl + "/v2/movie/search?q=" + text;
    this.http(searchUrl, this.callback, "searchData", "");
    wx.showNavigationBarLoading();
  },

  onCancelImgTap:function(event){
    this.setData({
      containerShow:true,
      searchPanelShow:false
    })
  }
  
})