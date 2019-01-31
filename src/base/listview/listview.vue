<!-- 类电话簿组件 -->
<template>
  <m-scroll
    :data   = "data"
      class = "list-view"
      ref   = "listview"
  >
    <!-- 左侧歌手列表 -->
    <ul>
      <li
          v-for = "group in data"
          class = "list-group"
        :key    = "group.title"
          ref   = "listgroup"
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
    <!-- 右侧字母 组件 -->
    <div
      class                   = "list-shortcutlist"
      @touchstart             = "onShortcutTouchstart"
      @touchmove.stop.prevent = "onShortcutTouchmove"
    >
      <ul>
        <li
            v-for     = "(item,index) in shortcutlist"
          :key        = "index"
          :data-index = "index"
            class     = "item"
        >
          {{ item }}
        </li>
      </ul>
    </div>
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
import { getData } from "common/js/dom";

const RIGHT_ONEWORD_HEIGHT = 18;  //右侧每个字母的高度
const TITLE_HEIGHT         = 29;

export default {
  created() {
    this.touch          = {};
    this.listenScroll   = true;
    this.leftListHeight = [];
    this.probeType      = 3;     // better-scroll 滚动组件 不截留
  },
  components: {
    MScroll,
    MLoadding
  },
  props: {
    data: {
      type   : Array,
      default: []
    }
  },
  computed: {
    shortcutlist() {
      return this.data.map(item => {
        return item.title.substr(0, 1);
      });
    }
  },
  methods: {
    // 点击右侧，左侧联动
    onShortcutTouchstart(e) {
      // 获取点击的第几个元素
      let nowTouch               = e.touches[0];
          this.touch.y1          = nowTouch.pageY;
      let activeIndex            = getData(e.target, "index");
          this.touch.activeIndex = activeIndex;

      console.log("下标" + activeIndex);
      this._scrollTo(activeIndex);
    },
    //滑动右侧 左侧联动
    onShortcutTouchmove(e) {
      let firstTouch    = e.touches[0];
          this.touch.y2 = firstTouch.pageY;
      let delta         = this.touch.y2 - this.touch.y1;
      //2次点击y轴的偏差
      let offset          = Math.floor((delta / RIGHT_ONEWORD_HEIGHT) | 0);
      let activeMoveIndex = Number(this.touch.activeIndex) + offset;
      console.log("滑动小标" + activeMoveIndex);
      this._scrollTo(activeMoveIndex);
    },
    _scrollTo(index) {
      if (!index) {
        return;
      }
      // if (index < 0) {
      //   index = 0;
      // } else if (index > this.leftListHeight.length - 2) {
      //   index = this.leftListHeight.length - 2;
      // }
      this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 400); //第二个参数是滚动动画时间
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
  .list-shortcutlist {
    position     : absolute;
    z-index      : 30;
    top          : 50%;
    right        : 0;
    transform    : translateY(-50%);
    width        : 20px;
    padding      : 20px 0;
    border-radius: 10px;
    text-align   : center;
    font-family  : Helvetica;
    .item {
      padding    : 3px;
      line-height: 1;
      font-size  : @font-size-small;
      color      : @color-text-l;
      &.current {
        color: @color-theme;
      }
    }
  }
}
</style>
