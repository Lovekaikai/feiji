<template>
	<view class="joint-item">
		<view class="content">
			<view class="image-wrap">
				<image class="good-image" :src="item.cover" @load="imageLoad" lazy-load mode="aspectFill"></image>
				<view class="loadig-wrap" v-if="isLoading">
					<image src="https://s1.ax1x.com/2018/12/06/F1mHTs.gif" class="loading"></image>
				</view>
			</view>
			<view class="item-right">
				<!-- 商品名 -->
				<view class="good-name"  style="font-weight: 600;">{{ item.title }}</view>
				<!-- 拼团进度条 -->
				<view class="sold">
					<slot>
						<progress-bar :sold="item.maxProgress"></progress-bar>
					</slot>
					<text class="sold-num">{{ item.groupCount }}人成团</text>
				</view>
				<!-- 折扣提醒 -->
				<view class="discount-wrap">
					<view class="discount" v-for="(item,index) in item.tag" :key="index">{{item}}</view>
				</view>
				<!-- 价钱 模块 -->
				<view class="price-wrap">
					<view class="price" >
						<view class="new-price"  style="font-weight: 600;">
							￥
							<text>{{ item.grouponPrice | keepTowPoint}}</text>
						</view>
						<text class="old-price">￥{{ item.initPrice | keepTowPoint}}</text>
					</view>
					<my-button @tap.native.stop="buttonClick(item)"></my-button>
				</view>
			</view>
		</view>
		<!-- 下划线 -->
		<view class="line" v-if="!hideLine"></view>
	</view>
</template>

<script>
import ProgressBar from '@/components/progress-bar/ProgressBar.vue'
import MyButton from '@/components/my-button/MyButton.vue'
import { toFiexedTwo } from '@/common/minxins/mixins.js'
import throttle from '@/common/throttle.js';
export default {
	props: {
		item: {
			type: Object,
			default() {
				return {};
			}
		},
		hideLine: {
			type: Boolean,
			default: true
		}
	},
	components: {
		ProgressBar,
		MyButton
	},
	data() {
		return {
			isLoading: true  // 控制是否显示loading
		}
	},
		
	mixins: [toFiexedTwo],
	computed:  {
		itemCover() {
			if(this.item.cover === "封面" || !this.item.cover) {
				return "https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/15/aff1856e-27c6-4a25-8591-6ee448b9cc8d.jpg"
			}
		}
	},
	methods: {
		// 监听图片加载事件
		imageLoad() {
			this.isLoading = false
		},
		buttonClick: throttle.throttleFunc(function(item) {
			this.$common.navigateTo('../groupGoodsDetails/groupGoodsDetails?spuId=' + item.spuId);
		},500)
 	}
};
</script>

<style lang="less" scoped>
.joint-item {
	// 对于动态生成的dom nth无效
	// &:not(:last-child) {
	// 	border-bottom: 1px solid #f2f2f2;
	// }
	.content {
		display: flex;
		padding: 22upx 0;
		.image-wrap {
			position: relative;
		}
		.good-image {
			width: 240upx;
			height: 240upx;
		}
		.loadig-wrap {
			position: absolute;
			top: 0;
			left: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 240upx;
			height: 240upx;
		}
		.loading {
			width: 80upx;
			height: 80upx;
		}
		.item-right {
			flex: 1;
			flex-wrap: wrap;
			padding-left: 20upx;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			.good-name {
				font-size: 26upx;
				color: #000;
				overflow: hidden;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
			.sold {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 24upx 0;
				.sold-num {
					font-size: 24upx;
					color: #06B720;
				}
			}
			.discount-wrap {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				.discount {
					background-color: #a4c4f5;
					font-size: 20upx;
					color: #fff;
					text-align: center;
					border-radius: 20upx;
					padding: 6upx 18upx;
					letter-spacing: 1px;
					margin: 0 10upx 10upx 0;
				}
			}
			.price-wrap {
				display: flex;
				justify-content: space-between;
				margin-top: 20upx;
				.price {
					display: flex;
					align-items: center;
					font-size: 24upx;
					.new-price {
						color: #06B720;
						font-size: 36upx;
						margin-right: 12upx;
						> text {
							font-size: 34upx;
						}
					}
					.old-price {
						color: #808080;
						text-decoration: line-through;
					}
				}
			}
		}
	}
	.line {
		height: 1px;
		background: #f2f2f2;
		width: 100%;
	}
}
</style>
