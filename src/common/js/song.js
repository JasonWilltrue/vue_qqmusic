import {
  getLyric
} from 'api/song.js'
import {
  Base64
} from 'js-base64'


export default class Song {
  constructor({
    id,
    mid,
    singer,
    name,
    album,
    duration,
    image,
    url
  }) {
    this.id       = id;
    this.mid      = mid;
    this.singer   = singer;
    this.name     = name;
    this.album    = album;
    this.duration = duration;
    this.image    = image;
    this.url      = url;
  }
  // 获取歌词数据
  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (res.retcode === 0) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }




}

/**
 * http:   //dl.stream.qqmusic.qq.com/C400000Qepff3UyUWO.m4a?guid=8099968804&vkey=1074F9F6424BA4F4FA45164027E973E726F36F2F2510B2AE56BB9E04EB3A754F9E95E73F215EEAE7A17474A5D7741B37912222C18C7113A4&uin=0&fromtag=38
 *
 * @export
 * @param {*} musicData
 * @returns
 */
export function createSingerSong(musicData) {
  return new Song({
    id      : musicData.songid,
    mid     : musicData.songmid,
    singer  : filterSinger(musicData.singer),
    name    : musicData.songname,
    album   : musicData.albumname,
    duration: musicData.interval,
    image   : `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // url     : `http://10.151.0.22:9999/dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?fromtag=66`
    // url: `https://thirdparty.gtimg.com/${musicData.songid}.m4a?fromtag=38`(不可用)
    // url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=66`
    // url: `http://dl.stream.qqmusic.qq.com/C400001Qu4I30eVFYb.m4a?guid=8099968804&vkey=F63C8745AC504384DC75622203EBD2B143322D9A95F3C112FE44DBA59F1516E9B7589C5DC530AF4F418FF37CF5D905CCCF2CCD9A8CA2004E&uin=0&fromtag=38`
    url: `https://api.bzqll.com/music/tencent/url?key=579621905&id=${musicData.songmid}&br=320`
  })
}

// 处理 musicData.singer 数组，使其变为一个字符串
export function filterSinger(singer) {
  let result = []

  if (!singer) {
    return ''
  }

  singer.forEach((item) => {
    result.push(item.name)
  })

  return result.join(' / ')
}
