<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { getSongList } from "api/recommend";
import { ERROR_OK } from "api/config";
import { createSingerSong } from "common/js/song";
import MusicList from "components/m-musiclist/musiclist";

export default {
  name: 'songlistdetail',
   data() {
    return {
      songs: []
    };
  },
  created() {

    console.log(this.songlist.dissid);
    
    this._getSongList();
  },
  methods: {
     // 获取歌单数据
    _getSongList () {
      // 禁止直接刷新详情页（获取不到歌单 id）
      if (!this.songlist.dissid) {
        console.log('没有发现dissid');
        this.$router.push('/recommend')
        return
      }

      getSongList(this.songlist.dissid).then((res) => {
        if (res.code === 0) {
           console.log('推荐歌单',res)
          this.songs = this._formatSongs(res.cdlist[0].songlist)
        }
      })
    },
    // 重组 res.cdlist[0].songlist 数据
    _formatSongs (list) {
      let result = []

      list.forEach((item) => {
        if (item.songid && item.albummid) {
          result.push(createSingerSong(item))
        }
      })
      return result
    }
  },
  computed: {
    // vuex, 使用对象展开运算符将 getters 混入 computed 对象中
    ...mapGetters(['songlist']),
    // 传入子组件
    title () {
      return this.songlist.dissname
    },
    // 传入子组件
    bgImage () {
      return this.songlist.imgurl
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="less" scoped>
@import "~@/common/less/const.less";
@import "~@/common/less/mymixin.less";

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter,
.slide-leave-to {
  opacity  : 0;
  transform: translate3d(100%, 0, 0);
}
</style>