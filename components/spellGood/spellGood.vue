<template>
	<view class="spellgood">
		<view class="spellgood-list">
			<view class="spellgood-item" v-for="(sgItem, sgIdx) in speGoodList" :key='sgIdx' @tap="hotGoGroupGoodsDetails(sgItem.spuId)">
				<view class="good-image">
					<image :src="sgItem.cover" mode="aspectFill"></image>
				</view>
				
				<view class="good-con">
					<view class="good-name">{{sgItem.title}}</view>
					<view class="good-bottom">
						<view class="good-price">
							<text style="font-size: 20rpx;">￥</text>
							<text style="font-size: 28rpx;">{{sgItem.grouponPrice}}</text>
						</view>
						<my-button :desc='"去参团"' :height='38' :size='20'></my-button>
					</view>
				</view>
				
			</view>
		</view>
		
	</view>
</template>

<script>
	import myButton from '../my-button/MyButton.vue'
	export default {
		components: {
			myButton
		},
		props: {
			speGoodList: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			// 最热拼团好物里的商品
			hotGoGroupGoodsDetails(id) {
				uni.navigateTo({
					url: "../groupGoodsDetails/groupGoodsDetails?spuId=" + id
				})
			},
		}
	}
</script>

<style lang="less">
	.spellgood {
		border-top: 2rpx solid rgba(242, 242, 242, 1);
	}
	.spellgood-list {
		display: flex;
		flex-wrap: wrap;
		// justify-content: space-between;
		.spellgood-item {
			width: 208rpx;
			margin-top: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding: 0 16rpx;
			.good-image {
				width: 208rpx;
				height: 208rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.good-con {
				height: 120rpx;
				margin-top: 14rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
			}
			.good-name {
				color: rgba(51, 51, 51, 1);
				font-size: 26rpx;
				font-weight: 500;
				word-break: break-all;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
			.good-bottom {
				margin-top: 10rpx;
				display: flex;
				justify-content: space-between;
				.good-price {
					color: #06B720;
				}
			}
		}
	}
</style>
