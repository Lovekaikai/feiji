<template>
	<view class="service-bar">
		<view class="bar-item" v-for="(item,index) in serviceList" :key="index">
			<image :src="item.icon"></image>
			<text>{{item.desc}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				serviceList: [
					{
						icon: "https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/6/e5d70236-fd38-45d0-a4f6-932d9efb72d8.png",
						desc: "源头好货"
					},
					{
						icon: "https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/6/509847b0-acef-4755-8d1c-6d95e3fcad54.png",
						desc: "会员特权"
					},
					{
						icon: "https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/6/8104a1a1-6cc6-4628-a5aa-7b5664147bc3.png",
						desc: "正品保障"
					}
				]
			}
		}
	}
</script>

<style lang="less" scoped>
.service-bar {
	display: flex;
	justify-content: space-around;
	padding: 30upx 0;
	.bar-item {
		display: flex;
		align-items: center;
		font-size: 26upx;
		color: #06B720;
		font-weight: bold;
		>image {
			width: 36upx;
			height: 36upx;
			margin-right: 15upx;
		}
	}
}
</style>
