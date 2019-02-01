<template>
  <div class="music-list">
    <!-- 返回按钮 -->
    <div class="back">
      <i class="icon-back"></i>
    </div>
    <!-- 顶部歌手名称 -->
    <h1
      v-html = "title"
      class  = "title"
    ></h1>
    <div
        class = "bg-image"
      :style  = "bgStyle"
        ref   = "bgImageRef"
    >
      <!-- 随机播放全部 -->
      <div class="play-wrapper">
        <div class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <!-- 遮罩层 -->
      <div class="filter"></div>
    </div>
    <!-- 推层 -->
    <div
      ref   = "bgLayerRef"
      class = "bg-layer"
    ></div>
    <m-scroll
        class        = "list"
        ref          = "listRef"
      :data          = "songs"
      :probe-type    = "probeType"
      :listen-scroll = "listenScroll"
    >
      <div class="song-list-wrapper">
        <song-list
          :songs = "songs"
          :rank  = "rank"
        ></song-list>
      </div>
    </m-scroll>
  </div>
</template>

<script>
import MScroll from "base/scroll/scroll";
import MLoadding from "base/loadding/loadding";
import SongList from "base/songlist/songlist";
export default {
  name : "musiclist",
  props: {
    bgImage: {
      type   : String,
      default: ""
    },
    songs: {
      type   : Array,
      default: []
    },
    title: {
      type   : String,
      default: []
    },
    // 子组件排行奖杯图片
    rank: {
      type   : Boolean,
      default: false
    }
  },
  created() {
    this.probeType    = 3;
    this.listenScroll = true;
  },
  mounted() {
    this.$refs.listRef.$el.style.top = `${
      this.$refs.bgImageRef.clientHeight
    }px`;
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  components: {
    MScroll,
    MLoadding,
    SongList
  }
};
</script>

<style lang="less" scoped>
@import "~@/common/less/const.less";
@import "~@/common/less/mymixin.less";
.music-list {
  position  : fixed;
  z-index   : 100;
  top       : 0;
  left      : 0;
  right     : 0;
  bottom    : 0;
  background: @color-background;
  .back {
    position: absolute;
    top     : 0;
    left    : 6px;
    z-index : 100;
    .icon-back {
      display  : block;
      padding  : 10px;
      font-size: @font-size-large-x;
      color    : @color-theme;
    }
  }
  .title {
    position   : absolute;
    top        : 0;
    width      : 80%;
    left       : 10%;
    z-index    : 40;
    text-align : center;
    line-height: 40px;
    font-size  : @font-size-large;
    color      : @color-text;
  }
  .bg-image {
    position        : relative;
    width           : 100%;
    height          : 0;
    padding-bottom  : 70%;
    transform-origin: top;
    background-size : cover;
    z-index         : 40;
    .play-wrapper {
      position: absolute;
      bottom  : 20px;
      z-index : 50;
      width   : 100%;
      .play {
        box-sizing   : border-box;
        width        : 135px;
        padding      : 7px 0;
        margin       : 0 auto;
        text-align   : center;
        border       : 1px solid @color-theme;
        color        : @color-theme;
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
    }
    .filter {
      position  : absolute;
      top       : 0;
      left      : 0;
      width     : 100%;
      height    : 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .bg-play {
    position  : relative;
    height    : 100%;
    background: @color-background;
  }
  .list {
    position  : fixed;
    top       : 0;
    bottom    : 0;
    width     : 100%;
    background: @color-background;
    .song-list-wrapper {
      padding: 20px 30px;
    }
    .loadding {
      position : absolute;
      width    : 100%;
      top      : 50%;
      transform: translateY(-50%);
    }
  }
}
</style>