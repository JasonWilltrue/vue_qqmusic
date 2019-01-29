<template>
   <div class="my-recommend" ref="recommendRef">
     <!-- better-scroll 滚动组件，当请求到 lists 时才渲染 -->
        <div class="recommend-content">
          <!-- 轮播图，当请求到 recommends 时才渲染 -->
          <div v-if="recommends.length" class="silder-wrapper">
             <m-slider v-for="item in recommends" :key="item.id">
                <a :href="item.linkUrl">
                  <img :src="item.picUrl" alt="luobo">
                </a>
             </m-slider>
          </div>
          <div class="recommend-list">
            <h1 class="list-title">热门歌单推荐</h1>
          </div>
        </div>
   </div>
</template>

<script>
  import {getRecommend} from 'api/recommend';
  import {ERROR_OK} from 'api/config';
   import MSlider from 'base/slider/slider'
  export default {
     name:"recommend",
     data() {
       return {
         recommends: []
       }
     },
     created() {
       this._getRecommed()
     },
     methods: {
       _getRecommed() {
         getRecommend().then(res=>{
           if(res.code === ERROR_OK){
             console.log(res.data.slider);
             this.recommends = res.data.slider;
           }
         })
       }
     },
     components: {
       MSlider
     }
  }
</script>

<style lang="less" scoped>
@import '~@/common/less/const.less';
@import '~@/common/less/mymixin.less';

.my-recommend{
  position: fixed;
  width: 100%;
  height: 88px;
  bottom:0;
  .recommend-content{
    height: 100%;
    overflow: hidden;
    .silder-wrapper{
      position: relative;
      width: 100%;
      overflow: hidden;
    }
    .recommend-list{
      .list-title{
         height: 65px;
         line-height: 65px;
         text-align: center;
         font-size: @font-size-medium;
         color: @color-theme;
       }
    }
  }

}
</style>
