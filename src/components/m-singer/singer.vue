<template>
  <div
    class = "singer"
    ref   = "singerRef"
  >
    <router-view></router-view>

  </div>
</template>

<script>
import MScroll from "base/scroll/scroll";
import MLoadding from "base/loadding/loadding";
import { getSingerList } from "api/singer";
import { ERROR_OK } from "api/config";
export default {
  name: "singer",
  data() {
    return {
      singerList: []
    };
  },
  created() {
    this._getSingerList();
  },
  methods: {
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code == ERROR_OK) {
          console.log(res.data);
          this.singerList = res.data.list;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/common/less/const.less";
@import "~@/common/less/mymixin.less";
.my-singer {
  position: fixed;
  top     : 88px;
  bottom  : 0;
  width   : 100%;
}
</style>
