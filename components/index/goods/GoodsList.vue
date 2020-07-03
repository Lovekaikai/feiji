<template>
	<view class="goods-list clearfix">
		<goods-list-item class="item" v-for="(item,index) in goods" :key="index" :product="item"></goods-list-item>
	</view>
</template>

<script>
import GoodsListItem from './GoodsListItem.vue'
export default {
	props: {
		goods: {
			type: Array,
			default() {
				return []
			}
		}
	},
	components: {
		GoodsListItem
	}
};
</script>

<style lang="less" scoped>
.goods-list {
	display: flex;
	flex-wrap: wrap;
	// column-count: 2;
	// column-gap: 20upx;
	background-color: #fff;
	padding: 20upx 20upx 0;
	.item {
		// display: flex;
		// width: 47%;
		&:nth-child(odd) {
			margin-right: auto;
		}
	}
}	
.clearfix:before,
.clearfix:after {
	display: table;
	content: "";    /*不用有内容也可以*/
}

.clearfix:after {
	clear: both;
}

</style>
