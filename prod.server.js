// 测试 dist
// 利用 Express 起一个本地测试服务器

var express = require('express')
// var config  = require('./config/index')
var axios = require('axios')
/**
 * 1、 res.json([body])
 发送一个json的响应。 这个方法和将一个对象或者一个数组作为参数传递给res.send() 方法的效果相同。 不过， 你可以使用这个方法来转换其他的值到json， 例如null， undefined。(虽然这些都是技术上无效的JSON)。
 res.json(null);
 res.json({
   user: 'tobi'
 });
 res.status(500).json({
   error: 'message'
 });
 */
var app = express()

// axios 结合 node.js 代理后端请求
var apiRoutes = express.Router()
apiRoutes.get('/getDiscList', function (req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

  axios.get(url, {
      headers: {
        referer: 'https://c.y.qq.com/',
        host   : 'c.y.qq.com'
      },
      params: req.query
    })
    .then(function (response) {
      res.json(response.data)
    })
    .catch(function (error) {
      console.log(error)
    })
})
// 获取歌词
apiRoutes.get('/getLyric', function (req, res) {
  let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host   : 'c.y.qq.com'
    },
    params: req.query
  }).then(response => {
    // jsonp 数据转为 json 数据
    var result = response.data

    if (typeof result === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = result.match(reg)

      if (matches) {
        result = JSON.parse(matches[1])
      }
    }
    res.json(result)
  // JSON.stringify(result)
  
  }).catch(e => {
    console.log(e)
  })
});
// 获取歌曲列表
apiRoutes.get('/getSongList', function (req, res) {
  var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/',
      host   : 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    // jsonp 数据转为 json 数据
    var ret = response.data
    if (typeof ret === 'string') {
      // var reg = /^\w+\(({[^()]+})\)$/
      var reg     = /{.*}/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[0])
      }
    }
    res.json(ret);
    // JSON.stringify(ret)
  }).catch((e) => {
    console.log(e)
  })
});
// 获取排名详情
apiRoutes.get('/getRankDetail', function (req, res) {
  var url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/',
      host   : 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    // jsonp 数据转为 json 数据
    var ret = response.data
    if (typeof ret === 'string') {
      // var reg = /^\w+\(({[^()]+})\)$/
      var reg     = /{.*}/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[0])
      }
    }
    res.json(ret)
    // JSON.stringify(ret)
  }).catch((e) => {
    console.log(e)
  })
});

// 搜索请求
apiRoutes.get('/search', function (req, res) {
  var url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/',
      host   : 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    // jsonp 数据转为 json 数据
    var ret = response.data
    if (typeof ret === 'string') {
      // var reg = /^\w+\(({[^()]+})\)$/
      var reg     = /{.*}/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[0])
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
});






app.use('/api', apiRoutes)

app.use(express.static('./dist'))

// var port = process.env.PORT || config.build.port

module.exports = app.listen(9000, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + 9000 + '\n')
})
