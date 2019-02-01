<!-- 类电话簿组件 -->
<template>
  <m-scroll
    :data         = "data"
      class       = "list-view"
      ref         = "listview"
    :listenScroll = "listenScroll"
    :probeType    = "probeType"
      @scroll     = "scroll"
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
              v-for  = "item in group.items"
              class  = "list-group-item"
            :key     = "item.id"
              @click = "selectItem(item)"
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
          :class      = "{'current':currentIndex === index}"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <!-- 滚动固定标题实现 -->
    <div
      ref    = "fixedTitleRef"
      v-show = "fixedTitle"
      class  = "list-fixed"
    >
      <h1 class="fixed-title">{{ fixedTitle }}</h1>
    </div>
    <!-- loading 组件 -->
    <div
      v-show = "!data.length"
      class  = "loading-container"
    >
      <m-loadding></m-loadding>
    </div>
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
    this.listenScroll   = true;  //开启滚动监听
    this.leftListHeight = [];
    this.probeType      = 3;     // better-scroll 滚动组件 不截留
  },
  components: {
    MScroll,
    MLoadding
  },
  data() {
    return {
      scrollY     : -1,   //初始y值
      currentIndex: 0,    //当前值
      // 标题上推y值（热门标题 - A 标题的差值）
      diff: -1
    };
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
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return "";
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        :  "";
    }
  },
  methods: {
    //点击歌手跳转歌手详情
    selectItem(item) {
      this.$emit("select", item);
    },
    // 点击右侧，左侧联动
    onShortcutTouchstart(e) {
      // 获取点击的第几个元素
      let nowTouch               = e.touches[0];
          this.touch.y1          = nowTouch.pageY;
      let activeIndex            = getData(e.target, "index");
          this.touch.activeIndex = activeIndex;
      // console.log("下标" + activeIndex);
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
      // console.log("滑动小标" + activeMoveIndex);
      this._scrollTo(activeMoveIndex);
    },
    scroll(pos) {
      // 实时获取y轴位置
      this.scrollY = pos.y;
    },
    _scrollTo(index) {
      if (!index) {
        return;
      }
      // 处理滑动情况下滑出边界外index为负值
      if (index < 0) {
        index = 0;
      } else if (index > this.leftListHeight.length - 2) {
        index = this.leftListHeight.length - 2;
      }
      this.currentIndex = Number(index);
      this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 400); //第二个参数是滚动动画时间
    },
    // 计算 leftListHeight 的高度
    _caclHeight() {
      // 初始化
      let height              = 0;
          this.leftListHeight = [];
      this.leftListHeight.push(height);

      let list = this.$refs.listgroup;
      for (let i = 0; i < list.length; i++) {
        height += list[i].clientHeight;
        this.leftListHeight.push(height);
      }
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._caclHeight();
      }, 20);
    },
    scrollY(newY) {
      const leftListHeight = this.leftListHeight;
      // 当滚动到顶部，newY > 0
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      // 在中间部分滚动
      for (let i = 0; i < leftListHeight.length - 1; i++) {
        let height1 = leftListHeight[i];
        let height2 = leftListHeight[i + 1];
        // 大于前一个高度且小于后一个高度就表示在这个后一个区间范围内
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          this.diff         = height2 + newY;
          console.log("差距：" + this.diff); //刚好等于30高度的时候碰到
          return;
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限（leftListHeight.length实际就是多一个从0计数的）
      this.currentIndex = leftListHeight.length - 2;
      console.log("当前区间：" + this.currentIndex);
    },
    diff(newVal) {
      let fixedTop = 
        // 判断高度差 是否已经碰到
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      console.log(newVal - TITLE_HEIGHT, this.fixedTop);
      // 优化dom性能
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop                            = fixedTop;
      this.$refs.fixedTitleRef.style.transform = `translate3d(0,${fixedTop}px,0)`;
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
  .list-fixed {
    position  : absolute;
    top       : -1px;
    left      : 0;
    width     : 100%;
    background: @color-highlight-background;
    .fixed-title {
      height      : 30px;
      line-height : 30px;
      padding-left: 20px;
      font-size   : @font-size-small;
      color       : @color-text-l;
    }
  }
  .loading-container {
    position : absolute;
    top      : 50%;
    width    : 100%;
    transform: translateY(-50%);
  }
}
</style>
