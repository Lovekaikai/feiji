<template>
	<view class="my-integral" v-if="Object.keys(integralData).length > 0">
		<navigator class="title-wrap" url="../../pages/pionts/pionts">
			<view class="title">
				<text class="desc">我的积分</text>
				<text style="font-size: 20rpx;color: #808080;margin-left: 10rpx;">(100积分=1元)</text>
			</view>
			<!-- <view class="">
				100积分=1元
			</view> -->
			<!-- <text style="font-size: 20rpx;color: #808080;"></text> -->
			<view class="arrow"></view>
		</navigator>
		
		<view class="integral-wrap">
			<view class="total-wrap">
				<view class="desc">当前积分</view>
				<!-- <view class="integral">{{integralData.integral}}</view> -->
				<countup :num="integralData.integral || '0'" color="#06B720" :width='30' :height='46' :fontSize='46'></countup>
			</view>
			<view class="integral-info">
				<view class="available info-item">
					<view class="desc">当前可提现积分</view>
					<view class="integral">{{integralData.usableIntegral}}</view>
				</view>
				<view class="freeze info-item">
					<view class="desc">冻结积分</view>
					<view class="integral">{{integralData.freezeIntegral}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			integralData : {
				type : Object,
				default() {
					return {}
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.my-integral {
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
				.desc {
					font-size: 28upx;
					// font-weight: bold;
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
		
		.integral-wrap {
			text-align: center;
			.total-wrap {
				padding: 36upx 0 27upx 0;
				.desc {
					font-size: 22upx;
					color: #91B3E7;
					margin-bottom: 14upx;
				}
				.integral {
					color: #06B720;
					font-size: 44upx;
					font-weight: bold;
				}
			}
			
			.integral-info {
				display: flex;
				.desc {
					color: #808080;
					font-size: 22upx;
					margin-bottom: 10upx;
				}
				.info-item {
					flex: 1;
					padding: 25upx 0 36upx 0;
					font-size: 36upx;
				}
				.available {					
					border-right: 1px solid #F7F7F7;
					.integral {
						color: #5BDB7F;
						font-weight: bold;
					}
				}
				.freeze {
					.integral {
						color: #DB5B5B;	
						font-weight: bold;			
					}
				}
			}
		}
	}
</style>
