<template>
  <div id="app">
    <m-header></m-header>
    <m-tab></m-tab>
    <!-- 把dom缓存到内存中优化体验 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import MHeader from "components/m-header/header";
import MTab from "components/m-tab/tab";

export default {
  components: {
    MHeader,
    MTab
  }
};
</script>

<style scoped>
</style>
