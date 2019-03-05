<template>
  <div class="song-list">
    <ul>
      <li v-for="(song,index) in songs" :key="song.id" class="item" @click="selectItem(song,index)">
        <!-- 排行奖杯图片 -->
        <div class="rank" v-show="rank">
          <span class="icon" :class="getRankCls(index)">{{ getRankTxt(index) }}</span>
        </div>
        <!-- 内容 -->
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name : "songlist",
  props: {
    songs: {
      type   : Array,
      default: []
    },
    rank: {
      type   : Boolean,
      default: false     //排行榜组件中需要用到
    }
  },
  methods: {
    getDesc (song) {
      return `${song.singer}--${song.album}`;
    },
    getRankCls (index) {
      if (index === 0) {
        return "icon0";
      } else if (index === 1) {
        return "icon1";
      } else if (index === 2) {
        return "icon2";
      } else {
        return "text";
      }
    },
    // 排行奖杯文案
    getRankTxt (index) {
      if (index > 2) {
        return index + 1;
      }
    },
    selectItem (song, index) {
      this.$emit("select", song, index);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/common/less/const.less";
@import "~@/common/less/mymixin.less";
.song-list {
  .item {
    display    : flex;
    align-items: center;
    box-sizing : border-box;
    height     : 64px;
    font-size  : @font-size-medium;
    .rank {
      flex        : 0 0 25px;
      width       : 25px;
      margin-right: 30px;
      text-align  : center;
      .icon {
        display        : inline-block;
        width          : 25px;
        height         : 25px;
        background-size: 25px 24px;
        &.icon0 {
          .bg-image("first");
        }
        &.icon1 {
          .bg-image("second");
        }
        &.icon2 {
          .bg-image("third");
        }
      }
      .text {
        color    : @color-theme;
        font-size: @font-size-large;
      }
    }
    .content {
      flex       : 1;
      line-height: 20px;
      overflow   : hidden;
      .name {
        .no-wrap();
        color: @color-text;
      }
      .desc {
        .no-wrap();
        margin-top: 4px;
        color     : @color-text-d;
      }
    }
  }
}
</style>