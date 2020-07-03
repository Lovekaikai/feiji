<template>
	<view class="joint-list" ref="list" :style="{'opacity':msgOpacity}">
		<view class="joint-item" ref="item">
			<image class="avatar" :src="msgObj.avatar"></image>
			<view class="desc"><text class="name">{{msgObj.nickName}}</text>{{msgObj.msgType}}</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		// 信息对象
		msgObj: {
			type: Object,
			default() {
				return {}
			}
		},  
		msgOpacity: {
			type: Number,
			default: 0
		}
	}
}
</script>

<style lang="less" scoped>
.joint-list {
	transition: opacity 1s;
	.joint-item {
		display: flex;
		background-color: rgba(0, 0, 0, 0.7);
		align-items: center;
		height: 60upx;
		padding: 0 20upx 0 10upx;
		border-radius: 30upx;
		margin-bottom: 10upx;
		.avatar {
			width: 48upx;
			height: 48upx;
			border-radius: 50%;
			margin-right: 8upx;
		}
		.desc {
			font-size: 26upx;
			color: #fff;
			.name {
				margin-right: 10upx;
			}
		}
	}
}
.active {
	display: block;
	transition: all 2s;
}
</style>
