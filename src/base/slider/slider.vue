<!-- 轮播组件 -->
<template>
  <div
    class = "my-slider"
    ref   = "slider"
  >
    <div
      class = "slider-group"
      ref   = "sliderGroup"
    >
      <slot></slot>
    </div>
    <!-- 轮播点 -->
    <div class="dots">
      <span
          class = "dot"
          v-for = "(item,index) in dots"
        :key    = "index"
        :class  = "{active: currentIndex === index}"
      >
      </span>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import { addClass, hasClass } from "common/js/dom";

export default {
  data() {
    return {
      dots        : [],
      currentIndex: 0
    };
  },
  props: {
    // 是否循环播放
    loop: {
      type   : Boolean,
      default: true
    },
    // 是否自动播放
    autoPlay: {
      type   : Boolean,
      default: true
    },
    // 轮播延时
    delay: {
      type   : Number,
      default: 3000
    }
  },
  methods: {
    // 轮播图(sliderGroup)宽度
    _setSliderWidth(isResize) {
      // 拿到传过来的图片
      this.children = this.$refs.sliderGroup.children;

      // 拿到父元素（slider）宽度
      let width       = 0;
      let sliderWidth = this.$refs.slider.clientWidth;

      // 动态添加 class、width
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        addClass(child, "slider-item");

        child.style.width  = sliderWidth + "px";
        width             += sliderWidth;
      }

      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
      }

      this.$refs.sliderGroup.style.width = width + "px";
    },
    // 初始化轮播图
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX : true,
        scrollY : false,
        momentum: false,   //关闭或者打开惯性运动的执行
        snap    : {
          loop     : this.loop,   //无限滚动
          threshold: 0,
          speed    : 400          //滑动的时间
        },
        click: true
      });

      this.slider.on("scrollEnd", () => {
        let nowIndex = this.slider.getCurrentPage().pageX;

        this.currentIndex = nowIndex;

        // 重置自动轮播定时器
        if (this.autoPlay) {
          clearTimeout(this.timer); //阻止如果用手去拖动导致动画又执行一遍
          this._initPlay();
        }
      });
    },
    // 初始化轮播点
    _initDots() {
      this.dots = new Array(this.children.length);
    },
    // 自动播放
    _initPlay() {
      let nextIndex = this.currentIndex + 1;

      this.timer = setTimeout(() => {
        this.slider.goToPage(nextIndex, 0, 400);
      }, this.delay);
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth();
      this._initDots();
      this._initSlider();

      if (this.autoPlay) {
        this._initPlay();
      }

      // 当窗口尺寸改变时，重新计算轮播宽度
      window.addEventListener("resize", () => {
        if (!this.slider) {
          return;
        }
        this._setSliderWidth(true);
        this.slider.refresh(); //重新计算
      });
    }, 20);
  },
  destroyed() {
    // 良好的习惯：销毁定时器
    clearTimeout(this.timer);
  }
};
</script>

<style lang="less" scoped>
@import "~@/common/less/const.less";
@import "~@/common/less/mymixin.less";

.my-slider {
  min-height: 1px;
  .slider-group {
    position   : relative;
    overflow   : hidden;
    white-space: nowrap;
    .slider-item {
      float     : left;
      box-sizing: border-box;
      overflow  : hidden;
      text-align: center;
      a {
        display        : block;
        width          : 100%;
        overflow       : hidden;
        text-decoration: none;
      }
      img {
        display: block;
        width  : 100%;
      }
    }
  }
  .dots {
    position  : absolute;
    right     : 0;
    left      : 0;
    bottom    : 12px;
    text-align: center;
    font-size : 0;
    .dot {
      display      : inline-block;
      margin       : 0 4px;
      width        : 8px;
      height       : 8px;
      border-radius: 50%;
      background   : @color-text-l;
      &.active {
        width        : 20px;
        border-radius: 5px;
        background   : @color-theme;
      }
    }
  }
}
</style>
