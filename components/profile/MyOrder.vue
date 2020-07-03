<template>
	<view class="my-order">
		<navigator :url="'../../pages/MeOrder/MeOrder?navIndex=' + 0" class="title-wrap">
			<view class="title">我的订单</view>
			<view class="check-order">
				查看全部订单({{orderTotal}}) 
				<view class="arrow"></view>
			</view>
		</navigator>
		
		<view class="toolbar">
			<navigator :url="'../../pages/MeOrder/MeOrder?navIndex=' + (index+1)" class="tool-item" v-for="(item,index) in toolbarList" :key="index">
				<image class="icon" :src="item.icon"></image>
				<view  class="desc">{{item.desc}}</view>
			</navigator>
	<!-- 		<navigator :url="'../../pages/MeOrder/MeOrder?navIndex=' + 2" class="tool-item">
				<image class="icon" src="https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/3/31/b7c0d7e2-a158-45fa-b301-ea22de864d39.png"></image>
				<view class="desc">待收货</view>
			</navigator>
			<navigator :url="'../../pages/MeOrder/MeOrder?navIndex=' + 3" class="tool-item">
				<image class="icon" src="https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/3/31/ca2435e8-1710-4de5-830e-02a69fedc349.png"></image>
				<view class="desc">已完成</view>
			</navigator>
			<navigator :url="'../../pages/MeOrder/MeOrder?navIndex=' + 4" class="tool-item">
				<image class="icon" src="https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/3/31/7506ac40-bc3a-4bcd-881b-18e0859b11b1.png"></image>
				<view class="desc">已取消</view>
			</navigator>
			<navigator :url="'../../pages/MeOrder/MeOrder?navIndex=' + 4" class="tool-item">
				<image class="icon" src="https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/3/31/7506ac40-bc3a-4bcd-881b-18e0859b11b1.png"></image>
				<view class="desc">已取消</view>
			</navigator>
			<navigator :url="'../../pages/MeOrder/MeOrder?navIndex=' + 4" class="tool-item">
				<image class="icon" src="https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/3/31/7506ac40-bc3a-4bcd-881b-18e0859b11b1.png"></image>
				<view class="desc">已取消</view>
			</navigator>
			<navigator :url="'../../pages/MeOrder/MeOrder?navIndex=' + 4" class="tool-item">
				<image class="icon" src="https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/3/31/7506ac40-bc3a-4bcd-881b-18e0859b11b1.png"></image>
				<view class="desc">已取消</view>
			</navigator> -->
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			orderTotal : {
				type : Number,
				default : 0
			}
		},
		data() {
			return {
				toolbarList: [
					{
						icon: "https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/3/31/b636363d-e6f8-44f0-85c9-e989bea8a118.png",
						desc: "待付款"
					},
					{
						icon: "https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/16/de43be13-5b16-4113-880c-a081114853d3.png",
						desc: "待发货"
					},			
					{
						icon: "https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/3/31/b7c0d7e2-a158-45fa-b301-ea22de864d39.png",
						desc: "待收货"
					},
					{
						icon: "https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/16/50a74597-760b-4170-bd4f-d8b4205e1d71.png",
						desc: "退款中"
					},
					{
						icon: "https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/16/60021bc0-9d94-47ec-b5f3-7f489b3a0365.png",
						desc: "退款完成"
					},
					{
						icon: "https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/3/31/ca2435e8-1710-4de5-830e-02a69fedc349.png",
						desc: "已完成"
					},
					{
						icon: "https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/3/31/7506ac40-bc3a-4bcd-881b-18e0859b11b1.png",
						desc: "已取消"
					}	
				]
			}
		}
	}
</script>

<style lang="less" scoped>
	.my-order {
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
				font-size: 28rpx;
			}
			.check-order {
				display: flex;
				align-items: center;
				color: #808080;
				font-size: 22upx;
				.arrow {
					position: relative;
					width: 16upx;
					height: 16upx;
					border-top: 1px solid #808080;
					border-right: 1px solid #808080;
					transform: rotate(45deg);
					margin-left: 6upx;
				}
			}
		}
		.toolbar {
			display: flex;
			flex-wrap: wrap;
			// justify-content: space-around;
			padding: 15upx 0 25upx;
			.tool-item {
				text-align: center;
				width: 25%;
				padding: 15upx 0;
				.icon {
					width: 52upx;
					height: 52upx;
					margin-bottom: 14upx;
				}
				.desc {
					font-size: 22upx;
					color: #333333;
					font-weight: bold;
				}
				
			}
		}
	}
</style>
