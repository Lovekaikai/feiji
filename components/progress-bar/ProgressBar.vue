<template>
	<view class="progress-bar" :style="{'width':progressWidth}">
		<view class="per" :style="{ width: progress }" :class="{active: isActive}"></view>
		<text class="per-desc">{{ progress }}</text>
	</view>
</template>

<script>
export default {
	props: {
		// 进度条的百分比
		sold: {
			type: Number,
			default: 0
		},
		
		// 进度条的宽度
		width: {
			type: [String,Number],
			default: 268
		}
	},

	computed: {
		// 进度条的宽度
		progressWidth() {
			if(this.width === '100%') {
				return this.width
			}else {
				return uni.upx2px(this.width) + 'px'
			}		
		},
		// 进度值
		progress() {
			//取值范围0-100
			if(this.sold >= 0 && this.sold <= 100 ){
         return this.sold + '%' 
			}else{
				return 0 + '%' 
			}
			
		},
		
		isActive() {
			return this.sold <= 6 ? true : false
		}
	}
}
</script>

<style lang="less" scoped>
.progress-bar {
	position: relative;
	// width: 269upx;  // 进度条的宽度需要动态生成
	height: 24upx;
	background-color: #a4c4f5;
	border-radius: 12upx;
	.per {
		position: absolute;
		left: 0;
		// width: 50%;  width需要动态生成
		height: 24upx;
		background-color: #06B720;
		border-radius: 12upx;
	}
	.active {
		top: 50%;
		left: 1upx;
		transform: translateY(-50%);
		height: 15upx;
	}
	.per-desc {
		position: absolute;
		color: #fff;
		font-size: 20upx;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
}
</style>
