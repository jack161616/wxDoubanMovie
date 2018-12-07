
// 星星的数据拆分
function convertTostarsArray(stars){
  // num代表拆分的数字
  var num = stars.substring(0,1);
  // 声明一个数组
  var StartArr = [];
  for(var i=0;i<5;i++){
    if(i< num){
      StartArr.push(1);
    }else{
      StartArr.push(0);
    }
  }
  return StartArr;
};

//定义一个http网络 请求函数
function http(url, callback) {
  wx.request({
    url: url,
    // url:"http://t.yushu.im/v2/movie/in_theaters",
    method : "GET",
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      callback(res.data)
    }
  })
};

//截取字符串长度替换
function cutTitleString(title, start, end){
  if(title.length > end){
    title = title.substring(start, end) + "...";
  }
  return title;
}

// 演员名字使用""/"分隔开
function convertToCastString(casts){
  var castsjoin = ""
  for(var dic in casts){
    castsjoin = castsjoin + casts[dic].name + "/";
  }  
  return castsjoin.substring(0,castsjoin.length-3)
  
};

// 处理演员信息：头像+名字
function converToCastArray(casts){
  var castsArray = [];
  for(var idx in casts){
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : "",
      name: casts[idx].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}

module.exports = {
  convertTostarsArrayKey:convertTostarsArray,
  http:http,
  cutTitleString:cutTitleString,
  convertToCastString: convertToCastString,
  converToCastArray: converToCastArray
}