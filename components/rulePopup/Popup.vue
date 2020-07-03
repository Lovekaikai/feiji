<template>
	<view class="popup-wrap" v-if="isPopup" @touchmove.stop.prevent="moveHandle">
		<!-- 遮罩层 -->
		<view class="mask" v-if="mask" @touchmove.stop.prevent="moveHandle"></view>
		<!-- 这层是绝对定位 -->
		<view class="popup">
			<!-- 这层是相对定位 -->
			<view class="content">
				<view class="header-wrap" v-if="title !== null">
					{{title}}
				</view>
				<slot name="body"></slot>
				<view class="clear-warp">
					<icon type="clear" size="24" color="#fff" @tap="$emit('close')"/>
					<view class="line"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		mask: {
			type: Boolean,
			default: true
		},
		title: {
			type: String,
			default: null
		},
		isPopup: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		moveHandle() {
			return false
		}
	}
}
</script>

<style lang="less" scoped>
.popup-wrap {
	.mask {
		position: fixed;
		z-index: 8;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0,0,0,.45);
	}
	.popup {
		position: fixed;
		z-index: 10;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		// width: 686upx;
		// min-height: 493upx;
		// max-height: 685upx;
		background-color: #fff;
		border-radius: 10upx;
		box-sizing: border-box;
		padding: 20upx 10upx;
		.content {
			position: relative;
			width: 100%;
			height: 100%;
		}
		.header-wrap {
			font-size: 30upx;
			color: #06B720;
			font-weight: bold;
			padding-bottom: 28upx;
			border-bottom: 1px solid #F2F2F2;
			letter-spacing: 1px;
		}
		.clear-warp {
			position: absolute;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			top: -90upx;
			right: -30upx;
			.line {
				width: 1px;
				height: 28upx;
				background: #fff;
			}
		}
	}
}
</style>
