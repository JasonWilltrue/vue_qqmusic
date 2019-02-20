<template>
  <m-scroll
                                class         = "suggest-list-wrapper"
                                ref           = "scrollRef"
                              :data           = "result"
                              :pullup         = "pullup"
                              :beforeScroll   = "beforeScrollData"
                                @scrollToEnd  = "searchMore"
                                @beforeScroll = "beforeScroll"
  >
    <ul class="suggest-list">
      <li
                                    class  = "suggest-item"
                                    v-for  = "(item,index) in result"
                                  :key     = "index"
                                    @click = "selectItem(item)"
      >
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getSingernameOrSongname(item)"></p>
        </div>
      </li>
      <m-loadding v-show="hasMore" title></m-loadding>
    </ul>
    <!-- 无数据组件 -->
    <div class="no-result-wrapper" v-if="!hasMore && !result.length">
      <no-result></no-result>
    </div>
  </m-scroll>
</template>

<script>
import MScroll from "base/scroll/scroll";
import MLoadding from "base/loadding/loadding";
import NoResult from "base/no-result/noresult";
import { search } from "api/search";
import { createSingerSong } from "common/js/song";
import { Singer } from 'common/js/singerClass'
import { mapMutations,mapActions } from "vuex";
const TYPE_SINGER = 'singer'
export default {
  name      : 'suggestlist',
  components: {
    MScroll,
    MLoadding,
    NoResult
  },
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
      beforeScrollData: true,   //触发键盘手拢事件
      pullup          : true    //开启上啦刷新
    }
  },
  methods: {
     // vuex
    ...mapMutations({
      'setSinger': 'SET_SINGER'
    }),
    ...mapActions(['insertSong']),
    _searchKey () {
      this.page    = 1
      this.hasMore = true
      this.$refs.scrollRef.scrollTo(0, 0)  //回到顶部

      search(this.query, this.page, this.perpage, this.zhida).then((res) => {
        if (res.code === 0) {
          //  console.log('搜索：', res.data)
          this.result = this._formatSearch(res.data)
          this._checkMore(res.data)
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
    getSingernameOrSongname (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    searchMore () {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.perpage, this.zhida).then((res) => {
        if (res.code === 0) {
          this.result = this.result.concat(this._formatSearch(res.data))
          // 检查是否有更多数据
          this._checkMore(res.data)
        }
      })
    },
    _checkMore (data) {
      let song = data.song
      console.log('总歌曲：' + song.totalnum + "当前数量：" + (song.curnum + song.curpage * this.perpage));
      // 没有数据或最后一页   当前条目 + 当前页数 * 每页数据 > 总数量
      if (!song.list.length || (song.curnum + song.curpage * this.perpage) > song.totalnum) {
        this.hasMore = false
      }
    },
    selectItem(item){
      if (item.type === TYPE_SINGER) {
        let singer = new Singer({
          id  : item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        // 使用vuex
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      // this.$emit('select')
    },
    // 滚动前触发事件
    beforeScroll() {
      this.$emit('beforeScroll')
    },
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