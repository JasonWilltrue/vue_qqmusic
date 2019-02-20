<template>
  <div class="suggest-list-wrapper" ref="scrollRef">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item,index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getSingernameOrSongname(item)"></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import MScroll from "base/scroll/scroll";
import MLoadding from "base/loadding/loadding";
import { search } from "api/search";
import { createSingerSong } from "common/js/song";


const TYPE_SINGER = 'singer'
export default {
  name : 'suggestlist',
  props: {
    // 接受的检索值
    query: {
      type   : String,
      default: ''
    },
    // 是否显示歌手
    zhida: {
      type   : Boolean,
      default: true
    }
  },
  data () {
    return {
      // 当前检索页数，用于下拉加载
      page: 1,
      // 每一页的数量
      perpage: 20,
      // 接受检索结果
      result: [],
      // 标志位。是否加载完
      hasMore         : true,
      beforeScrollData: true,
      pullup          : true
    }
  },
  methods: {
    _searchKey () {
      this.page    = 1
      this.hasMore = true
      // this.$refs.scrollRef.scrollTo(0, 0)

      search(this.query, this.page, this.perpage, this.zhida).then((res) => {
        if (res.code === 0) {
          //  console.log('搜索：', res.data)
          this.result = this._formatSearch(res.data)

        }
      })
    },
    // 重组 res.data 数据
    _formatSearch (data) {
      let ret = []

      if (data.zhida && data.zhida.singerid) {
        // 解构赋值
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      console.log('ret', ret);
      return ret
    },
    // 格式化歌手信息
    _normalizeSongs (list) {
      let ret = []

      list.forEach((item) => {
        if (item.songid && item.albummid) {
          ret.push(createSingerSong(item))
        }
      })

      return ret
    },
    getIconCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getSingernameOrSongname(item){
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    }
  },
  watch: {
    query (newVal) {
      this._searchKey()
    }
  },
}
</script>

<style lang="less" scoped>
@import "~@/common/less/const.less";
@import "~@/common/less/mymixin.less";
.suggest-list-wrapper {
  height  : 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display       : flex;
      align-items   : center;
      padding-bottom: 20px;
    }
    .icon {
      flex : 0 0 30px;
      width: 30px;
      [class^="icon-"] {
        font-size: 14px;
        color    : @color-text-d;
      }
    }
    .name {
      flex     : 1;
      font-size: @font-size-medium;
      color    : @color-text-d;
      overflow : hidden;
      .text {
        .no-wrap();
      }
    }
  }
  .no-result-wrapper {
    position : absolute;
    width    : 100%;
    top      : 50%;
    transform: translateY(-50%);
  }
}
</style>