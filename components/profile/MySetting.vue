<template>
	<view class="my-setting">
		<navigator class="set-item" url="../../pages/collageOrderList/collageOrderList">
			<view class="left">
				<image class="icon" src="https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/14/a6b91edd-17e3-4e71-83fa-7287c24f8dd8.png"></image>
				<text class="desc">我的拼团</text>
			</view>
			<view class="right arrow"></view>
		</navigator>
		<navigator class="set-item" url="../../pages/perinfor/perinfor">
			<view class="left">
				<image class="icon" src="https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/3/31/0903c8fb-ef21-4b50-80b7-bd4fdabb87c4.png"></image>
				<text class="desc">个人信息</text>
			</view>
			<view class="right arrow"></view>
		</navigator>
<!-- 		<navigator class="set-item" @click="Jump">
			<view class="left">
				<view class="icon iconfont icon-gouwuche1" style="font-size: 36rpx;"></view>
				<text>购物车</text>
			</view>
			<view class="right arrow"></view>
		</navigator> -->
		<navigator class="set-item" url="../../pages/addressManage/addressManage">
			<view class="left">
				<image class="icon" src="https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/3/31/5e426644-3c93-4959-abb7-6ea6933449cf.png"></image>
				<text class="desc">收货地址</text>
			</view>
			<view class="right arrow"></view>
		</navigator>
		
		<navigator class="set-item" url="../../pages/friendsList/friendsList">
			<view class="left">
				<image class="icon" src="https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/20/a4a58c99-20ea-4c33-83a4-78dfcd654ace.png"></image>
				<text class="desc">邀请的好友</text>
			</view>
			<view class="right arrow"></view>
		</navigator>

		<view class="set-item" v-if="inviteCode.show"  @tap="getPoster">
			<view class="left">
				<image class="icon" src="https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/3/31/1278e308-f3e1-4341-acf8-00a42152beb5.png"></image>
				<text class="desc">代理商邀请码</text>
			</view>
			<view class="right">{{inviteCode.code}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			inviteCode : {
				type : Object,
				default() {
					return {}
				}
			}
		},
		methods:{
			Jump(){
				uni.switchTab({
					url:'../../pages/shoppingCart/shoppingCart'
				})
			},
			// 点击邀请码
			getPoster() {
				this.$emit("getPoster")
			}
		}
	}
</script>

<style lang="less" scoped>
	.my-setting {
		background-color: #FEFEFE;
		border-radius: 16upx;
		.set-item {
			display: flex;
			justify-content: space-between;
			padding: 22upx 32upx;
			border-bottom: 1px solid #F7F7F7;
			&:last-child {
				border-bottom: none;
			}
			.left {
				display: flex;
				align-items: center;
				.icon {
					width: 36upx;
					height: 36upx;
					margin-right: 18upx;
				}
				.desc {
					font-size: 28upx;
					font-weight: bold;
				}
			}
			.arrow {
				position: relative;
				width: 16upx;
				height: 16upx;
				border-top: 1px solid #808080;
				border-right: 1px solid #808080;
				transform: rotate(45deg);
			}
		}
	}
</style>
