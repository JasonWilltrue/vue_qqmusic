<template>
  <div
    class = "progress-bar"
    ref   = "barRef"
  >
    <div class="bar-inner">
      <!-- 已播放的进度 -->
      <div
        class = "progress"
        ref   = "progressRef"
      ></div>
      <!-- 拖动的小球 -->
      <div
        ref   = "btnRef"
        class = "progress-btn-wrapper"
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
    }
  },
  watch: {
    percent(newValue) {
      if (newValue >= 0) {
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