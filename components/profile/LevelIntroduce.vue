<template>
	<view class="level-introduce" v-if="Object.keys(userInfo).length > 0">
		<view class="title-wrap" @tap="handleTap">
			<view class="title">
				<image class="badge" src="https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/3/31/bbcf8323-3cff-409d-ae12-eda280a9ffa8.png"></image>
				<text>{{userInfo.userLevel | formatLevel}}</text>
			</view>
			<view class="arrow"></view>
		</view>
		<view class="list-wrap" v-show="userInfo.type === 0">
			<view class="item">
				<image class="start-icon" src="https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/3/31/61e16b24-e8a1-4cf8-b7eb-dd8bf8b27740.png"></image>
				<!-- 消费一单后可享受邀请好友升级奖励 -->
				<!-- 升级会员购物省赚提高50% -->
				新人消费后邀请好友购物，升级会员获得级别价差现金奖励。
			</view>
			
			<view class="item">
				<image class="start-icon" src="https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/3/31/61e16b24-e8a1-4cf8-b7eb-dd8bf8b27740.png"></image>
				<!-- 购物最高可降80元 -->
				<!-- 金牌会员优先发货 0元试用  退换包运费特权 -->
				会员级别越高，奖励越多；邀请越多，奖励越多，越消费越赚钱。
			</view>
			
			<view class="item">
				<image class="start-icon" src="https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/3/31/61e16b24-e8a1-4cf8-b7eb-dd8bf8b27740.png"></image>
				拼团超多划算，拼中省钱，不中赚钱，让你省够赚够。
			</view>
			<!-- <view class="item">
				<image class="start-icon" src="https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/3/31/61e16b24-e8a1-4cf8-b7eb-dd8bf8b27740.png"></image>
				金牌会员可获0元试用福利，退换包运费特权待遇
			</view> -->
		</view>
	</view>
</template>

<script>
	import { formatLevel } from '../../pages/profile/profile.js'
	export default {
		props: {
			userInfo: {
				type : Object,
				default() {
					return {}
				}
			}
		},
		filters: {
			formatLevel
		},
		methods: {
			// 跳转到 会员说明页面
			handleTap() {
				console.log('点击了')
				uni.navigateTo({
					url: '../../pages/memberShip/memberShip?userInfo=' + encodeURIComponent(JSON.stringify(this.userInfo))
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.level-introduce {
		width: 100%;
		background-color: #FEFEFE;
		border-radius: 16upx;
		.title-wrap {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 72upx;
			background-color: #37332C;
			color: #fff;
			padding: 0 32upx 0 26upx;
			border-top-left-radius: 16upx;
			border-top-right-radius: 16upx;
			.title {
				display: flex;
				align-items: center;
				.badge {
					width: 40upx;
					height: 40upx;
					margin-right: 11upx;
				}
			}
			
			.arrow {
				position: relative;
				z-index: 2;
				width: 16upx;
				height: 16upx;
				border-top: 1px solid #fff;
				border-right: 1px solid #fff;
				transform: rotate(45deg);
			}
		}
		
		.list-wrap {
			padding: 48upx 10rpx 39upx 26upx;
			font-size: 26upx;
			color: #1D1C1C;
			.item {
				display: flex;
				align-items: center;
				&:first-child {
					margin-bottom: 30upx;
				}
				&:nth-child(2) {
					margin-bottom: 30upx;
				}
				// &:nth-child(3) {
				// 	margin-bottom: 40upx;
				// }
				.start-icon {
					width: 36upx;
					height: 34upx;
					margin-right: 29upx;
				}
			}
		}
	}
</style>
