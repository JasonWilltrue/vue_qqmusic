<!-- 类电话簿组件 -->
<template>
  <m-scroll
    :data   = "data"
      class = "list-view"
  >
    <!-- 左侧歌手列表 -->
    <ul>
      <li
          v-for = "group in data"
          class = "list-group"
        :key    = "group.title"
      >
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li
              v-for = "item in group.items"
              class = "list-group-item"
            :key    = "item.id"
          >
            <img
              v-lazy = "item.avatar"
              class  = "avatar"
            >
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>

    <!-- loading 组件 -->
    <!-- <div
      v-show = "!data.length"
      class  = "loading-container"
    >
      <m-loadding></m-loadding>
    </div> -->
  </m-scroll>
</template>

<script>
import MScroll from "base/scroll/scroll";
import MLoadding from "base/loadding/loadding";

export default {
  components: {
    MScroll,
    MLoadding
  },
  props: {
    data: {
      type   : Array,
      default: []
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/common/less/const.less";
// @import "~@/common/less/mymixin.less";

.list-view {
  position  : relative;
  height    : 100%;
  width     : 100%;
  overflow  : hidden;
  background: @color-background;
  .list-group {
    padding-bottom: 30px;
    .list-group-title {
      height      : 30px;
      line-height : 30px;
      padding-left: 20px;
      font-size   : @font-size-small;
      color       : @color-text-l;
      background  : @color-highlight-background;
    }
    .list-group-item {
      display    : flex;
      align-items: center;
      padding    : 20px 0 0 30px;
      .avatar {
        width        : 50px;
        height       : 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color      : @color-text-l;
        font-size  : @font-size-medium;
      }
    }
  }
}
</style>
