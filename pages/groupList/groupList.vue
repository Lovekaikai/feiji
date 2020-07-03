<!-- 拼团福利模块 -->
<template>
	<view class="group">
		<yu-kefu position="3"></yu-kefu>
		<!-- 标题 start -->
		<view class="title-wrap">
			<image src="https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/29/8413747f-68e9-4b0c-b645-2771ae5183c4.jpg" mode='widthFix' class="logo"></image>
		</view>
		<!-- 标题 end -->
		
		<!-- 拼团规则 -->
		<view class="group-rule">
			<view class="group-rule-right" @tap='goGroupRules'>
				<view class="iconImg">
					<image src="../../static/images/groupRule.png" mode=""></image>
				</view>
				<view class="title">拼团规则</view>
			</view>
		</view>
		
		<!-- 主体  start -->
		<view class="group-list">

			<view class="wucTabBox2">
				<wuc-tab :tab-list="tabList" textFlex :tabCur.sync="TabCur" tab-class="text-center " select-class="ative_tab" @change="change"></wuc-tab>
			</view>
			<joint-item @tap.native="goGoodsDetail(item)" v-for="(item,index) in jointList" :key="index" :item="item" :navIndex="navIndex" :hideLine="index == (jointList.length-1)">
			</joint-item>

			<view class="notThing" v-if="jointList.length===0">
				<image src="../../static/images/feedback/Artwork.png" mode="aspectFill"></image>
			</view>
		
		</view>
		<!-- 主体  end -->

		<!-- <view class="isOver" v-if="flag">到底了没有更多数据</view> -->

		<!-- 用户与回到顶部 -->
		<view class="index-ops">
			<!-- <view class="user"><image src="../../static/images/user.png" mode="" @tap="goUserInfo"></image></view> -->
			<view class="ops-goTop" @tap="top">
				<image src="../../static/images/goTop.png" mode="" v-if="topShow"></image>
			</view>
		</view>
		
		<!-- 拼团规则的弹窗 -->
		<popup :isPopup="isRule" @close='isRule = false'>
			<template #body>
				<view class="ruleImg">
					<image src="https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/29/dc50796c-d172-4438-a399-40223cb31cc7.jpg" mode="aspectFit"></image>
				</view>
			</template>
		</popup>
	</view>
</template>

<script>
import JointItem from "./components/JointItem.vue";
import WucTab from "./components/wuc-tab.vue";
import Popup from '@/components/rulePopup/Popup.vue'
// 客服按钮
import yuKefu from '@/components/yu-kefu/yu-kefu.vue'
// 函数节流
import throttle from '@/common/throttle.js';
export default {
  components: {
    JointItem,
    WucTab,
		Popup,
		yuKefu
  },
  data() {
    return {
      // 拼团数据
      jointList: [],
      tabList: [
        {
          name: "拼团中"
        },
        {
          name: "即将开团"
        }
      ],
      topShow: false, //回到顶部
      TabCur: 0,
      navIndex: 0,
      loadingType: "nomore",
      param: {
        type: 2, //拼团中
        pageNum: 1,
        pageSize: 10
      },
      total:"",//总条数
			isRule: false
    };
  },
  onLoad() {
    this.getGroupList();
  },
  //页面滚动到底部的事件 上拉加载更多
  onReachBottom() {
    //判断下拉到底 没有更多数据
    if (this.total < this.param.pageNum * this.param.pageSize) {
      // console.log("没有更多数据")     
      return;
    }
    this.param.pageNum++;
    this.getGroupList();
  },
  //下拉刷新
  onPullDownRefresh() {
    console.log("下拉刷新了");
    this.param.pageNum = 1;
    this.jointList = [];
    setTimeout(() => {
      this.getGroupList(() => {
        uni.stopPullDownRefresh();
      });
    }, 1000);
  },
  onShow() {
  },
  methods: {
    // 点击头部导航切换
    change(index) {
      console.log(index)
      this.jointList = [];
      this.navIndex = index;
	  this.param.pageNum=1
      switch (index) {
        case 0:
          this.param.type = 2;
          this.getGroupList();
          break;
        case 1:
          this.param.type = 3;
          this.getGroupList();
          break;
        default:
          break;
      }
    },
    //拼团活动列表
    getGroupList(callBack) {
      this.$common
        .httpGet(
          "/common-goods/upMall/groupon/listView/" +
            this.param.type +
            "?pageNum=" +
            this.param.pageNum +
            "&pageSize=" +
            this.param.pageSize
        )
        .then(res => {
          if (Number(res.data.code) === 200200) {
            // console.log(res)
            //把数据更新到原来数组添加
            this.jointList = [...this.jointList, ...res.data.data.list];
            this.total= res.data.data.total
            // console.log(this.total)
            callBack && callBack();
          } else {
			this.jointList = [];
            this.$common.showToast(res.data.message, "none");            
          }
        });
    },
    // 导航到拼团商品详情页
    goGoodsDetail: throttle.throttleFunc(function(item) {
		if(this.navIndex === 1)  return
		this.$common.navigateTo('../groupGoodsDetails/groupGoodsDetails?spuId=' + item.spuId);
	},500),
	
    onPageScroll(e) {
      if (e.scrollTop > 400) {
        this.topShow = true;
      } else {
        this.topShow = false;
      }
    },
    // 回到顶部
    top() {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    },
		// 前往拼团规则
		goGroupRules() {
			uni.navigateTo({
				url: './groupRules'
			})
		}
  }
};
</script>

<style lang="less" scoped>
.group {
  // 标题 start
  .title-wrap {
    image {
      width: 100%;
      height: 270rpx;
    }
    margin-bottom: 28rpx;
  }
  // 标题 end
	
	.group-rule {
		padding: 0 32rpx 28rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.group-rule-right {
			display: flex;
			align-items: center;
			.iconImg {
				width: 32rpx;
				height: 32rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.title {
				margin-left: 10rpx;
				color: #06B720;
				font-size: 24rpx;
				font-weight: 500;
				text-decoration: underline;
			}
		}
	}

  // 主体 start
  .group-list {
    background: #fff;
    padding: 0 32rpx;
  }
  .index-ops {
    position: fixed;
    bottom: 80rpx;
    right: 30rpx;
    .user {
      width: 100rpx;
      height: 100rpx;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .ops-goTop {
      margin-top: 14rpx;
      width: 100rpx;
      height: 100rpx;
      image {
        width: 100%;
        height: 100%;
      }
    }
  }
  .notThing {
		width: 100px;
		height: 100px;
		margin: 50px auto;
		image{
			width: 100%;
			height: 100%;
		}
  }
}

.ruleImg {
	width: 510rpx;
	height: 1000rpx;
	image {
		width: 100%;
		height: 100%;
	}
}
</style>
