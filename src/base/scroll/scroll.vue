<!--
 * @Author      : Jerrychan
 * @Date        : 2019-01-30 14: 05: 28
 * @LastEditors : Please set LastEditors
 * @LastEditTime: 2019-02-22 14: 54: 03
 * @Description : 抽象的滚动组件
 -->
<template>
  <div
    class = "scroll"
    ref   = "wrapper"
  >
    <slot></slot>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  name : "scroll",
  props: {
    data: {
      type   : Array,
      default: null
    },
    probeType: {
      type   : Number,
      default: 1
    },
    click: {
      type   : Boolean,
      default: true
    },
    // 是否监听滚动位置
    listenScroll: {
      type   : Boolean,
      default: false
    },
    // 是否开启上拉刷新
    pullup: {
      type   : Boolean,
      default: false
    },
    // 滚动前是否触发事件，如：滚动前让输入框失去焦点，避免滚动搜索结果时移动端键盘遮挡
    beforeScroll: {
      type   : Boolean,
      default: false
    },
    // 延迟刷新
    refreshDelay: {
      type   : Number,
      default: 20
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll();
    }, 20);
  },
  methods: {
    _initScroll() {
      //初始化的时候遇到wrapper为undefined
      if (!this.$refs.wrapper) {
        return;
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        click    : this.click,
        probeType: this.probeType
      });
      //派发监听的滚动位置事件
      if (this.listenScroll) {
        let _that = this;
        this.scroll.on("scroll", pos => {
          //向父组件传值
          _that.$emit("scroll", pos);
        });
      }
      //派发上啦刷新
      if(this.pullup){
        let me = this;
        this.scroll.on("scrollEnd",()=>{
           if(this.scroll.y <= this.scroll.maxScrollY +50){
               me.$emit("scrollToEnd")
           }
        })
      }
       // 滚动前是否触发事件
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }



  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh();
      }, this.refreshDelay);
    }
  }
};
</script>

<style scoped>
</style>