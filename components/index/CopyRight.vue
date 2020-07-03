<template>
	<view class="copy-right">
		<view>中国追溯链.com 版权所有</view>
		<view>© 1998-2020 China Traceability Chain.com All rights reserved</view>
		<view>powered by Upmall v{{version}}</view>
	</view>
</template>

<script>
export default {
	props: {
		version: {
			type: String,
			default: ""
		}
	}
}
</script>

<style lang="less" scoped>
	.copy-right {
		font-size: 22upx;
		color: #999999;
		text-align: center;
		padding: 100upx 0 25upx 0;
		view {
			&:not(:last-child) {
				margin-bottom: 8upx;
			}		
		}
	}
</style>
