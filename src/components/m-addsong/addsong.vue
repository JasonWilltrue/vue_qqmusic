<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag">
      <!-- 头部 -->
      <div class="header">
        <h1 class="title">添加歌曲到队列</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <!-- 搜索框 -->
      <div class="search-box-wrapper">
        <search-box ref="searchBoxRef"  placeholder="搜索歌曲"></search-box>
      </div>
      <!-- 切换及其内容 -->
      <div class="shortcut"></div>
      <!-- 搜索历史 -->
      <div class="search-result"></div>
    </div>
  </transition>
</template>

<script>
import MScroll from "base/scroll/scroll";
import SearchBox from 'base/searchbox/searchbox';
export default {
  name      : 'addsong',
  components: {
     MScroll,
     SearchBox
  },
  data() {
     return {
        showFlag: false
     }
  },
  methods: {
     show() {
      this.showFlag = true
     },
     hide() {
        showFlag: false
     }
  },
}
</script>

<style lang="less" scoped>
@import "~@/common/less/const.less";
@import "~@/common/less/mymixin.less";


.add-song{
   position  : fixed;
   top       : 0;
   bottom    : 0;
   width     : 100%;
   z-index   : 200;
   background: @color-background;
  &.slide-enter-active, &.slide-leave-active {
    transition: all 0.3s;
  }
  &.slide-enter, &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
}


</style>