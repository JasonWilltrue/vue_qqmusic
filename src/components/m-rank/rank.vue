<template>
  <div class="rank" ref="rankRef">
    <!-- 排行榜数据 -->
    <m-scroll class="toplist" ref="scrollRef" :data="toplist">
      <ul>
        <li class="item" v-for="(item,index) in toplist" @click="selectItem(item)" :key="index">
          <!-- 左图 -->
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl" @load="loadImg">
          </div>

          <!-- 右歌 -->
          <ul class="songlist">
            <!-- <h3 class="title">{{ item.topTitle }}</h3> -->
            <li class="song" v-for="(song, index) in item.songList" :key="index">
              <span>{{ index + 1 }}</span>
              <span class="song-text">{{ song.songname }}</span>
              <span class="singername">- {{ song.singername }}</span>
            </li>
          </ul>
        </li>
      </ul>

      <!-- loading 组件 -->
      <div v-show="!toplist.length" class="loading-container">
        <m-loadding></m-loadding>
      </div>
    </m-scroll>

    <router-view></router-view>
  </div>
</template>

<script>
import MScroll from "base/scroll/scroll";
import MLoadding from "base/loadding/loadding";
import { ERROR_OK } from "api/config";
import { getRankList } from "api/rank";
import { playlistMixin } from 'common/js/mixin.js'
import { mapMutations } from "vuex";

export default {
    mixins    : [playlistMixin],
    name      : "rank",
    components: {
    MScroll,
    MLoadding
  },
  data () {
    return {
      toplist: []
    }
  },
  created () {
    this._getRankList()
  },
  methods: {
     ...mapMutations({
        setRankList: 'SET_RANKLIST'
     }),
     // 当有迷你播放器时，调整滚动底部距离
    handlePlaylist (playlist) {
      let bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.rankRef.style.bottom = bottom
      this.$refs.scrollRef.refresh()
    },
    _getRankList () {
      getRankList().then((res) => {
        if (res.code === ERROR_OK) {
          // console.log(res)
          setTimeout(() => {
             this.toplist = res.data.topList
          }, 500);
         
        }
      })
    },
    // 当首次获取到图片时，Better-scroll 重新计算
    loadImg () {
      if (!this.flag) {
        this.$refs.scrollRef.refresh()
        this.flag = true
      }
    },
    selectItem (item) {
      this.$router.push({path:`/rank/${item.id}`})
      // 写入 vuex
      this.setRankList(item)
    }
  },
}
</script>

<style lang="less" scoped>
@import "~@/common/less/const.less";
@import "~@/common/less/mymixin.less";

.rank {
  position: fixed;
  width   : 100%;
  top     : 88px;
  bottom  : 0;
  .toplist {
    height  : 100%;
    overflow: hidden;
    .item {
      display    : flex;
      margin     : 0 20px;
      padding-top: 20px;
      height     : 100px;
      &:last-child {
        padding-bottom: 20px;
      }
      .icon {
        flex  : 0 0 100px;
        width : 100px;
        height: 100px;
      }
      .songlist{
        flex           : 1;
        display        : flex;
        flex-direction : column;
        justify-content: center;
        padding        : 0 20px;
        height         : 100px;
        overflow       : hidden;
        background     : @color-highlight-background;
        color          : @color-text-d;
        font-size      : @font-size-medium;
        .song {
          .no-wrap();
          line-height: 26px;
          .song-text{
            padding-left: 6px;
          }
          .singername {
            color: rgba(255, 255, 255, 0.2);
          }
        }
      }
    }
  }
  .loading-container {
    position : absolute;
    width    : 100%;
    top      : 50%;
    transform: translateY(-50%);
  }
}
</style>
