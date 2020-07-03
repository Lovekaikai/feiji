<template>
	<view class="update-way">
		<view class="title">如何升级</view>
		
		<view class="content">
			<view class="item" v-for="(item,index) in updateList" :key="index">
				<view class="left">
					<view class="circle"></view>
					<text>{{item}}</text>
				</view>
				
				<navigator url="../../pages/buypackage/buypackage" class="update-btn" v-if="type === 1">立即升级</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			userInfo: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		data() {
			return {
				memberUpdate : [
					"推荐一位新人购买即可成为铜牌会员",
					"推荐两位新人购买即可成为银牌会员",
					"推荐三位新人购买即可成为金牌会员",
					"由代理商客户邀请则可升级为代理商级别"
				],
				agentUpdate : ["一次性购买指定套餐即可升级等级"]
			}
		},
		computed: {
			updateList() {
				const { type } = this.userInfo
				if(type === 0) {
					// 则是会员
					return this.memberUpdate
				}else if(type === 1) {
					// 则是代理商
					return this.agentUpdate
				}
			},
			type() {
				return this.userInfo.type
			}
		}
	}
</script>

<style lang="less" scoped>
	.update-way {
		margin-top: 65upx;
		.title {
			font-size: 30upx;
			font-weight: bold;
			text-align: center;
			margin-bottom: 40upx;
		}
		
		.content{
			padding:0 32upx;
			.item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 38upx;
				&:last-child {
					margin-bottom: 0;
				}
				.left {
					display: flex;
					align-items: center;
					.circle {
						width: 16upx;
						height: 16upx;
						border-radius: 50%;
						background-color: #D0BB8B;
						margin-right: 22upx;
					}
					>text {
						color: #807C7C;
					}
				}
				
				.update-btn {
					width: 172upx;
					height: 60upx;
					line-height: 60upx;
					border-radius: 30upx;
					background: #D0BB8B;
					color: #fff;
					font-size: 26upx;
					text-align: center;
				}
			}
		}
	}
</style>
