<template>
	<button type="primary" class="join-btn" :style="{height:btnHeight,lineHeight: btnHeight,borderRadius:btnRadius,fontSize:btnFontSize,paddingLeft:btnPadding,paddingRight:btnPadding}">{{ desc }}</button>
</template>

<script>
export default {
	props: {
		// 按钮描述
		desc: {
			type: String,
			default: '立即参团'
		},
		// 按钮高度
		height: {
			type: Number,
			default: 50
		},
		// 字体大小
		size: {
			type: Number,
			default: 24
		},
		// 改变btn的左右padding
		btnStyle: {
			type: Number,
			default: 22
		}
	},
	computed: {
		btnHeight() {
			return uni.upx2px(this.height) + 'px'
		},
		btnRadius() {
			return uni.upx2px(this.height/2) + 'px'
		},
		btnFontSize() {
			return uni.upx2px(this.size) + 'px'
		},
		btnPadding() {
			return uni.upx2px(this.btnStyle) + 'px'
		}
	}
};
</script>

<style lang="less" scoped>
.join-btn {
	// padding: 0 25upx;  // padding 是动态的
	// height: 52upx;  // 高度是动态的
	background-color: #06B720;
	color: #fff;
	// font-size: 24upx;  // 字体是动态的
	// line-height: 52upx; // 行高是动态的 = 高度
	// border-radius: 26upx;  // 圆角是动态的 = 高度 / 2
	margin: 0;
	letter-spacing: 1px;
}
</style>
