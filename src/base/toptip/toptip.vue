<!-- 顶部提示 组件 -->
<template>
  <transition name="drop">
    <div class="top-tip" v-show="showFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      showFlag: false
    }
  },
  props: {
    // 延迟关闭时间
    delay: {
      type   : Number,
      default: 2000
    }
  },
  watch  : {},
  methods: {
    show() {
      this.showFlag = true
      clearTimeout(this.timer)
      // delay 秒自动关闭
      this.timer = setTimeout(() => {
        this.showFlag = false
      }, this.delay)
    },
    hide() {
      this.showFlag = false
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/common/less/const.less";
@import "~@/common/less/mymixin.less";

.top-tip {
  position  : fixed;
  top       : 0;
  width     : 100%;
  z-index   : 500;
  background: @color-dialog-background;
  &.drop-enter-active, &.drop-leave-active {
    transition: all 0.3s;
  }
  &.drop-enter, &.drop-leave-to {
    transform: translate3d(0, -100%, 0);
  }
}
</style>
