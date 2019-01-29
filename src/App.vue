<template>
  <div id="app">
    <m-header></m-header>
    <m-tab></m-tab>
    <router-view></router-view>
  </div>
</template>

<script>
import MHeader from "components/m-header/header";
import MTab from "components/m-tab/tab";

export default {
   components:{
     MHeader,
     MTab
  }
}

</script>

<style scoped>

</style>
