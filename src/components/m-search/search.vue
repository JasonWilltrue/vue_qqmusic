<template>
  <div class="search">
    <div class="search-box-wrapper">
      <!-- 搜索框 -->
      <search-box @query="onQueryChange" ref="searchBoxRef"></search-box>
      <div class="shortcut-wrapper" v-show="!query" ref="shortcutRef">
        <div class="shortcut" ref="scrollRef">
          <!-- 热门搜索 -->
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li
                class="item"
                v-for="(item,index) in hotkey"
                :key="index"
                @click="addQuery(item.k)"
              >
                <span>{{ item.k }}</span>
              </li>
            </ul>
          </div>
          <!-- 搜索历史 -->
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteHis"></search-list>
          </div>
          <!-- 搜索历史 -->
        </div>
      </div>
    </div>
    <!-- 搜索结果 -->
    <div class="search-result" ref="resultRef" v-show="query">
      <suggest-List
        ref="suggestRef"
        :query="query"
        :zhida="zhida"
        @select="saveHisory"
        @beforeScroll="blurInput"
      ></suggest-List>
    </div>
    <!-- 清空弹窗 -->
    <m-confirm ref="confirmRef" @confirm="confirm" @cancel="cancel"></m-confirm>
    <router-view></router-view>
  </div>
</template>

<script>

import SearchBox from 'base/searchbox/searchbox';
import SuggestList from 'components/m-suggestlist/suggestlist'
import MConfirm from "components/m-confirm/confirm";
import { getHotKey } from "api/search";
import SearchList from "base/searchlist/searchlist";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "search",
  data () {
    return {
      // 热门搜索关键系
      hotkey: [],
      // 搜索字段 (my-search-box -> my-search -> my-suggest-List)
      query: '',
      // 是否显示歌手
      zhida: true,
      refreshDelay: 100
    }
  },
  created () {
    this._getHotKey()
  },
  components: {
    SearchBox,
    SuggestList,
    SearchList,
    MConfirm
  },
  methods: {
    ...mapActions(['saveHistory', 'delHistory', 'clearHistory']),
    onQueryChange (v) {
      console.log(v);
      this.query = v
    },
    // 保存搜索结果历史到 vuex 和 localstorage 中
    saveHisory () {
      this.saveHistory(this.query)
    },
    addQuery (k) {
      this.$refs.searchBoxRef.getQuery(k)
    },
    // 滚动前触发事件
    blurInput () {
      this.$refs.searchBoxRef.blur()
    },
    //显示弹窗
    showConfirm () {
      this.$refs.confirmRef.show()
    },
    confirm () {
      this.clearHistory()
    },
    cancel () {
      return
    },
    deleteHis (item) {
      this.delHistory(item);
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
  computed: {
    ...mapGetters(['searchHistory']),
    scrollData () {
      console.log('搜索历史：', searchHistory);
      return this.hotkey.concat(this.searchHistory)
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
  .shortcut-wrapper {
    position: fixed;
    top: 170px;
    bottom: 0;
    width: 100%;
    .shortcut {
      height: 100%;
      overflow: hidden;
      .hot-key {
        margin: 0 20px 0 20px;
        .title {
          margin-bottom: 20px;
          font-size: @font-size-medium;
          color: @color-text-l;
        }
        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          background: @color-highlight-background;
          font-size: @font-size-medium;
          color: @color-text-d;
        }
        &.special {
          color: rgba(255, 255, 255, 0.7);
        }
      }
      .search-history {
        position: relative;
        margin: 0 20px 0 20px;
        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: @font-size-medium;
          color: @color-text-l;
          .text {
            flex: 1;
          }
          .clear {
            padding-right: 20px;
            .extend-click();
            .icon-clear {
              font-size: @font-size-medium;
              color: @color-text-d;
            }
          }
        }
      }
    }
  }
  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
}
</style>
