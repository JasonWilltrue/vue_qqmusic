const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router     = require('koa-router')();
const static     = require("koa-static");
const app        = new Koa();
const axios      = require('axios');

app.use(bodyParser());
app.use(router.routes());

// 配置静态资源
app.use(static(__dirname + "/dist", {
  extensions: ['html']
}));

//=======================路由请求========================
router.get('/api/getDiscList', function (ctx, next) {
    let url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
    axios.get(url, {
      headers: {
        referer: 'https://c.y.qq.com/',
        host   : 'c.y.qq.com'
      },
      params: ctx.query
    }).then(response=>{
       console.log(response.data);
       response.data;
    }).catch(e => {
      console.log(e)
    })
  }),
  router.get('/api/getLyric', function (ctx, next) {
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
      JSON.stringify(result)
    }).catch(e => {
      console.log(e)
    })
  });
router.get('/api/getSongList', function (ctx, next) {
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
    JSON.stringify(ret)
  }).catch((e) => {
    console.log(e)
  })
});
router.get('/api/getRankDetail', function (ctx, next) {
  var url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/',
      host   : 'c.y.qq.com'
    },
    params: ctx.query
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
    JSON.stringify(ret)
  }).catch((e) => {
    console.log(e)
  })
});
// 搜索请求
router.get('/api/search', function (ctx, next) {
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

app.listen(9000, function () {
  console.log('http://localhost:9000');

})
