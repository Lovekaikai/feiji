<template>
	<view class="menu-nav">
		<!-- 导航 -->
		<scroll-view scroll-x="true" class="navbar-wrap" :style="{height: isHeight }">
			<view class="nav-item" v-for="(item, index) in classifyTitle" :key="index">
				<view class="nav-content">
					<view class="nav-info" @tap="handleNav(index)" :class="{navActive: index === currentIndex}">
						<image :src="imgArr[index]" mode="widthFix"></image>
						<view class="title">{{ item.name }}</view>
						<view class="desc">{{item.description}}</view>
						<!-- <view class="desc">今日折扣</view> -->
					</view>
					<view class="line"></view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 主体 -->
		<view v-if="list.length > 0" class="goodsList-wrap">
			<goods-list :goods="list"></goods-list>
			<view class="noMore" v-if="list.length > 4">
				<div class="line"></div>
				<div class="desc">没有更多数据了</div>
				<div class="line"></div>
			</view>
		</view>
		
		<view class="empty" v-show="classifyEmpty">暂无相关数据</view>	
	</view>
</template>

<script>
import GoodsList from './goods/GoodsList.vue'
export default {
	data(){
		return {
			imgArr:[
				'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/7/3/11b075fc-745d-42a0-ba46-f71eca598acd.png',
				'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/7/3/c333853f-7426-4e72-8458-2071bc1562e1.png',
				'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/7/3/f93ce1de-6cbd-4c76-86e7-502583f9fb4e.png',
				'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/7/3/20a71b40-6819-42fe-8097-18bf2568a4af.png',
				'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/7/3/419cf3c8-2ae3-4c9f-b751-9ade5b70972c.png',
				'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/7/3/f83acbbb-1825-4b86-9765-9d0973e81c78.png',
				'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/7/3/9bf21b62-85db-4116-ae9a-b4f64eb275f2.png',
				'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/7/3/41196948-696d-4c9a-bfa3-b22bdd5f5221.png'
			]
		}
	},
	props: {
		// 分类标题
		classifyTitle: {
			type: Array,
			default() {
				return []
				
			}
		},
		
		// 分类商品列表
		list: {
			type: Array,
			default() {
				return []
			}
		},
		
		// 标题当前索引
		currentIndex: {
			type: Number,
			default: 0
		},
		
		// 控制是否为空
		classifyEmpty: {
			type: Boolean,
			default: false
		}
	},
	components: {
		GoodsList
	},
	computed: {
		isHeight() {
			let result = this.classifyTitle.some(v => v.description.length > 0)
			return result ? uni.upx2px(100) + 'px' : uni.upx2px(160) + 'px'
		}
	},
	
	methods: {
		// 点击切换菜单
		handleNav(index) {
			this.$emit('change',index)
		}
	}
};
</script>

<style lang="less" scoped>
.menu-nav {
	margin-top: 20upx;
	background-color: #fff;
	min-height: 500upx;
	.navbar-wrap {
		white-space: nowrap;
		background-color: #f2f2f2;
		height: 60upx;
		.nav-item {
			display: inline-block;
			// display: flex;
			text-align: center;
			.nav-content {
				display: flex;
				align-items: center;
				.nav-info {	
					padding: 0 20upx;
					.title {
						font-size: 26upx;
						color: #1F1F1F;
						margin-bottom: 6upx;
						font-weight: bold;
					}
					image{
						height: 96upx;
						width: 86upx;
					}
					.desc {
						padding: 2upx 12upx;
						font-size: 22upx;
						color: #7F7F7F;
					}
				}
				.navActive {
					.title {
						color: #06B720;
					}
					.desc {
						background: #06B720;
						color: #fff;
						border-radius: 18upx;
					}
				}
			}
			
			&:not(:last-child) {
				.line {
					width: 2upx;
					height: 32upx;
					background-color: #B1B1B1;
				}
			}
			
		}
	}
	.goodsList-wrap {
		background-color: #fff;
		min-height: 400upx;
		.noMore {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 160upx 0 20upx 0;
			.line {
				width: 180upx;
				height: 1px;
				background-color: #eee;
			}
			.desc {
				font-size: 24upx;
				color: #ccc;
				padding: 0 20upx;
			}
			
		}
	}
	.empty {
		color: #999;
		text-align: center;
		font-size: 26rpx;
		width: 100%;
		padding: 100rpx 0;
	}
}
</style>
