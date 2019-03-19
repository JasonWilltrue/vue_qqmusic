<template>
  <div class="player" v-show="playlist.length>0">
    <transition
      name         = "normal"
      @enter       = "enter"
      @after-enter = "afterEnter"
      @leave       = "leave"
      @after-leave = "afterLeave"
    >
      <!-- 展开的播放器 -->
      <div class="normal-player" v-show="fullScreen">
        <!-- 背景图 -->
        <div class="background">
          <img :src="currentSong.image" alt="bagurl" width="100%" height="100%">
        </div>
        <!-- 顶部 -->
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <!-- 中间部分 -->
        <div
          class               = "middle"
          @touchstart.prevent = "middleTouchstart"
          @touchmove.prevent  = "middleTouchmove"
          @touchend           = "middleTouchend"
        >
          <!-- 歌曲封面 -->
          <div class="middle-l" ref="middleRef">
            <div class="cd-wrapper" ref="cdRef">
              <div class="cd" :class="playing ? 'play' : 'play pause'">
                <img :src="currentSong.image" alt class="image">
              </div>
            </div>
            <!-- cd页小段歌词 -->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <!-- 歌词部分 -->
          <m-scroll ref="lyricList" class="middle-r" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                      ref   = "lyricLine"
                      v-for = "(line, index) in currentLyric.lines"
                    :key    = "index"
                    :class  = "{ 'current':currentLyricLine === index }"
                      class = "text"
                >{{ line.txt }}</p>
              </div>
            </div>
          </m-scroll>
        </div>
        <!-- 底部操作区 -->
        <div class="bottom">
          <!-- 分页点 -->
          <div class="dot-wrapper">
            <span :class="{ 'active': currentDot === 'cd' }" class="dot"></span>
            <span :class="{ 'active': currentDot === 'lyric' }" class="dot"></span>
          </div>
          <!-- 进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{timeFormat(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="percentChange"></progress-bar>
            </div>
            <span class="time time-r">{{timeFormat(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center">
              <i @click="togglePlaying" :class="playing ? 'icon-pause' : 'icon-play'"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i
                    class  = "icon"
                  :class   = "getFavoriteCls(currentSong)"
                    @click = "toggleFavoriteCls(currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- mini播放器 -->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img
            :src = "currentSong.image"
            alt
                width  = "100%"
                height = "100%"
              :class   = "playing ? 'play' : 'play pause'"
          >
        </div>
        <div class="text">
          <p v-html="currentSong.name" class="name"></p>
          <p v-html="currentSong.singer" class="desc"></p>
        </div>
        <div class="control">
          <progress-circle :percent="percent" :radius="32">
            <i
                  @click.stop = "togglePlaying"
                :class        = "playing ? 'icon-pause-mini' : 'icon-play-mini'"
                  class       = "icon-mini"
            ></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <play-list ref="playlistRef"></play-list>
    <!-- 播放器 -->
    <audio
          ref         = "audioRef"
        :src          = "currentSong.url"
          @play       = "ready"
          @error      = "error"
          @timeupdate = "updateTime"
          @ended      = "ended"
    >Your browser does not support the audio element.</audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import animations from "create-keyframe-animation";
import progressBar from "base/progressbar/progressbar";
import progressCircle from "base/progresscircle/progresscircle";
import { utilsArray } from "common/js/utils";
import Lyric from "lyric-parser"; // QQ音乐 歌词解析
import MScroll from "base/scroll/scroll";
import PlayList from "components/m-playlist/playlist";


export default {
  name      : "player",
  components: {
    progressBar,
    progressCircle,
    MScroll,
    PlayList
  },
  data () {
    return {
      // 标志位。歌曲已缓存好，可以播放了
      songCanplay: false,
      // 当前播放时间
      currentTime: 0,
      // 当前的歌词
      currentLyric: null,
      // 当前的歌词在第几行
      currentLyricLine: 0,
      // 当前在哪个分页
      currentDot: "cd",
      // cd页小段歌词
      playingLyric: "无歌词数据",
      // 是否显示播放列表
      showList: false
    };
  },
  created () {
    this.touch = {};
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
      "favoriteList",
    ]),
    percent () {
      return this.currentTime / this.currentSong.duration;
    },
    // 播放模式对应图标字体
    iconMode () {
      let cls = "";
      if (this.mode === 0) {
        cls = "icon-sequence";
      } else if (this.mode === 1) {
        cls = "icon-loop";
      } else if (this.mode === 2) {
        cls = "icon-random";
      } else {
        cls = "";
      }
      return cls;
    }

  },
  methods: {
    ...mapMutations({
      setFullScreen  : "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setMode        : "SET_MODE",
      setPlayList    : "SET_PLAYLIST"
    }),
    ...mapActions(['savePlayHistory', 'savefavoriteList', 'delfavoriteList']),
    back () {
      //do something
      this.setFullScreen(false);
    },
    open () {
      this.setFullScreen(true);
    },
    // audio API ended  当前歌曲播放完毕
    ended () {
      if (this.mode === 1) {
        // 单曲循环模式
        this.loopSong();
      } else {
        this.next();
      }
    },
    //=======动画钩子函数========
    // 中部 cd 唱片，js 动画钩子
    enter (el, done) {
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
    afterEnter () {
      animations.unregisterAnimation("move");
      this.$refs.cdRef.style.animation = "";
    },
    leave (el, done) {
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
    afterLeave () {
      this.$refs.cdRef.style["transition"]      = "";
      this.$refs.cdRef.style["transform"]       = "";
      this.$refs.cdRef.style["webkitTransform"] = "";
    },
    _getPosAndScale () {
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
    updateTime (e) {
      this.currentTime = e.target.currentTime;
    },
    /**
     * 时间格式转换分钟，秒
     */
    timeFormat (time) {
                  time = Math.floor(time);
            const min  = Math.floor(time / 60);
            const sec  = time % 60 < 10 ? "0" + (time % 60) : time % 60;
      return `${min}:${sec}`;
    },
    //=======歌曲播放操作========
    togglePlaying () {
      if (!this.songCanplay) {
        return;
      }
      this.setPlayingState(!this.playing);

      // 暂停时，歌词也暂停
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    next () {
      if (!this.songCanplay) {
        return;
      }
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
          this.songCanplay = false;
        }
      }

    },
    prev () {
      if (!this.songCanplay) {
        return;
      }
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playlist.length - 1;  //最后一首歌
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlaying();
      }
      this.songCanplay = false
    },
    // 单曲循环
    loopSong () {
      this.$refs.audioRef.currentTime = 0;
      this.$refs.audioRef.play();

      // 单曲循环时，歌词重新归0
      if (this.currentLyric) {
        this.currentLyric.seek(0);
      }
    },
    // props down，当进度改变了
    percentChange (newPercent) {
      let currentTime                     = this.currentSong.duration * newPercent
          this.$refs.audioRef.currentTime = currentTime

      // 进度改变后自动播放
      if (!this.playing) {
        this.togglePlaying()
      }

      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    //改变播放模式
    changeMode () {
      let mode = (this.mode + 1) % 3;
      this.setMode(mode); //派发action
      //修改播放列表
      let newList = null;
      if (mode === 2) {
        // 随机播放
        newList = utilsArray.shuffle(this.sequenceList);
      } else {
        // 顺序播放、单曲循环
        newList = this.sequenceList;
      }

      // 调整当前歌曲的索引
      let index = newList.findIndex(item => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
      this.setPlayList(newList);
    },
    // 歌词处理
    _getLyric () {
      this.currentSong
        .getLyric()
        .then(lyric => {
          //如果当前歌词不等于歌词的 不执行
          //解决歌词混乱问题
          if (this.currentSong.lyric !== lyric) {
            return
          }
          this.currentLyric = new Lyric(lyric, this.handleLyric);
          console.log(this.currentLyric);
          //歌曲播放时候歌词播放
          if (this.playing) {
            this.currentLyric.play();
          }
        })
        .catch(() => {
          // 获取歌词失败时
          this.currentLyric     = null;
          this.playingLyric     = "无歌词数据";
          this.currentLyricLine = 0;
        });
    },
    // new Lyric 回调函数
    handleLyric ({ lineNum, txt }) {
      // this hanlder called when lineNum change
      this.currentLyricLine = lineNum;

      // 歌词在中间
      if (lineNum > 5) {
        let el = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement(el, 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }

      // 当前小歌词区域显示
      this.playingLyric = txt;
    },
    // 滑动翻页
    middleTouchstart (e) {
      // 表示已经初始化过了
      this.touch.init = true
      // 开始滑动的位置
      this.touch.startX = e.touches[0].pageX
      this.touch.startY = e.touches[0].pageY
    },
    middleTouchmove (e) {
      if (!this.touch.init) {
        return
      }
      // 滑动的差值
      let deltaX = e.touches[0].pageX - this.touch.startX
      let deltaY = e.touches[0].pageY - this.touch.startY

      // 纵向滚动偏差绝对值 大于 横轴滚动 return
      if (Math.abs(deltaX) < Math.abs(deltaY)) {
        return
      }
      let left = this.currentDot === 'cd' ? 0 : -window.innerWidth
      // 左滑的距离
      let offsetWidth        = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
          this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      // 过度效果
      this.$refs.lyricList.$el.style['webkitTransform'] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style['transform']       = `translate3d(${offsetWidth}px, 0, 0)`
      // 过渡效果坚持 0ms
      this.$refs.lyricList.$el.style['webkitTransition-duration'] = 0
      this.$refs.lyricList.$el.style['transition-duration']       = 0
      // 背景模糊
      this.$refs.middleRef.style['opacity']                   = 1 - this.touch.percent
      this.$refs.middleRef.style['webkitTransition-duration'] = 0
      this.$refs.middleRef.style['transition-duration']       = 0
    },
    middleTouchend (e) {
      let offsetWidth = null
      let opacity     = null
      if (this.currentDot === 'cd') {
        // 左滑
        if (this.touch.percent > 0.1) {
          offsetWidth     = -window.innerWidth
          this.currentDot = 'lyric'
          opacity         = 0
        } else {
          offsetWidth = 0
          opacity     = 1
        }
      } else {
        // 右滑
        if (this.touch.percent < 0.9) {
          offsetWidth     = 0
          this.currentDot = 'cd'
          opacity         = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity     = 0
        }
      }

      this.$refs.lyricList.$el.style['webkitTransform'] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style['transform']       = `translate3d(${offsetWidth}px, 0, 0)`
      // 过渡效果坚持 300ms
      this.$refs.lyricList.$el.style['webkitTransition-duration'] = '300ms'
      this.$refs.lyricList.$el.style['transition-duration']       = '300ms'
      // 背景模糊
      this.$refs.middleRef.style['opacity']                   = opacity
      this.$refs.middleRef.style['webkitTransition-duration'] = '300ms'
      this.$refs.middleRef.style['transition-duration']       = '300ms'
    },
    showPlaylist () {
      this.$refs.playlistRef.show()
    },
    //开始播放2件事情 1播放状态改变  2保存当前播放歌曲进入历史列表
    ready () {
      this.songCanplay = true
      // 把当前歌曲写进 vuex 最近播放 playHistory 中
      this.savePlayHistory(this.currentSong)
    },
    error () {
      this.songCanplay = true;
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime;
    },
    //切换收藏状态
    toggleFavoriteCls (song) {
      if (this._isFavorite(song)) {
        this.delfavoriteList(song)
      } else {
        this.savefavoriteList(song)
      }
    },
    //切换收藏图标
    getFavoriteCls (song) {
      if (this._isFavorite(song)) {
        return 'icon-favorite'
      } else {
        return 'icon-not-favorite'
      }
    },
    // 判断是否收藏状态
    _isFavorite (song) {

      let index = this.favoriteList.findIndex((item) => {
        return song.id === item.id
      })
      return index > -1
    },
  },
  watch: {
    currentSong (newVal, oldVal) {
      // console.log(this.currentSong)
      // 播放列表没有歌曲就退出
      if (!newVal.id) {
        return
      }

      if (newVal.id === oldVal.id) {
        return
      }
      // 切歌时，停止当前歌词
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.currentTime      = 0;
        this.playingLyric     = ""
        this.currentLyricLine = 0;
      }
      // DOM 更新了 解决微信端从后台切到前台重新播放问题
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$refs.audioRef.play()
        this._getLyric()
      }, 1000)
    },
    // 监听播放状态：播放 or 暂停
    playing (newVal) {
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
        .playing-lyric-wrapper {
          width     : 80%;
          margin    : 30px auto 0 auto;
          overflow  : hidden;
          text-align: center;
          .playing-lyric {
            height     : 20px;
            line-height: 20px;
            font-size  : @font-size-medium;
            color      : @color-text-l;
          }
        }
      }
      .middle-r {
        display       : inline-block;
        vertical-align: top;
        width         : 100%;
        height        : 100%;
        overflow      : hidden;
        .lyric-wrapper {
          width     : 80%;
          margin    : 0 auto;
          overflow  : hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color      : @color-text-l;
            font-size  : @font-size-medium;
            &.current {
              color: @color-text;
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
        top      : 0px;
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