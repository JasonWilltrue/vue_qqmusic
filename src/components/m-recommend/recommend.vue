<!-- 推荐页组件 -->

<template>
  <div
    class = "my-recommend"
    ref   = "recommendRef"
  >
    <!-- better-scroll 滚动组件，当请求到 lists 时才渲染 -->
    <div
      ref   = "scroll"
      class = "recommend-content"
    >
      <div>
        <!-- 轮播图，当请求到 recommends 时才渲染 -->
        <div
          v-if  = "recommends.length"
          class = "slide-wrapper"
        >
          <m-slider>
            <div
                v-for = "item in recommends"
              :key    = "item.id"
            >
              <a :href="item.linkUrl">
                <img
                  :src    = "item.picUrl"
                    class = "needsclick"
                >
              </a>
            </div>
          </m-slider>
        </div>

        <!-- 歌单推荐列表 -->
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>

        </div>
      </div>
      <!-- loading 组件 -->
      <div class="loading-container">

      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { getRecommend, getDiscList } from "api/recommend";
import { ERROR_OK } from "api/config";
import MSlider from "base/slider/slider";
export default {
  name: "recommend",
  data() {
    return {
      recommends: []
    };
  },
  created() {
    this._getRecommed();
    this._getDiscList();
  },
  methods: {
    _getRecommed() {
      getRecommend().then(res => {
        if (res.code === ERROR_OK) {
          console.log(res.data.slider);
          this.recommends = res.data.slider;
        }
      });
    },
    _getDiscList() {
      getDiscList().then(res => {
        if (res.code == ERROR_OK) {
          console.log(res.data);
        }
      });
    }
  },
  components: {
    MSlider
  }
};
</script>

<style lang="less" scoped>
@import "~@/common/less/const.less";
@import "~@/common/less/mymixin.less";

.my-recommend {
  position: fixed;
  width   : 100%;
  top     : 88px;
  bottom  : 0;
  .recommend-content {
    height  : 100%;
    overflow: hidden;
    .slide-wrapper {
      position: relative;
      width   : 100%;
      overflow: hidden;
    }
    .recommend-list {
      .list-title {
        height     : 65px;
        line-height: 65px;
        text-align : center;
        font-size  : @font-size-medium;
        color      : @color-theme;
      }
      .item {
        display    : flex;
        align-items: center;
        box-sizing : border-box;
        padding    : 0 20px 20px 20px;
        .icon {
          flex         : 0 0 60px;
          width        : 60px;
          padding-right: 20px;
        }
        .text {
          display        : flex;
          flex-direction : column;
          justify-content: center;
          flex           : 1;
          line-height    : 20px;
          overflow       : hidden;
          font-size      : @font-size-medium;
          .name {
            margin-bottom: 10px;
            color        : @color-text;
          }
          .desc {
            color: @color-text-d;
          }
        }
      }
    }
    .loading-container {
      position : absolute;
      width    : 100%;
      top      : 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
</style>
