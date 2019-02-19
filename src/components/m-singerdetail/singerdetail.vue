<template>
  <transition name="slide">
    <music-list
      :songs    = "songs"
      :title    = "title"
      :bg-image = "bgImage"
    ></music-list>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { getSingerDetail } from "api/singer";
import { ERROR_OK } from "api/config";
import { createSingerSong } from "common/js/song";
import MusicList from "components/m-musiclist/musiclist";

export default {
  name: "singerdetail",
  data() {
    return {
      songs: []
    };
  },
  created() {
    console.log(this.singer);
    this._getSingerDetail();
  },
  methods: {
    _getSingerDetail() {
      // 禁止直接刷新详情页（获取不到歌手 id）
      if (!this.singer.id) {
        this.$router.push({
          path: "/singer"
        });
        return;
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERROR_OK) {
          this.songs = this._formatSongs(res.data.list);
          console.log(this.songs); //[Song, Song, Song, Song, Song, Song]
        }
      });
    },
    _formatSongs(list) {
      let result = [];
      list.forEach(item => {
        let { musicData } = item;  //es6结构赋值
        if (musicData.songid && musicData.albummid) {
          result.push(createSingerSong(musicData));
        }
      });
      return result;
    }
  },
  computed: {
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    },
    // vuex, 使用对象展开运算符将 getters 混入 computed 对象中
    ...mapGetters(["singer"])
  },
  components: {
    MusicList
  }
};
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