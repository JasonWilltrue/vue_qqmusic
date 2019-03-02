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
  }
}
</script>

<style lang="less" scoped>
@import "~@/common/less/const.less";
@import "~@/common/less/mymixin.less";
</style>