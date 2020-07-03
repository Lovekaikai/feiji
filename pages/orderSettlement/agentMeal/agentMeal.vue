<template>
	<view class="agentMeal">
		<uni-nav-bar :status-bar="true" background-color="#FFFFFF" color="#000000" left-icon="arrowleft" title="联系客服" :shadow="false" fixed="true" @click-left="back" />
		<!-- 这是套餐支付完成或的页面 -->
		<!-- <view class="mask"></view> -->
		<view class="agentMeal-img">
			<view class="topriband">
				<image src="https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/6/5/74b2f2db-69a8-4f82-bf35-a4ad9928990a.png" mode=""></image>
			</view>
			<view class="bottomriband">
				<image src="https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/6/5/94c5797b-f48d-4048-b9fa-27aeeeb64470.png" mode=""></image>
			</view>
			<image style="width: 644rpx;height: 763rpx;" src="../../../static/agentMeal.png" mode="widthFix"></image>
			<view class="agentMeal-title">联系客服可到代理商特享专区选购</view>
			<view class="agentMealbutton">
				<button class="online-contact-button" open-type="contact">点击联系客服</button>
			</view>
		</view>
	</view>
</template>

<script>
	import uniNavBar from '../../../components/uni-nav-bar/uni-nav-bar.vue';
	export default {
		components: {
			uniNavBar
		},
		data() {
			return {
				
			};
		},
		methods: {
			back() {
				uni.switchTab({
					url: '/pages/index/index'
				});
			}
		}
	}
</script>

<style lang="less">
	.agentMeal {
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		.agentMeal-img {
			z-index: 2;
			position: relative;
			.topriband {
				position: absolute;
				top: 0;
				right: 40rpx;
				width: 118rpx;
				height: 142rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.bottomriband {
				position: absolute;
				bottom: 30rpx;
				left: -44rpx;
				width: 158rpx;
				height: 100rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
			// image {
			// 	width: 644rpx;
			// }
			.agentMeal-title {
				width: 100%;
				position: absolute;
				bottom: 200rpx;
				text-align: center;
				color: rgba(255, 255, 255, 1);
				font-size: 26rpx;
				font-weight: 500;
			}
			.agentMealbutton {
				position: absolute;
				bottom: 100rpx;
				width: 100%;
				display: flex;
				justify-content: center;
				.online-contact-button {
					width: 380rpx;
					height: 72rpx;
					color: rgba(148,107,82);
					border-radius: 36rpx;
					font-size: 28rpx;
					background-color: rgba(245,219,191);
				}
			}
			
		}
		
		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}
	}
</style>
