<!--tab切换 -->
<template>
  <ul class="switches">
    <li
        class  = "switch-item"
      :class   = "{'active':currentIndex === index}"
        v-for  = "(item, index) in switches"
      :key     = "index"
        @click = "switchItem(index)"
    >
      <span>{{ item.name }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    switches: {
      type   : Array,
      default: []
    },
    currentIndex: {
      type   : Number,
      default: 0
    }
  },
  watch  : {},
  methods: {
    // 开关被切换了，通知父组件
    switchItem (index) {
      this.$emit('switch', index)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/common/less/const.less";
@import "~@/common/less/mymixin.less";

.switches {
  display      : flex;
  align-items  : center;
  width        : 240px;
  margin       : 0 auto;
  border       : 1px solid @color-highlight-background;
  border-radius: 5px;
  .switch-item {
    flex      : 1;
    padding   : 8px;
    text-align: center;
    font-size : @font-size-medium;
    color     : @color-text-d;
    &.active {
      background: @color-highlight-background;
      color     : @color-text;
    }
  }
}
</style>



<!--
开关切换 组件

<my-switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></my-switches>

// 切换开关文案
switches: [
  {name: '最近播放'},
  {name: '搜索历史'}
],
// 当前切换开关
currentIndex: 0

switchItem(index) {
  this.currentIndex = index
}
 -->