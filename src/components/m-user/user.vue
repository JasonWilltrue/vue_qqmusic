// 个人中心组件
<template>
  <transition name="slide">
    <div class="userWrapper">
      <!-- 头部布局 -->
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <m-switch :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></m-switch>
      </div>
      <!-- 按钮布局 -->
      <div ref="playBtn" class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <!-- 两个列表 -->
      <div class="list-wrapper" ref="listWrapper">
        <!-- 我的收藏 -->

        <!-- 最近播放 -->
        <m-scroll ref="playListRef" class="list-scroll" v-if="currentIndex===1" :data="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </m-scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
           <no-result></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import MScroll from "base/scroll/scroll";
import MSwitch from "components/m-switch/switch";
import Song from 'common/js/song.js'
import NoResult from "base/no-result/noresult";
import SongList from "base/songlist/songlist";
export default {
  name: "user",
  data () {
    return {
      // 切换开关文案
      switches: [
        { name: '我喜欢的' },
        { name: '最近听的' }
      ],
      // 当前切换开关
      currentIndex: 0,
      refreshDelay: 100
    }
  },
  methods: {
    ...mapActions(['saveHistory', 'delHistory', 'insertSong','randomPlay']),
    switchItem (index) {
      this.currentIndex = index
    },
    selectSong (song) {
      this.insertSong(new Song(song))
    },
    back () {
      this.$router.back()
    },
    random() {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
          list = list.map((song) => {
        return new Song(song)
      })
      //随机播放事件
      this.randomPlay({list})
    },
  },
  computed: {
      ...mapGetters(['playHistory']),
    noResult() {
      //判断如果历史记录无数据
      if (this.currentIndex === 1) {
        return !this.playHistory.length
      }
    }
  },
  components: {
    MSwitch, 
    MScroll,
    SongList,
    Song,
    NoResult,
  },
}
</script>

<style lang="less" scoped>
@import "~@/common/less/const.less";
@import "~@/common/less/mymixin.less";

.userWrapper {
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
  .back {
    position: absolute;
    top     : 0;
    left    : 6px;
    z-index : 50;
    .icon-back {
      display  : block;
      padding  : 10px;
      font-size: @font-size-large-x;
      color    : @color-theme;
    }
  }
  .switches-wrapper {
    margin: 10px 0 30px 0;
  }
  .play-btn {
    box-sizing   : border-box;
    width        : 135px;
    padding      : 7px 0;
    margin       : 0 auto;
    text-align   : center;
    border       : 1px solid @color-text-l;
    color        : @color-text-l;
    border-radius: 100px;
    font-size    : 0;
    .icon-play {
      display       : inline-block;
      vertical-align: middle;
      margin-right  : 6px;
      font-size     : @font-size-medium-x;
    }
    .text {
      display       : inline-block;
      vertical-align: middle;
      font-size     : @font-size-small;
    }
  }
  .list-wrapper {
    position: absolute;
    top     : 110px;
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
  .no-result-wrapper {
    position : absolute;
    width    : 100%;
    top      : 50%;
    transform: translateY(-50%);
  }
}
</style>