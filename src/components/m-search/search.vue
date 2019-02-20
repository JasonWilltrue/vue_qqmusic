<template>
  <div class="search">
    <div class="search-box-wrapper">
      <!-- 搜索框 -->
      <search-box @query="onQueryChange"></search-box>
      <div class="shortcut-wrapper" v-show="!query" ref="shortcutRef">
        <div class="shortcut" ref="scrollRef">
          <!-- 热门搜索 -->
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="(item,index) in hotkey" :key="index">
                <span>{{ item.k }}</span>
              </li>
            </ul>
          </div>
          <!-- 搜索历史 -->

        </div>
      </div>
    </div>
  </div>
</template>

<script>

import SearchBox from 'base/searchbox/searchbox';
import { getHotKey } from "api/search";
export default {
  name: "search",
  data () {
    return {
      // 热门搜索关键系
      hotkey: [],
      // 搜索字段 (my-search-box -> my-search -> my-suggest-List)
      query: '',
      // 是否显示歌手
      zhida       : true,
      refreshDelay: 100
    }
  },
  created () {
    this._getHotKey()
  },
  components: {
    SearchBox
  },
  methods: {
    onQueryChange (v) {
      this.query = query
    },
    _getHotKey () {
      getHotKey().then((res) => {
        if (res.code === 0) {
          console.log(res.data.hotkey)
          this.hotkey = res.data.hotkey.slice(0, 10)
        }
      })
    }
  },
  watch: {
    query (newValue, oldValue) {
      console.log(newValue, oldValue);
    }
  },
}
</script>

<style lang="less" scoped>
@import "~@/common/less/const.less";
@import "~@/common/less/mymixin.less";

.search {
  .search-box-wrapper {
    margin: 20px;
  }
  .shortcut-wrapper{
    position: fixed;
    top     : 170px;
    bottom  : 0;
    width   : 100%;
    .shortcut{
      height  : 100%;
      overflow: hidden;
      .hot-key{
        margin: 0 20px 0 20px;
        .title{
          margin-bottom: 20px;
          font-size    : @font-size-medium;
          color        : @color-text-l;
        }
        .item{
          display   : inline-block;
          padding   : 5px 10px;
          margin    : 0 20px 10px 0;
          background: @color-highlight-background;
          font-size : @font-size-medium;
          color     : @color-text-d;
        }
        &.special{
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }
  }
}
</style>
