<template>
	<view class="my-balance" v-if="Object.keys(balanceData).length > 0">
		<navigator url="../../pages/balance/balance" class="title-wrap">
			<view  class="title">我的余额</view>
			<view class="arrow"></view>
		</navigator>
		
		<view class="balance-wrap">
			<view class="total-wrap">
				<view class="desc">当前余额</view>
				<!-- <view class="balance">￥<text>{{balanceData.balance}}</text></view> -->
				<view class="balance current-total-wrap">
				<view class="symbol">￥</view>
				<countup :num="balanceData.balance || '0'" color="#4A90E2" :width='30' :height='46' :fontSize='46'></countup>
				</view>
			</view>
			<view class="balance-info">
				<view class="available info-item">
					<view class="desc">当前可用余额</view>
					<view class="balance">￥<text>{{balanceData.usableBalance}}</text></view>
				</view>
				<view class="freeze info-item">
					<view class="desc">冻结余额</view>
					<view class="balance">￥<text>{{balanceData.freezeBalance}}</text></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			balanceData : {
				type : Object,
				default() {
					return {}
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.my-balance {
		background-color: #FEFEFE;
		margin: 20upx 0;
		border-radius: 16upx;
		.title-wrap {
			display: flex;
			justify-content: space-between;
			padding: 26upx 32upx;
			border-bottom: 1px solid #F7F7F7;		
			.title {
				font-weight: bold;
				font-size: 28upx;
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
		
		.balance-wrap {
			text-align: center;
			.total-wrap {
				padding: 36upx 0 27upx 0;
				.current-total-wrap {
					display: flex;
					justify-content: center;
					align-items: baseline;
					.symbol {
						position: relative;
						top: -5upx;
					}
				}
				.desc {
					font-size: 22upx;
					color: #91B3E7;
					margin-bottom: 14upx;
				}
				.balance {
					color: #4A90E2;
					>text {
						font-size: 44upx;
						font-weight: bold;
					}
				}
			}
			
			.balance-info {
				display: flex;
				.desc {
					color: #808080;
					font-size: 22upx;
					margin-bottom: 10upx;
				}
				.info-item {
					flex: 1;
					padding: 25upx 0 36upx 0;
					text {
						font-size: 36upx;
						font-weight: bold;
					}
				}
				.available {					
					border-right: 1px solid #F7F7F7;
					.balance {
						color: #5BDB7F;
					}
				}
				.freeze {
					.balance {
						color: #DB5B5B;				
					}
				}
			}
		}
	}
</style>
