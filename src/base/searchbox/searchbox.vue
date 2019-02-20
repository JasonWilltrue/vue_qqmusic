<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input type="text" class="box" v-model="query" ref="queryRef" :placeholder="placeholder">
    <i class="icon-dismiss" v-show="query" @click="clearQuery"></i>
  </div>
</template>

<script>
// import { myDOM } from '@/common/js/myutils.js'
export default {
  name: "searchbox",
  data () {
    return {
      query: ""
    }
  },
  props: {
    placeholder: {
      type   : String,
      default: '搜索歌曲或歌手'
    },
  },
  methods: {
    // 给父亲用的，让输入框失去焦点，避免滚动搜索结果时移动端键盘遮挡
    blur () {
      this.$refs.queryRef.blur()
    },
    // 给父亲用的，传进搜索框的值
    // this.$refs.searchBoxRef.getQuery(v)
    getQuery (v) {
      this.query = v
    },
    //清空搜索框
    clearQuery () {
      this.query = ''
    }
  },
  created(){
    this.$watch('query', (newQuery) => {
      this.$emit('query', newQuery)
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/common/less/const.less";
@import "~@/common/less/mymixin.less";

.search-box {
  display      : flex;
  align-items  : center;
  box-sizing   : border-box;
  width        : 100%;
  padding      : 0 6px;
  height       : 40px;
  background   : @color-highlight-background;
  border-radius: 6px;
  .icon-search {
    font-size: 24px;
    color    : @color-background;
  }
  .box {
    flex      : 1;
    margin    : 0 5px;
    border    : 0;
    outline   : none;
    background: @color-highlight-background;
    color     : @color-text;
    font-size : @font-size-medium;
  }
  .box::placeholder {
    color: @color-theme;
  }
  .icon-dismiss {
    font-size: 16px;
    color    : @color-background;
  }
}
</style>