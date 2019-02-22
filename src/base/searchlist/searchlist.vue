<!-- 搜索历史列表 组件 -->
<template>
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li :key="item" class="search-item" @click="selectItem(item)" v-for="item in searches">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
   name : 'searchlist',
   props: {
    searches: {
      type   : Array,
      default: []
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    deleteOne(item) {
      this.$emit('delete', item)
    }
  },
  // 过滤器设计目的就是用于简单的文本转换
  filters: {},
  // 若要实现更复杂的数据变换，你应该使用计算属性
  computed: {},
}
</script>

<style lang="less" scoped>
@import "~@/common/less/const.less";
@import "~@/common/less/mymixin.less";

.search-list {
  .search-item {
    display    : flex;
    align-items: center;
    height     : 40px;
    overflow   : hidden;
    &.list-enter-active, &.list-leave-active {
      transition: all 0.1s;
    }
    &.list-enter, &.list-leave-to {
      height: 0;
    }
    .text {
      flex     : 1;
      color    : @color-text-l;
      font-size: @font-size-medium;
    }
    .icon {
      padding-right: 20px;
      .extend-click();
      .icon-delete {
        font-size: @font-size-small;
        color    : @color-text-d;
      }
    }
  }
}
</style>
