import jsonp from 'common/js/jsonp'
import {
  commonParams,
  opts,
  ERROR_OK
} from './config'
import axios from 'axios'


/**
 * jsonp 抓取热门搜索数据
 * 接口：https : //c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg
 * 提供方：https: //m.y.qq.com/#search
 */
export function getHotKey() {
  let url  = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  let data = Object.assign({}, commonParams, {
    uin        : 0,
    format     : 'json',
    platform   : 'h5',
    needNewCode: 1
  })
  return jsonp(url, data, opts)
}