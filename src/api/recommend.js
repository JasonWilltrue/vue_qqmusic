import jsonp from 'common/js/jsonp';
import {commonParams,opts,ERROR_OK} from './config'
/**
 * jsonp 抓取推荐页轮播图数据
 * 接口：https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg
 */

export function getRecommend() {
	let url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
	let data = Object.assign({},commonParams,{
		platform:'H5',
		uin:0,
		needNewCode:1
	})
	return jsonp(url,data,opts)
}
