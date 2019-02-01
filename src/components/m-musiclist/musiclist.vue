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
      <div
        class = "play-wrapper"
        ref   = "playRef"
      >
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
      ref   = "layerRef"
      class = "bg-layer"
    ></div>
    <m-scroll
        class        = "list"
        ref          = "listRef"
      :data          = "songs"
      :probe-type    = "probeType"
      :listen-scroll = "listenScroll"
        @scroll      = "scroll"
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
const TRANSFORMY_RESERVED = 40;  //顶部高度
export default {
  name: "musiclist",
  data() {
    return {
      // 推层上移的距离
      scrollY: -1
    };
  },
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
    //缓存图片高度
    this.bgImageHeight               = this.$refs.bgImageRef.clientHeight;
    this.minTranslationY             = -this.bgImageHeight + TRANSFORMY_RESERVED;
    this.$refs.listRef.$el.style.top = `${
      this.$refs.bgImageRef.clientHeight
    }px`;
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y;
      console.log(this.scrollY);
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  watch: {
    // 推层动画逻辑
    scrollY(newVal) {
      let tranlateY = Math.max(this.minTranslationY, newVal);
      let zIndex    = 0;
      //设置滚动最大距离
      this.$refs.layerRef.style[
        "transform"
      ] = `translate3d(0 ,${tranlateY}px, 0)`;
      this.$refs.layerRef.style[
        "webkitTransform"
      ] = `translate3d(0 ,${tranlateY}px, 0)`;

      // 不推到顶，留一部分
      if (newVal < this.minTranslationY) {
                                    zIndex         = 10;
        this.$refs.bgImageRef.style["padding-top"] = 0;

        this.$refs.bgImageRef.style["height"] = `${TRANSFORMY_RESERVED}px`;
        // 隐藏 随机播放全部 按钮
        this.$refs.playRef.style["display"] = "none";
      } else {
        this.$refs.bgImageRef.style["padding-top"] = "70%";
        this.$refs.bgImageRef.style["height"]      = 0;
        // 显示 随机播放全部 按钮
        this.$refs.playRef.style["display"] = "block";
      }
      this.$refs.bgImageRef.style["z-index"] = zIndex;
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
  bottom    : 0;
  right     : 0;
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
    position: absolute;
    top     : 0;
    left    : 10%;
    z-index : 40;
    width   : 80%;
    .no-wrap();
    text-align : center;
    line-height: 40px;
    font-size  : @font-size-large;
    color      : @color-text;
  }
  .bg-image {
    position        : relative;
    width           : 100%;
    height          : 0;
    padding-top     : 70%;
    transform-origin: top;
    background-size : cover;
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
  .bg-layer {
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
    .loading-container {
      position : absolute;
      width    : 100%;
      top      : 50%;
      transform: translateY(-50%);
    }
  }
}
</style>