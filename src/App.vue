<template>
  <div id="app">
    <m-header></m-header>
    <m-tab></m-tab>
    <!-- 把dom缓存到内存中优化体验 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <m-player></m-player>
  </div>
</template>

<script>
import MHeader from "components/m-header/header";
import MTab from "components/m-tab/tab";
import MPlayer from "components/m-player/player";
export default {
  components: {
    MHeader,
    MTab,
    MPlayer
  }
};
</script>

<style scoped>
</style>
