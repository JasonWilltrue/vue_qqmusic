// 个人中心组件
<template>
    <transition name="silder">
        <div class="uer">
            <!-- 顶部 -->
            <div class="back">
                <i class="icon-back"></i>
            </div>
            <div class="switches-wrapper"></div>
            <!-- 中间按钮 -->
            <div ref="playBtn" class="play-btn">
                 <i class="icon-play"></i>
                 <span>随机播放全部</span>
            </div>
            <!-- 底部列表 -->
            <div class="list-wrapper" ref="listWrapper">

            </div>
        </div>
    </transition>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import MScroll from "base/scroll/scroll";

   export default {
      name: "user"
   }
</script>

<style lang="less" scoped>
@import "~@/common/less/const.less";
@import "~@/common/less/mymixin.less";

.user{
  position  : fixed;
  top       : 0;
  bottom    : 0;
  z-index   : 100;
  width     : 100%;
  background: @color-background;
  &.slide-enter-active, &.slide-leave-active {
    transition: all 0.3s;
  }
  &.slide-enter, &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }

}
</style>