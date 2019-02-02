<template>
  <div
    class  = "player"
    v-show = "playlist.length>0"
  >
    <!-- 展开的播放器 -->
    <div
      class  = "normal-player"
      v-show = "fullScreen"
    >
      播放器
    </div>
    <!-- mini播放器 -->
    <div
      class  = "mini-player"
      v-show = "fullScreen"
    ></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name    : "player",
  computed: {
    //获取全局的播放设置参数
    ...mapGetters([
      "fullScreen",
      "playlist",
      "currentSong",
      "playing",
      "currentIndex",
      "currentSong",
      "mode",
      "sequenceList",
      "favoriteList"
    ])
  }
};
</script>

<style lang="less" scoped>
@import "~@/common/less/const.less";
@import "~@/common/less/mymixin.less";
.player {
  .normal-player {
    position  : fixed;
    left      : 0;
    right     : 0;
    top       : 0;
    bottom    : 0;
    z-index   : 150;
    background: @color-background;
    .background {
      position: absolute;
      left    : 0;
      top     : 0;
      width   : 100%;
      height  : 100%;
      z-index : -1;
      opacity : 0.6;
      filter  : blur(20px);
    }
  }
}
</style>