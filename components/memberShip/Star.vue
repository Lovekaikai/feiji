<template>
	<view class="star">
		<view v-for="(item,index) in startList" :class="item" :key="index" class="start-item"></view>
	</view>
</template>

<script>
const LENGTH = 3; // 长度3
const CLS_ON = 'on'; // 整星
const CLS_OFF = 'off'; // 白星
export default {
	props: {
		score: {
			type: Number
		}
	},
	computed: {
		startList() {
			let result = []
			for(let i = 0; i < this.score; i++) {
				result.push(CLS_ON)
			}
			
			while(result.length < LENGTH) {
				result.push(CLS_OFF)
			}
			
			// console.log(result)
			return result
		}
	}
};
</script>

<style lang="less" scoped>
	.star {
		display: flex;
		.start-item {
			background: no-repeat;
			width: 21upx;
			height: 21upx;
			background-size: 21upx;
			&:nth-child(2) { 
				margin: 0 12upx;
			}
		}
		.on {
			width: 21upx;
			height: 21upx;
			background: url("https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/4/1/1fcc518d-74fe-45c7-a363-d32b980564f5.png");
			background-size: 21upx;
		}
		.off {
			width: 21upx;
			height: 21upx;
			background: url("https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/4/1/a7154ac0-b436-4e3f-b9ac-98163fe8f6cf.png");
			background-size: 21upx;
		}
	}
</style>
