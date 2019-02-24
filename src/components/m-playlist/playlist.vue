<template>
  <transition name="list-fade">
    <div class="playlist" @click="hide" v-show="showFlag">
      <div class="list-wrapper" @click.stop>
        <!-- 头部操作 -->
        <div class="list-header">
          <h1 class="title">
            <i class="icon"></i>
            <span class="text"></span>
            <span class="clear">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <!-- 中部列表 -->
        <div class="list-content" ref="scrollRef">
          <ul>
            <li class="item" v-for="item in sequenceList" :key="item.id">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{ item.name }}</span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span class="detlete">
                <i class="icon-delete"></i>
              </span>
            </li>
          </ul>
        </div>
        <!-- 添加按钮 -->
        <div class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>

        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "playlist",
  data () {
    return {
      showFlag    : false,
      refreshDelay: 100
    }
  },
  methods: {
    show () {
      this.showFlag = true
    },
    hide () {
      this.showFlag = false
    },
     // 当前播放歌曲前面的图标
    getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return 'icon-play'
      }
      return ''
    },
   
  },
  computed: {
    ...mapGetters(['sequenceList', 'currentSong', 'mode', 'playlist', 'favoriteList']),
     // 播放模式对应图标字体
    iconMode () {
      let cls = ''
      if (this.mode === 0) {
        cls = 'icon-sequence'
      } else if (this.mode === 1) {
        cls = 'icon-loop'
      } else if (this.mode === 2) {
        cls = 'icon-random'
      } else {
        cls = ''
      }
      return cls
    },
  },

}
</script>

<style lang="less" scoped>
@import "~@/common/less/const.less";
@import "~@/common/less/mymixin.less";

.playlist {
  position        : fixed;
  top             : 0;
  left            : 0;
  right           : 0;
  bottom          : 0;
  z-index         : 200;
  background-color: @color-background-d;
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position        : absolute;
    left            : 0;
    bottom          : 0;
    width           : 100%;
    background-color: @color-highlight-background;
    .list-header {
      position: relative;
      padding : 20px 30px 10px 20px;
      .title {
        display    : flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size   : 30px;
          color       : @color-theme-d;
        }
        .text {
          flex     : 1;
          font-size: @font-size-medium;
          color    : @color-text-l;
        }
        .clear {
          .extend-click();
          .icon-clear {
            font-size: @font-size-medium;
            color    : @color-text-d;
          }
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow  : hidden;
      .item {
        display    : flex;
        align-items: center;
        height     : 40px;
        padding    : 0 30px 0 20px;
        overflow   : hidden;
        &.list-enter-active,
        &.list-leave-active {
          transition: all 0.1s;
        }
        &.list-enter,
        &.list-leave-to {
          height: 0;
        }
        .current {
          flex     : 0 0 20px;
          width    : 20px;
          font-size: @font-size-small;
          color    : @color-theme-d;
        }
        .text {
          flex: 1;
          .no-wrap();
          font-size: @font-size-medium;
          color    : @color-text-d;
        }
        .like {
          .extend-click();
          margin-right: 15px;
          font-size   : @font-size-small;
          color       : @color-theme;
          .icon-favorite {
            color: @color-sub-theme;
          }
        }
        .delete {
          .extend-click();
          font-size: @font-size-small;
          color    : @color-theme;
        }
      }
    }
    .list-operate {
      width : 140px;
      margin: 20px auto 30px auto;
      .add {
        display      : flex;
        align-items  : center;
        padding      : 8px 16px;
        border       : 1px solid @color-text-l;
        border-radius: 100px;
        color        : @color-text-l;
        .icon-add {
          margin-right: 5px;
          font-size   : @font-size-small-s;
        }
        .text {
          font-size: @font-size-small;
        }
      }
    }
    .list-close {
      text-align : center;
      line-height: 50px;
      background : @color-background;
      font-size  : @font-size-medium-x;
      color      : @color-text-l;
    }
  }
}
</style>