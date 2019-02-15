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
            <div
              class = "cd-wrapper"
              ref   = "cdRef"
            >
              <div
                  class = "cd"
                :class  = "playing ? 'play' : 'play pause'"
              >
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
          <!-- 进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{timeFormat(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                :percent         = "percent"
                  @percentChange = "percentChange"
              ></progress-bar>
            </div>
            <span class="time time-r">{{timeFormat(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left">
              <i
                class  = "icon-prev"
                @click = "prev"
              ></i>
            </div>
            <div class="icon i-center">
              <i
                  @click = "togglePlaying"
                :class   = "playing ? 'icon-pause' : 'icon-play'"
              ></i>
            </div>
            <div class="icon i-right">
              <i
                class  = "icon-next"
                @click = "next"
              ></i>
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
            :class   = "playing ? 'play' : 'play pause'"
          >
        </div>
        <div class="text">
          <p
            v-html = "currentSong.name"
            class  = "name"
          ></p>
          <p
            v-html = "currentSong.singer"
            class  = "desc"
          ></p>
        </div>
        <div class="control">
          <i
              @click.stop = "togglePlaying"
            :class        = "playing ? 'icon-pause-mini' : 'icon-play-mini'"
              class       = "icon-mini"
          ></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- 播放器 -->
    <audio
        ref         = "audioRef"
      :src          = "currentSong.url"
        @timeupdate = "updateTime"
    >
      Your browser does not support the audio element.</audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import animations from "create-keyframe-animation";
import progressBar from "base/progressbar/progressbar";
export default {
  name      : "player",
  components: {
    progressBar
  },
  data() {
    return {
      songReady  : false,
      currentTime: 0
    };
  },
  created() {
    console.log(this.currentSong);
  },
  computed: {
    percent() {
      return this.currentTime / this.currentSong.duration;
    },
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
      setFullScreen  : "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX"
    }),
    back() {
      //do something
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    //=======动画钩子函数========
    // 中部 cd 唱片，js 动画钩子
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();

      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      };

      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing  : "linear",
          delay   : 100
        }
      });
      // then run it
      animations.runAnimation(this.$refs.cdRef, "move", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.cdRef.style.animation = "";
    },
    leave(el, done) {
      const { x, y, scale } = this._getPosAndScale();

      this.$refs.cdRef.style["transition"] = `all 0.4s ease`;
      this.$refs.cdRef.style[
        "transform"
      ] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      this.$refs.cdRef.style[
        "webkitTransform"
      ] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;

      this.$refs.cdRef.addEventListener("transitionend", done);
    },
    afterLeave() {
      this.$refs.cdRef.style["transition"]      = "";
      this.$refs.cdRef.style["transform"]       = "";
      this.$refs.cdRef.style["webkitTransform"] = "";
    },
    _getPosAndScale() {
      const targetWidth   = 40;
      const paddingLeft   = 40;                                                           //小图中心点距离最左边40
      const paddingBottom = 30;                                                           //小图中心店距离底部
      const paddingTop    = 80;                                                           //大图距离顶部高度
      const width         = window.innerWidth * 0.8;
      const scale         = targetWidth / width;                                          //缩放比例
      const x             = -(window.innerWidth / 2 - paddingLeft);
      const y             = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale
      };
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    /**
     * 时间格式转换分钟，秒
     */
    timeFormat(time) {
            time = Math.floor(time);
      const min  = Math.floor(time / 60);
      const sec  = time % 60 < 10 ? "0" + (time % 60) : time % 60;
      return `${min}:${sec}`;
    },
    //=======歌曲播放操作========
    togglePlaying() {
      // if (!this.songCanplay) {
      //   return;
      // }

      this.setPlayingState(!this.playing);

      // 暂停时，歌词也暂停
      // if (this.currentLyric) {
      //   this.currentLyric.togglePlay();
      // }
    },
    next() {
      // 如果播放列表只要一条数据
      if (this.playlist.length === 1) {
        this.loopSong();
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playlist.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        //如果发现为暂停状态切换下一首各⭐️
        if (!this.playing) {
          this.togglePlaying();
        }
      }
    },
    prev() {
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playlist.length - 1;  //最后一首歌
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlaying();
      }
    },
    // 单曲循环
    loopSong() {
      // this.$refs.audioRef.currentTime = 0;
      this.$refs.audioRef.play();

      // // 单曲循环时，歌词也单曲循环
      // if (this.currentLyric) {
      //   this.currentLyric.seek(0);
      // }
    },
    // props down，当进度改变了
    percentChange(newPercent) {
      let currentTime                     = this.currentSong.duration * newPercent;
          this.$refs.audioRef.currentTime = currentTime;

      // 进度改变后自动播放
      if (!this.playing) {
        this.togglePlaying();
      }
    }
  },
  watch: {
    currentSong(newVal, oldVal) {
      this.$nextTick(() => {
        this.$refs.audioRef.play();
      });

      // 播放列表没有歌曲就退出
      if (!newVal.id) {
        return;
      }
      //相同歌曲就跳出
      if (newVal.id === oldVal.id) {
        return;
      }

      // 切歌时，停止当前歌词
      if (this.currentLyric) {
        this.currentLyric.stop();
      }

      // DOM 更新了
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$refs.audioRef.play();
        // this._getLyric();
      }, 1000);
    },
    // 监听播放状态：播放 or 暂停
    playing(newVal) {
      const audio = this.$refs.audioRef;
      this.$nextTick(() => {
        newVal ? audio.play(): audio.pause();
      });
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
              animation: rotate 20s linear infinite;
            }
            &.pause {
              animation-play-state: paused;
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
        margin     : 0px auto;
        padding    : 10px 0;
        .time {
          color      : @color-text;
          font-size  : @font-size-small;
          flex       : 0 0 30px;
          line-height: 30px;
          width      : 30px;
          &.time-l {
            text-align  : left;
            margin-right: 5px;
          }
          &.time-r {
            text-align : right;
            margin-left: 5px;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
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
      flex    : 0 0 30px;
      width   : 30px;
      padding : 0 10px;
      position: relative;
      .icon-play-mini,
      .icon-pause-mini,
      .icon-playlist {
        font-size: 30px;
        color    : @color-theme-d;
      }
      .icon-mini {
        position : absolute;
        left     : 0;
        top      : -14px;
        font-size: 32px;
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