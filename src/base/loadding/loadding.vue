<template>
  <div class="loadding">
    <section>
      <div class="wave">
        <div class="rect rect-1"></div>
        <div class="rect rect-2"></div>
        <div class="rect rect-3"></div>
        <div class="rect rect-4"></div>
        <div class="rect rect-5"></div>
      </div>
    </section>
    <p class="title">{{title}}</p>
  </div>
</template>

<script>
export default {
  name : "loadding",
  props: {
    title: {
      type   : String,
      default: "正在给主人拼命加载中..."
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/common/less/const.less";
.loadding {
  width     : 100%;
  text-align: center;
  .wave {
    width : 96px;
    height: 64px;
    margin: auto;
    .rect {
      background : @color-theme;
      margin-left: 4px;
      height     : 100%;
      width      : 8px;
      display    : inline-block;
      transform  : scaleY(0.4);
      animation  : wave-rect 1.2s infinite ease-in-out;
    }
    .rect-1 {
      animation-delay: -1.1s;
    }
    .rect-2 {
      animation-delay: -1s;
    }

    .rect-3 {
      animation-delay: -0.9s;
    }

    .rect-4 {
      animation-delay: -0.8s;
    }

    .rect-5 {
      animation-delay: -0.7s;
    }
  }
  .title {
    line-height: 20px;
    font-size  : @font-size-medium;
    color      : #fff;
  }
}
@keyframes wave-rect {
  0% {
    transform: scaleY(0.4);
  }

  20% {
    transform: scaleY(0.8);
  }

  50% {
    transform: scaleY(0.6);
  }

  100% {
    transform: scaleY(0.4);
  }
}
</style>