<template>
	<view class="goods-list-item" @tap="itemClick">
		<view class="image-wrap">
			<view  class="loadig-wrap" v-if="isLoading">
				<image src="https://s1.ax1x.com/2018/12/06/F1mHTs.gif" class="loading"></image>
			</view>
			<image :src="product.image || defaultImage" class="good-image" @load="imageLoad"></image>		
		</view>
		<view class="good-info">
			<view class="good-name">{{product.spuName}}</view>
			<view class="good-price">￥{{product.initPirce || product.initPrice}}</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		product: {
			type: Object,
			default() {
				return {}
			}
		}
	},
	data() {
		return {
			isLoading: true
		}
	},
	computed: {
		defaultImage() {
			return "https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/15/aff1856e-27c6-4a25-8591-6ee448b9cc8d.jpg"	
		}
		
	},
	methods: {
		itemClick() {
			this.$common.navigateTo('../product/product?spu=' + this.product.spuId);
		},
		// 监听图片的加载事件
		imageLoad() {
			this.isLoading = false
		}
	}
}
</script>

<style lang="less" scoped>
.goods-list-item {
	display: flex;
	// flex-direction: column;
	background: #fff;
	margin-bottom: 30upx;
	.image-wrap {
		position: relative;
	}
	.good-image {
		width: 327upx;
		height: 327upx;
	}
	.loadig-wrap {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 327upx;
		.loading {
			width: 80upx;
			height: 80upx;
		}
	}
	.good-info {
		padding: 15upx 15upx 25upx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.good-name {
			font-size: 26upx;
			color: #000;
			margin-bottom: 20upx;
			overflow: hidden;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			// height: 34upx;
		}
		.good-price {
			font-size: 28upx;
			color: #FF731D;
			font-weight: bold;
		}
	}
}
</style>
