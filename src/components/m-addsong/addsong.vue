<!--
 * @Author      : Jerrychan
 * @LastEditors : Jerrychan
 * @Description : 添加歌曲页面组件
 * @Date        : 2019-03-02 23: 49: 58
 * @LastEditTime: 2019-03-12 22: 52: 01
 -->
<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <!-- 头部 -->
      <div class="header">
        <h1 class="title">添加歌曲到队列</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <!-- 搜索框 -->
      <div class="search-box-wrapper">
        <search-box ref="searchBoxRef" @query="onQueryChange" placeholder="搜索歌曲"></search-box>
      </div>
      <!-- 切换及其内容 -->
      <div class="shortcut" v-show="!query">
        <m-switch :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></m-switch>
        <div class="list-wrapper">
          <!-- 最近播放 -->
          <m-scroll
                                  ref   = "songListRef"
                                  v-if  = "currentIndex === 0"
                                  class = "list-scroll"
                                :data   = "playHistory"
          >
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </m-scroll>
          <!-- 搜索历史 -->
          <m-scroll
                                  class       = "list-scroll"
                                :refreshDelay = "refreshDelay"
                                  ref         = "searchListRef"
                                  v-if        = "currentIndex === 1"
                                :data         = "searchHistory"
          >
            <div class="list-inner">
              <search-list @delete="delHistory" @select="addQuery" :searches="searchHistory"></search-list>
            </div>
          </m-scroll>
        </div>
      </div>
      <!-- 搜索历史 -->
      <div class="search-result" v-show="query">
        <suggest :query="query" :zhida="zhida" @select="savaHis" @beforeScroll="blurInput"></suggest>
      </div>
      <top-tip ref="topTipRef">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
import MScroll from "base/scroll/scroll";
import SearchBox from 'base/searchbox/searchbox';
import SongList from "base/songlist/songlist";
import SearchList from "base/searchlist/searchlist";
import TopTip from "base/toptip/toptip";
import Suggest from 'components/m-suggestlist/suggestlist'
import MSwitch from "components/m-switch/switch";
import { mapActions, mapGetters } from "vuex";
import Song from 'common/js/song.js'
export default {
  name      : 'addsong',
  components: {
    MScroll,
    SearchBox,
    Suggest,
    TopTip,
    MSwitch,
    SongList,
    SearchList
  },
  data () {
    return {
      showFlag: false,
      // 搜索词
      query: '',
      // 不搜索歌手
      zhida: false,
      // 切换开关文案
      switches: [
        { name: '最近播放' },
        { name: '搜索历史' }
      ],
      // 当前切换开关
      currentIndex: 0,
      refreshDelay: 100
    }
  },
  methods: {
    ...mapActions(['saveHistory', 'delHistory', 'insertSong']),
    // 保存搜索结果历史到 vuex 和 localstorage 中
    show () {
      this.showFlag = true
      //解决页面一进入之后列表无法滚动（没有重新出发计算）
       setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.songListRef.refresh()
        } else {
          this.$refs.searchListRef.refresh()
        }
      }, 20)
    },
    hide () {
      this.showFlag = false
    },
    // 当检索值改变时
    onQueryChange (query) {
      this.query = query
    },
    //点击之后保存历史中
    savaHis () {
      this.saveHistory(this.query)
      this.$refs.topTipRef.show()
    },
    // 滚动前触发事件
    blurInput () {
      this.$refs.searchBoxRef.blur()
    },
    //切换tab
    switchItem (index) {
      this.currentIndex = index
    },
    selectSong (song, index) {
      if (index !== 0) {
        //不能直接用song 是从缓存里面取的  需要引用song这个类的实例
        console.log(new Song(song));
        this.insertSong(new Song(song))
      }
      this.$refs.topTipRef.show()
    },
    addQuery (k) {
      this.$refs.searchBoxRef.getQuery(k)
    },
  },
  computed: {
    ...mapGetters(['searchHistory', 'playHistory'])
  },
}
</script>

<style lang="less" scoped>
@import "~@/common/less/const.less";
@import "~@/common/less/mymixin.less";

.add-song {
  position  : fixed;
  top       : 0;
  bottom    : 0;
  width     : 100%;
  z-index   : 200;
  background: @color-background;
  &.slide-enter-active,
  &.slide-leave-active {
    transition: all 0.3s;
  }
  &.slide-enter,
  &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .header {
    position  : relative;
    height    : 44px;
    text-align: center;
    .title {
      line-height: 44px;
      font-size  : @font-size-large;
      color      : @color-text;
    }
    .close {
      position: absolute;
      top     : 0;
      right   : 8px;
      .icon-close {
        display  : block;
        padding  : 12px;
        font-size: 20px;
        color    : @color-theme;
      }
    }
  }
  .search-box-wrapper {
    margin: 20px;
  }
  .shortcut {
    .list-wrapper {
      position: absolute;
      top     : 165px;
      bottom  : 0;
      width   : 100%;
      .list-scroll {
        height  : 100%;
        overflow: hidden;
        .list-inner {
          padding: 20px 30px;
        }
      }
    }
  }
  .search-result {
    position: fixed;
    top     : 124px;
    bottom  : 0;
    width   : 100%;
  }
  .tip-title {
    text-align: center;
    padding   : 18px 0;
    font-size : 0;
    .icon-ok {
      font-size   : @font-size-medium;
      color       : @color-theme;
      margin-right: 4px;
    }
    .text {
      font-size: @font-size-medium;
      color    : @color-text;
    }
  }
}
</style>