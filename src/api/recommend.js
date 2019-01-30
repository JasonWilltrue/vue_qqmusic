import jsonp from 'common/js/jsonp'
import {
  commonParams,
  opts,
  ERROR_OK
} from './config'
import axios from 'axios'
/**
 * jsonp 抓取推荐页轮播图数据
 * 接口：https:   //c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg
 */
export function getRecommend() {
  let url  = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  let data = Object.assign({}, commonParams, {
    platform   : 'H5',
    uin        : 0,
    needNewCode: 1
  })
  return jsonp(url, data, opts)
}

/**
 * axios 抓取推荐页列表数据
 * 接口：https        :          //c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg
 * 接口提供方使用了 referer: https:   //y.qq.com/portal/playlist.html
 * axios 结合 node.js 代理后端请求
 */
export function getDiscList() {
  let url  = '/api/getDiscList'
  let data = Object.assign({}, commonParams, {
    rnd        : Math.random(),
    hostUin    : 0,
    format     : 'json',
    platform   : 'yqq',
    needNewCode: 0,
    categoryId : 10000000,
    sortId     : 5,
    sin        : 0,
    ein        : 29
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  }).catch(e => {
    console.log(e)
  })
}
