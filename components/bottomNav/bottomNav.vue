<template>
	<view class="bottomNav">
		<view class="bottomNav-item" @click="goHome()">
			<image src="../../static/images/home.png" mode=""></image>
			<text>主页</text>
		</view>
		<view class="bottomNav-item" @click="goCat()">
			<image src="../../static/images/cart.png" mode=""></image>
			<text>购物车</text>
		</view>
		<view class="bottomNav-item" @click="goMy()">
			<image src="../../static/images/mine.png" mode=""></image>
			<text>我的</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			// go(){
			// 	console.log(1111)
			// },
			goHome(){
				uni.switchTab({
					url: '../../pages/index/index'
				})
			},
			goCat(){
				uni.switchTab({
					url: '../../pages/shoppingCart/shoppingCart'
				})
			},
			goMy(){
				uni.switchTab({
					url: '../../pages/profile/profile'
				})
			}
		}
	}
</script>

<style lang="less">
.bottomNav {
	position: fixed;
	bottom: 0;
	width: 100%;
	height: 150upx;
	display: flex;
	align-items: center;
	background-color: #FFFFFF;
	// padding: 20upx;
	.bottomNav-item {
		flex: 1;
		display: flex;
		font-size: 28upx;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #808080;
		image {
			width: 55upx;
			height: 55upx;
		}
	}
}
</style>
