<template>
	<view class="joint-item">
		<view class="content">
			<image class="good-image" :src="item.cover"></image>
			<view class="item-right">
				<!-- 商品名 -->
				<view class="good-name" style="font-weight: 600;">{{item.title}}</view>
				<!-- 拼团进度条 -->
				<view class="sold">
					<slot>
						<progress-bar v-if="navIndex==0" :sold="item.maxProgress"></progress-bar>
						<text v-if="navIndex==1" class="time">{{item.startTime}} 开团</text>
					</slot>
					<text class="sold-num">{{ item.groupCount }}人成团</text>
				</view>
				<!-- 折扣提醒 -->
				<view class="discount">
					<text class="discount-wrap" v-for="(subitem,index) in item.tag" :key="index">{{ subitem }}</text>
				</view>
				<!-- 价钱 模块 -->
				<view class="price-wrap">
					<view class="price"  >
						<view class="new-price" style="font-weight: 600;">
							￥
							<text>{{ item.grouponPrice }}</text>
						</view>
						<text class="old-price">￥{{ item.initPrice }}</text>
					</view>
					<button  type="primary" class="join-btn" v-if="navIndex==0">
						<text>立即参团</text>
					</button>
				</view>
			</view>
		</view>
		<!-- 下划线 -->
		<view class="line" v-if="!hideLine"></view>
	</view>
</template>

<script>
import ProgressBar from "@/components/progress-bar/ProgressBar.vue";
export default {
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    },
    navIndex: {
      type: Number,
      default: 0
    },
    hideLine: {
      type: Boolean,
      default: true
    }
  },
  components: {
    ProgressBar
  },
  // methods: {
  //   navigator(id) {
	 //  if(this.navIndex == 1) return
  //     this.$emit('goodsItemClick',id)
  //     // console.log(666);
  //   }
  // }
};
</script>

<style lang="less" scoped>
.joint-item {
  // 对于动态生成的dom nth无效
  // &:not(:last-child) {
  // 	border-bottom: 1px solid #f2f2f2;
  // }
  .content {
    display: flex;
    padding: 22upx 0;
    .good-image {
      width: 240upx;
      height: 240upx;
    }
    .item-right {
      flex: 1;
      flex-wrap: wrap;
      padding-left: 20upx;
      .good-name {
        font-size: 26upx;
        font-weight: 700;
        color: #000;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .sold {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 24upx 0;
        font-family: PingFang SC;
        // .scroll {
        // 	position: relative;
        // 	width: 269upx;
        // 	height: 24upx;
        // 	background-color: #a4c4f5;
        // 	border-radius: 12upx;
        // 	.per {
        // 		position: absolute;
        // 		left: 0;
        // 		// width: 50%;  width需要动态生成
        // 		height: 24upx;
        // 		background-color: #06B720;
        // 		border-radius: 12upx;
        // 	}
        // 	.per-desc {
        // 		position: absolute;
        // 		color: #fff;
        // 		font-size: 20upx;
        // 		top: 50%;
        // 		left: 50%;
        // 		transform: translate(-50%, -50%);
        // 	}
        // }
        .time {
          font-size: 20upx;
          font-weight: bold;
          color: rgba(227, 0, 0, 1);
        }
        .sold-num {
          font-size: 24upx;
          font-weight: 500;
          color: #06B720;
        }
      }
      .discount {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .discount-wrap {
          margin: 10upx 0;
          height: 40upx;
          line-height: 40upx;
          background-color: #a4c4f5;
          font-size: 20upx;
          color: #fff;
          text-align: center;
          border-radius: 20upx;
          padding: 6upx 18upx;
          letter-spacing: 1px;
        }
      }
      .price-wrap {
        display: flex;
        justify-content: space-between;
        margin-top: 20upx;
        .price {
          display: flex;
          align-items: center;
          font-size: 24upx;
          font-family: PingFang SC;
          .new-price {
            font-weight: bold;
            color: #06B720;
            margin-right: 12upx;
              font-size: 36upx;
            > text {
              font-size: 34upx;
            }
          }
          .old-price {
            color: rgba(128, 128, 128, 1);
            font-weight: 500;
            text-decoration: line-through;
            // line-height: 32upx;
            padding-top: 5upx;
          }
        }
        .join-btn {
        	padding: 0 25upx;
        	height: 52upx;
          background: #06B720;
        	color: #fff;
        	font-size: 24upx;
        	line-height: 52upx;
        	border-radius: 26upx;
        	margin: 0;
        }
      }
    }
  }
  .line {
    height: 1px;
    background: #f2f2f2;
    width: 100%;
  }
}
</style>
