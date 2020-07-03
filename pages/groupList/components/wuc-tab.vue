<template>
  <scroll-view class="wuc-tab" :class="tabClass" :style="tabStyle" scroll-with-animation scroll-x :scroll-left="scrollLeft">
    <!--    <div v-if="!textFlex">
      <div class="wuc-tab-item" :class="[index === tabCur ? selectClass + ' cur':'']" v-for="(item,index) in tabList" :key="index" :id="index" @tap="tabSelect(index,$event)">
        <text :class="item.icon"></text>
        <span>{{item.name}}</span>
      </div>
    </div> -->

    <div class="flex text-center" v-if="textFlex">
      <div class="wuc-tab-item flex-sub" :class="index === tabCur ? selectClass + ' cur':''" v-for="(item,index) in tabList" :key="index" :id="index" @tap="tabSelect(index,$event)">
        <text :class="item.icon"></text>
        <span>{{item.name}}</span>
      </div>
    </div>
  </scroll-view>
</template>
<script>
export default {
  name: "wuc-tab",
  data() {
    return {};
  },
  props: {
    tabList: {
      type: Array,
      default() {
        return [];
      }
    },
    tabCur: {
      type: Number,
      default() {
        return 0;
      }
    },
    tabClass: {
      type: String,
      default() {
        return "";
      }
    },
    tabStyle: {
      type: String,
      default() {
        return "";
      }
    },
    textFlex: {
      type: Boolean,
      default() {
        return false;
      }
    },
    selectClass: {
      type: String,
      default() {
        return "text-blue";
      }
    }
  },
  created() {
    console.log(this.tabList);
  },
  methods: {
    tabSelect(index, e) {
      if (this.currentTab === index) return false;
      this.$emit("update:tabCur", index);
      this.$emit("change", index);
    }
  },
  computed: {
    scrollLeft() {
      return (this.tabCur - 1) * 60;
    }
  }
};
</script>
<style>
div,
scroll-view,
swiper {
  box-sizing: border-box;
}
.wuc-tab {
  white-space: nowrap;
}
.wuc-tab-item {
  /* height: 90upx;
  display: inline-block;
  line-height: 90upx;
  margin: 0 10upx;
  padding: 0 20upx; */

  width: 343upx;
  height: 80upx;
  line-height: 80upx;
  background: rgba(255, 255, 255, 1);
  border-radius: 16upx 16upx 0px 0upx;
}

.wuc-tab-item.cur {
  /* border-bottom: 4upx solid; */
  background: rgba(164, 196, 245, 1);
  border-radius: 16upx 16upx 0upx 0upx;
}

.wuc-tab.fixed {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1024;
  box-shadow: 0 1upx 6upx rgba(0, 0, 0, 0.1);
}

.flex {
  display: flex;
}
.text-center {
  text-align: center;
  z-index: 2000;
}
.flex-sub {
  flex: 1;
  /* font-size: 28upx;
  font-family: PingFang-SC-Medium;
  font-weight: 500; */
  font-size: 30upx;
  font-family: PingFang SC;
  font-weight: bold;
  color: #06B720;

} 
.text-blue {
  color: #0081ff;
}
.text-white {
  color: #ffffff;
}

.bg-white {
  background-color: #ffffff;
}
.bg-blue {
  background-color: #0081ff;
}
.text-orange {
  color: #4a90e2;
}

.text-xl {
  font-size: 24upx;
}
/* tab样式 */
.ative_tab {
  font-size: 30upx;
  font-family: PingFang SC;
  font-weight: 500;
  color:rgba(230,230,230,1);
}
</style>
