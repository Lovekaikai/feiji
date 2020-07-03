<template>
	<view class="guess-like">
		<view class="title">
			猜你喜欢  Like
		</view>
		<goods-list :goods="guessLikseList"></goods-list>
	</view>
</template>

<script>
import GoodsList from './goods/GoodsList.vue'
export default {
	props: {
		guessLikseList: {
			type: Array,
			default() {
				return []
			}
		}
	},
	components: {
		GoodsList
	}
}
</script>

<style lang="less" scoped>
.guess-like {
	margin-top: 72upx;
	.title {
		font-size: 32upx;
		color: #333;
		padding: 0 0 26upx 32upx;
		font-weight: bold;
	}
}
</style>
