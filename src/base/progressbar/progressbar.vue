<template>
  <div
    class       = "progress-bar"
    ref         = "barRef"
    @click.stop = "progressClick"
  >
    <div class="bar-inner">
      <!-- 已播放的进度 -->
      <div
        class = "progress"
        ref   = "progressRef"
      ></div>
      <!-- 拖动的小球 -->
      <div
        ref                 = "btnRef"
        class               = "progress-btn-wrapper"
        @touchstart.prevent = "progressTouchstart"
        @touchmove.prevent  = "progressTouchmove"
        @touchend           = "progressTouchend"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
const BTN_WIDTH = 16;
export default {
  name : "progressbar",
  props: {
    // 当前播放进度 [0, 1]
    percent: {
      type   : Number,
      default: 0
    }
  },
  created() {
    // 共享 touch 状态
    this.touch = {};
  },
  methods: {
    // 进度条前进 + 小球前进
    _move(offsetWidth) {
      this.$refs.progressRef.style.width = `${offsetWidth}px`;
      this.$refs.btnRef.style[
        "webkitTransform"
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
      this.$refs.btnRef.style[
        "transform"
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
    },
    // 点击进度条改变播放进度
    progressClick(e) {
      // 返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离。
      let rectLeft    = this.$refs.barRef.getBoundingClientRect().left;
      let offsetWidth = e.pageX - rectLeft;

      // this._move(e.offsetX) // 这样的话，点小球的时候数据不对，弃
      this._move(offsetWidth);
      this._percentChange();
    },
    // 拖动小球改变播放进度，小球滑动开始位置
    progressTouchstart(e) {
      this.touch.init = true;
      // 开始滑动的位置
      this.touch.startX = e.touches[0].pageX;
      // 当前偏移
      this.touch.left = this.$refs.progressRef.clientWidth;
    },
    // 拖动小球改变播放进度，小球滑动过程中
    progressTouchmove(e) {
      if (!this.touch.init) return;

      // 滑动的差值
      let deltaX = e.touches[0].pageX - this.touch.startX;
      // 进度条的差值，大于0，小于总长度
      let offsetWidth = Math.min(
        this.$refs.barRef.clientWidth - BTN_WIDTH,
        Math.max(0, this.touch.left + deltaX)
      );

      this._move(offsetWidth);
    },
    // 拖动小球改变播放进度，小球滑动结束
    progressTouchend() {
      this.touch.init = false;
      this._percentChange();
    },
    // 直接在子组件中改变 props
    _percentChange() {
      let barWidth   = this.$refs.barRef.clientWidth - BTN_WIDTH;
      let newPercent = this.$refs.progressRef.clientWidth / barWidth;

      this.$emit("percentChange", newPercent);
    }
  },
  watch: {
    percent(newValue) {
      // 拖动的时候不要 watch
      if (newValue >= 0 && !this.touch.init) {
        let barWidth = this.$refs.barRef.clientWidth - BTN_WIDTH;
        //偏移距离
        let offsetWidth = newValue * barWidth;
        this._move(offsetWidth);
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/common/less/const.less";
@import "~@/common/less/mymixin.less";
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top     : 13px;
    height  : 4px;
    // border-radius: 50%;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position  : absolute;
      height    : 100%;
      background: @color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left    : -8px;
      top     : -13px;
      width   : 30px;
      height  : 30px;
      .progress-btn {
        position     : relative;
        top          : 7px;
        left         : 7px;
        box-sizing   : border-box;
        width        : 16px;
        height       : 16px;
        border       : 3px solid @color-text;
        border-radius: 50%;
        background   : @color-theme;
      }
    }
  }
}
</style>