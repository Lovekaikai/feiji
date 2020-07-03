<!-- 拼团福利模块 -->
<template>
	<view class="shopping-joint">
		<!-- 标题 start -->
		<view class="title-wrap">
			<view class="left-wrap">
				<text>拼团福利</text>
				<text>正品福利</text>
			</view>
			<view class="right-wrap" @tap="goGroupList">
				查看更多
				<view class="arrow"></view>
			</view>
		</view>
		<!-- 标题 end -->

		<!-- 主体  start -->
		<view class="group-list">
			<joint-item v-for="(item,index) in activityList" 
			:key="index" :item="item" :hideLine="index == (activityList.length-1)" @tap.native="buttonClick(item)">
			</joint-item>
		</view>
		<!-- 主体  end -->
	</view>
</template>

<script>
import JointItem from '@/components/joint-item/JointItem.vue';
// 函数节流
import throttle from '@/common/throttle.js';
export default {
	props: {
		activityList: {
			type: Array,
			default() {
				return []
			}
		}
	},
	components: {
		JointItem
	},
	methods: {
		// 跳转到更多的拼团商品列表
		goGroupList () {
			uni.navigateTo({
				url: '../../pages/groupList/groupList'
			})
		},
		buttonClick: throttle.throttleFunc(function(item) {
			this.$common.navigateTo('../groupGoodsDetails/groupGoodsDetails?spuId=' + item.spuId);
		},500)
	}
};
</script>

<style lang="less" scoped>
.shopping-joint {
	// 标题 start
	.title-wrap {
		display: flex;
		justify-content: space-between;
		padding: 16upx 33upx 30upx;
		.left-wrap {
			color: #333;
			> text {
				&:first-child {
					font-size: 32upx;
					font-weight: bold;
					margin-right: 22upx;
				}
				&:nth-child(2) {
					font-size: 26upx;
				}
			}
		}
		.right-wrap {
			display: flex;
			align-items: center;
			font-size: 26upx;
			color: #06B720;
			.arrow {
				position: relative;
				width: 14upx;
				height: 14upx;
				border-top: 1px solid #06B720;
				border-right: 1px solid #06B720;
				transform: rotate(45deg);
				margin-left: 6upx;
			}
		}
	}
	// 标题 end

	// 主体 start
	.group-list {
		background: #fff;
		padding: 0 30upx;
	}
}
</style>
