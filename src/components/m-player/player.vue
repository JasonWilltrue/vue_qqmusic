<template>
  <div
    class  = "player"
    v-show = "playlist.length>0"
  >
    <transition
      name         = "normal"
      @enter       = "enter"
      @after-enter = "afterEnter"
      @leave       = "leave"
      @after-leave = "afterLeave"
    >
      <!-- 展开的播放器 -->
      <div
        class  = "normal-player"
        v-show = "fullScreen"
      >
        <!-- 背景图 -->
        <div class="background">
          <img
            :src     = "currentSong.image"
              alt    = "bagurl"
              width  = "100%"
              height = "100%"
          >
        </div>
        <!-- 顶部 -->
        <div class="top">
          <div
            class  = "back"
            @click = "back"
          >
            <i class="icon-back"></i>
          </div>
          <h1
            class  = "title"
            v-html = "currentSong.name"
          ></h1>
          <h2
            class  = "subtitle"
            v-html = "currentSong.singer"
          ></h2>
        </div>
        <!-- 中间部分 -->
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper">
              <div class="cd">
                <img
                  :src    = "currentSong.image"
                    alt   = ""
                    class = "image"
                >
              </div>
            </div>
          </div>
        </div>
        <!-- 底部操作区 -->
        <div class="bottom">
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center">
              <i class="icon-play"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- mini播放器 -->
    <transition name="mini">
      <div
        class  = "mini-player"
        v-show = "!fullScreen"
        @click = "open"
      >
        <div class="icon">
          <img
            :src     = "currentSong.image"
              alt    = ""
              width  = "100%"
              height = "100%"
          >
        </div>
        <div class="text">
          <h2
            class  = "name"
            v-html = "currentSong.singer"
          ></h2>
          <p class="desc"></p>
        </div>
        <div class="control"></div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "player",
  created() {
    console.log(this.currentSong);
  },
  computed: {
    //获取全局的播放设置参数
    ...mapGetters([
      "fullScreen",
      "playlist",
      "currentSong",
      "playing",
      "currentIndex",
      "mode",
      "sequenceList",
      "favoriteList"
    ])
  },
  methods: {
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN"
    }),
    back() {
      //do something
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/common/less/const.less";
@import "~@/common/less/mymixin.less";
.player {
  .normal-player {
    position  : fixed;
    left      : 0;
    right     : 0;
    top       : 0;
    bottom    : 0;
    z-index   : 150;
    background: @color-background;
    .background {
      position: absolute;
      left    : 0;
      top     : 0;
      width   : 100%;
      height  : 100%;
      z-index : -1;
      opacity : 0.6;
      filter  : blur(20px);
    }
    .top {
      position     : relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top     : 0;
        left    : 6px;
        z-index : 50;
        .icon-back {
          display  : block;
          padding  : 9px;
          font-size: @font-size-large-x;
          color    : @color-theme;
          transform: rotate(-90deg);
        }
      }
      .title {
        width      : 70%;
        margin     : 0 auto;
        text-align : center;
        line-height: 40px;
        .no-wrap();
        font-size: @font-size-large;
        color    : @color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align : center;
        font-size  : @font-size-medium;
        color      : @color-text;
      }
    }
    .middle {
      position   : fixed;
      width      : 100%;
      top        : 80px;
      bottom     : 170px;
      white-space: nowrap;
      font-size  : 0;
      .middle-l {
        display       : inline-block;
        vertical-align: top;
        position      : relative;
        width         : 100%;
        height        : 0;
        padding-top   : 80%;
        .cd-wrapper {
          position: absolute;
          left    : 10%;
          top     : 0;
          width   : 80%;
          height  : 100%;
          .cd {
            width        : 100%;
            height       : 100%;
            box-sizing   : border-box;
            border       : 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            &.play {
              animation: rotate 20s liner infinite;
            }
            &.pause {
              animation-play-state        : paused;
              -webkit-animation-play-state: paused;
            }
            .image {
              position     : absolute;
              left         : 0;
              top          : 0;
              width        : 100%;
              height       : 100%;
              border-radius: 50%;
            }
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom  : 50px;
      width   : 100%;
      .dot-wrapper {
        text-align: center;
        font-size : 0;
        .dot {
          display       : inline-block;
          vertical-align: middle;
          margin        : 0 4px;
          width         : 8px;
          height        : 8px;
          border-radius : 50%;
          background    : @color-text-l;
          &.active {
            width        : 20px;
            border-radius: 50%;
            background   : @color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display    : flex;
        align-items: center;
        width      : 80%;
        margin     : 0 auto;
        padding    : 10px 0;
      }
      .operators {
        display    : flex;
        align-items: center;
        .icon {
          flex : 1;
          color: @color-theme;
          &.disable {
            color: @color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding   : 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: @color-sub-theme;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.4s;
      .top,
      .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }
    &.normal-enter,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
  .mini-player {
    display    : flex;
    align-items: center;
    position   : fixed;
    left       : 0;
    bottom     : 0;
    z-index    : 180;
    width      : 100%;
    height     : 60px;
    background : @color-highlight-background;
    &.mini-enter-active,
    &.mini-leave-active {
      transition: all 0.4s;
    }
    &.mini-enter,
    &.mini-leave-to {
      opacity: 0;
    }
    .icon {
      flex   : 0 0 40px;
      width  : 40px;
      padding: 0 10px 0 20px;
      img {
        border-radius: 50%;
        &.play {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
    .text {
      display        : flex;
      flex-direction : column;
      justify-content: center;
      flex           : 1;
      line-height    : 20px;
      overflow       : hidden;
      .name {
        margin-bottom: 2px;
        .no-wrap();
        font-size: @font-size-medium;
        color    : @color-text;
      }
      .desc {
        .no-wrap();
        font-size: @font-size-small;
        color    : @color-text-d;
      }
    }
    .control {
      flex   : 0 0 30px;
      width  : 30px;
      padding: 0 10px;
      .icon-play-mini,
      .icon-pause-mini,
      .icon-playlist {
        font-size: 30px;
        color    : @color-theme-d;
      }
      .icon-mini {
        font-size: 32px;
        position : absolute;
        left     : 0;
        top      : 0;
      }
    }
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>