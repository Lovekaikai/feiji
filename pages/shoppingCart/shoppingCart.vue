<template>
	<view class="shoppingCart">
		<yu-kefu position="3"></yu-kefu>
		<view class="shoppingCart-shop" v-if="cartList.length > 0">
			<view class="shoppingCart-shop-left">
				<view class="shop-img"><image src="../../static/images/shop_big.png" mode=""></image></view>
				<view class="shop-name">UP商城</view>
				<view class="shop-icon"><uni-icons type="arrowright" size="14" color="#BB9267"></uni-icons></view>
			</view>
			<view class="shoppingCart-shop-right" @tap="clickRight">{{ rText }}</view>
		</view>
		<view class="shoppingCart-product" v-if="cartList.length > 0">
			<view class="EditSelectAll" @tap="allSelect">
				<!-- <view class="checkbox-box"> -->
				<view class="checkbox"><view :class="isAllselected ? 'on' : ''"></view></view>
				<view class="text">全选</view>
				<!-- </view> -->
			</view>   
			<!-- 购物车里的商品 -->
			<view class="productList">
				<view class="productItem" v-for="(proItem, pIdx) in cartList" :key="pIdx">
					<template v-if="isShowPay">
						<view class="checkbox" @tap="selectProduct(pIdx)">
							<view :class="proItem.checked ? 'on' : ''"></view>
						</view>
					</template>
					
					<template v-else>
						<view class="checkbox" @tap="selectProduct(pIdx)">
							<view :class="proItem.checked ? 'on' : ''"></view>
						</view>
					</template> 
					
					
					<view class="proImg"><image :src="proItem.image"></image></view>
					<view class="productItem-right" @tap="goToProduct(proItem.spuId)">
						<view class="proName">{{ proItem.goodsName }}</view>
						<view class="proReceiver">{{proItem.specValue}}</view>
						<view class="productItem-right-right">
							<view class="price">
								<text style="font-size: 20rpx;">￥</text>
								<text style="font-size: 36rpx;">{{ proItem.price }}</text>
							</view>
							
							<view class="opsNum">
								<view class="ops subtract" @tap.stop="calcValue(-1, pIdx)">-</view>
								<view class="proNum">{{ proItem.count }}</view>
								<view class="ops plus" v-if="proItem.spuId === 270 || proItem.spuId === 292">+</view>
								<view class="ops plus" @tap.stop="calcValue(1, pIdx)" v-else>+</view>
							</view>
						</view>
					</view>
					
					<view class="cart-item-mask" v-if="isShowPay&&proItem.status === 0"></view>
					 <!-- @tap='goProduct(product.goodsSku.spuId, product.goodsSku.status,product)' -->
					<!-- 判断是否下架 -->
					<view class="cart-item-img_del" v-if="proItem.status === 0">
						<image src="../../static/down.png" mode=""></image>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部结算 -->
		<view class="shoppingCart-footer"  v-if="cartList.length > 0">
			<view class="shoppingCart-footer-left" @tap="allSelect">
				<view class="checkbox"><view :class="isAllselected ? 'on' : ''"></view></view>
				<view class="text">全选</view>
			</view>
			<view class="shoppingCart-footer-right" v-if="isShowPay">
				<view class="left">
					<view class="">
						<text style="color: rgba(21, 21, 21, 1);font-size: 24rpx;">合计：</text>
						<text style="color: #06B720;font-size: 20rpx;font-weight: bold;">￥</text>
						<text style="color: #06B720;font-size: 36rpx;font-weight: bold;">{{ totalPrice }}</text>
					</view>
					<view class="" style="color: rgba(128, 128, 128, 1); font-size: 20rpx;text-align: right;">不含运费</view>
				</view>
				<view class="right" @tap="handlePay">去结算</view>
			</view>
			<view class="shoppingCart-footer-right" v-else><view class="delete" @tap="delectProduct">删除</view></view>
		</view>
		
		<!-- 购物车空的页面 -->
		<view class="shoppingCart-empty" v-if="isShowEmpty">
			<view class="content">
				<image src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1587384576224&di=de66d809eb08296fa53e03049da48f01&imgtype=0&src=http%3A%2F%2Fku.90sjimg.com%2Felement_origin_min_pic%2F01%2F39%2F08%2F88573ca8ba0c141.jpg" mode="widthFix"></image>
				<view class="tips">购物车还是空空的喔</view>
				<div class="goBtn" @click="Jump">去逛逛</div>
			</view>
		</view>
	</view>
</template>

<script>
import uniIcons from '../../components/uni-icons/uni-icons.vue'

// 客服组件
import yuKefu from '@/components/yu-kefu/yu-kefu.vue'
export default {
	components: {
		uniIcons,
		yuKefu
	},
	data() {
		return {
			rText: '编辑',
			isShowPay: true,
			isAllselected: false, // 是否为全选
			cartList: [] ,// 购物车商品列表 (全部的)
			totalPrice: 0  ,//总价格
			isShowEmpty: false,
			share: ""  // 分享码
		};
	},
	onLoad(option) {
		console.log(option)
		if(option) {
			this.share = option.share
		}
	},
	onShow() {
		// 初始化
		this.rText = '编辑'
		this.isShowPay = true
		this.isAllselected = false
		this.getCarList();
		this.totalPrice = 0
	},
	watch: {
		isShowPay() {
			this.cartList.forEach(item => {
				if (item.checked) {
					item.checked = false
				}
					
				
			})
			this.isAllselected = false
			this.totalPrice = 0
		},
		// cartList: {
		// 	handler(newV, oldV) {
		// 		let _prices = 0
		// 		this.cartList.forEach((item, idx) => {
		// 			if (item.cheched) {
		// 				_prices = (prices * 10000000 + item.num * (item.price * 10000000)) / 10000000;
		// 			}
		// 		})
		// 		this.countprice = _prices
		// 	},
		// 	immediate: true
		// }
	},
	computed: {
		// 计算价格
		countprice: {
			get: function() {
				let prices = 0;
				if (this.isShowPay) {
					this.cartList.forEach((item, idx) => {
						if (item.cheched) {
							prices = (prices * 10000000 + item.num * (item.price * 10000000)) / 10000000;
						}
					});
				} else {
					prices = 0
				}
				
				return prices.toFixed(2);
			}
		}
	},
	methods: {
		Jump(){
			uni.switchTab({
				url:'../index/index'
			})
		},
		// 全选
		allSelect() {
			this.isAllselected = !this.isAllselected;
			this.cartList.forEach(item => {
				if (this.isShowPay) {
					if (item.status === 1) {
						item.checked = this.isAllselected;
					}
				} else {
					item.checked = this.isAllselected;
				}
				
				
			});
			this.countData()
		},
		// 选择单个或多个商品
		selectProduct(idx) {
			if(this.isShowPay === true) {
				if (this.cartList[idx].status === 0) {
					// this.$common.showToast('您选择该商家商品已下架', false)
					uni.showToast({
						title: '您选择该商家商品已下架',
						icon: 'none'
					})
					return false
				}
			}
			
			const { checked } = this.cartList[idx];
			let isAllselected = true  // 假设全选
			const item = this.cartList[idx];
			console.log(item)
			this.$forceUpdate();
			this.$set(this.cartList[idx], 'checked', !checked);
			for(let item of this.cartList) {
				if(!item.checked) {
					isAllselected = false
				}
			}
			this.isAllselected = isAllselected
			this.countData()
		},
		// 修改购物车中商品的数量
		calcValue(num, idx) {
			const {count, skuId} = this.cartList[idx]
			
			if(count === 1) {
				if(Number(num) === -1) {
					// uni.showModal({
					// 	title: '提示',
					// 	content: '是否删除该商品',
					// 	success: (res) => {
					// 		if(res.confirm) {
					// 			this.cartList.splice(idx,1)
					// 			let params = {
					// 				skuId,
					// 				system: 'UPMALL'
					// 			}
					// 			this.$common.httpGet('common-goods/common/shoppingCart/removeSku',params).then(res => {
					// 				if(res.data.code === 200200) {
					// 					this.$common.showToast('删除成功')
					// 					if(this.cartList.length===0){
					// 						this.isShowEmpty=true
					// 					}
					// 				}
					// 			}) 
					// 		}
					// 	}			
					// })
					this.$common.showToast('商品数量不能再减少了~')
					return
				}
			}
			const newCount = count + num;
			this.$set(this.cartList[idx],'count',newCount)	
			let requestObj = {
				skuId,
				increase: null,
				count: 1,
				system: 'UPMALL'
			}
			
			requestObj.increase = num === 1 ? true : false
			this.$common.httpGet('common-goods/common/shoppingCart/addition',requestObj,false).then(res => {
				console.log(res)
			})
			
			this.countData()
		},
		clickRight() {
			this.isShowPay = !this.isShowPay;
			this.rText = this.isShowPay ? '编辑' : '完成'
		},
		// 删除购物车上的商品
		delectProduct() {
			uni.showModal({
				title: '提示',
				content: '是否删除商品',
				success: (res) => {
					if(res.confirm) {
						let skuIdList = []  //skuId 集合
						for(let item of this.cartList) {
							if(item.checked) skuIdList.push(item.skuId)
						}
						skuIdList = skuIdList.join(',')
						
						let params = {
							skuId: skuIdList,
							system: 'UPMALL'
						}
						this.$common.httpGet('common-goods/common/shoppingCart/removeSku',params).then(res => {
							if(res.data.code === 200200) {
								this.$common.showToast('删除成功')
								this.cartList = this.cartList.filter(item => !item.checked)
								console.log(this.cartList)
								if(this.cartList.length === 0) {
									this.isShowEmpty = true
								}
							}
						})
					}else {
						console.log('取消删除')
					}
				}			
			})
		},

		// 获取购物车列表
		getCarList() {
			this.$common.httpGet('common-goods/common/shoppingCart/cart', { system: 'UPMALL' }).then(res => {
				console.log(res);
				const { code, data, desc} = res.data;
				if (Number(code) === 200200) {
					this.cartList = data;
					this.isShowEmpty = data.length > 0 ? false : true
					for (let item of this.cartList) {
						item.checked = false;
					}
					console.log(this.cartList);
				} else {
					this.$common.showToast(desc);
				}
			});
		},

		// 计算方法
		countData() {
			let totalPrice = 0;  //总价格
			let choosedNum = 0;  //选中的数量
			for (let item of this.cartList) {
				if (item.checked) {
					choosedNum += item.count;
					totalPrice += item.count * item.price;
				}
			}
			this.totalPrice = totalPrice.toFixed(2)
		},
		
		// 去结算
		handlePay() {
			console.log(this.totalPrice)
			// 筛选出勾选的商品
			let selectCartList = this.cartList.filter(item => item.checked)
			console.log(selectCartList,"selectCartList")
			if(selectCartList.length === 0) {
				this.$common.showToast('请选择要结算的商品')
				return
			}
			let freightPrice = 0  // 运费
			for(let item of selectCartList) {
				freightPrice += item.freight
			}
			// 需要构造的数据
			let goodInfo = {
				totalAmount: this.totalPrice,  // 总价格
				pagesInfo: 3,// 页面标识
				comboLevel: '',//套餐标识
				share: this.share,// 分享码
				freightPrice, // 运费
				goodlist: selectCartList  // 选中的商品列表
			}		
			uni.setStorageSync('goodInfo',goodInfo)
			uni.navigateTo({
				url: '../orderSettlement/orderSettlement'
			})
		},
		// 跳转商品详情页
		goToProduct(e){
			console.log(e)
			uni.navigateTo({
				url: '../product/product?spu=' + e
			})
		}
	}
};
</script>

<style lang="less" scoped>
page {
}
.shoppingCart {
	background: #f8f6f9;
	min-height: 100vh;
	padding-bottom: 30rpx;
	.shoppingCart-shop {
		padding: 0 32rpx;
		background: #ffffff;
		display: flex;
		height: 88rpx;
		align-items: center;
		justify-content: space-between;
		font-size: 26upx;
		.shoppingCart-shop-left {
			display: flex;
			align-items: center;
			.shop-img {
				width: 36rpx;
				height: 36rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.shop-name {
				margin-left: 28rpx;
				font-size: 26rpx;
				font-weight: 500;
				color: rgba(0, 0, 0, 1);
			}
			.shop-icon {
				margin-left: 35rpx;
			}
		}
		.shoppingCart-shop-right {
			color: rgba(0, 0, 0, 1);
			font-size: 26rpx;
		}
	}
	.shoppingCart-product {
		margin: 20rpx 32rpx 98rpx;
		padding: 0 16rpx ;
		// height: 546rpx;
		background: #ffffff;
		border-radius: 6rpx;
		
		.EditSelectAll {
			padding-top: 26rpx;
			display: flex;
			align-items: center;
			.text {
				margin-left: 22rpx;
				width: 60rpx;
				height: 30rpx;
				background: rgba(237, 244, 252, 1);
				border-radius: 15rpx;
				font-size: 20rpx;
				line-height: 30rpx;
				text-align: center;
				color: rgba(89, 142, 220, 1);
			}
		}
		.productList {
			padding: 20rpx 0;
			.productItem {
				padding: 46rpx 0 22rpx 0;
				display: flex;
				align-items: center;
				position: relative;
				.proImg {
					margin-left: 26rpx;
					width: 174rpx;
					height: 174rpx;
					// background: #dd524d;
					image {
						width: 100%;
						height: 100%;
					}
				}
				.productItem-right {
					// height: 174rpx;
					flex: 1;
					margin-left: 26rpx;
					display: flex;
					justify-content: space-between;
					flex-direction: column;
					.proName {
						-o-text-overflow: -o-ellipsis-lastline;
						text-overflow: -o-ellipsis-lastline;
						overflow: hidden;
						-o-text-overflow: ellipsis;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						line-clamp: 2;
						-webkit-box-orient: vertical;
						color: rgba(29, 28, 28, 1);
						font-size: 26rpx;
						font-weight: 500;
					}
					.proReceiver {
						margin-top: 18rpx;
						font-size: 24upx;
						font-weight: 500;
						color: rgba(128, 128, 128, 1);
					}
					.productItem-right-right {
						margin-top: 16rpx;
						display: flex;
						justify-content: space-between;
						.price {
							color: #06B720;
							font-weight: bold;
						}
						.opsNum {
							display: flex;
							.ops {
								width: 48rpx;
								height: 48rpx;
								background: rgba(247, 247, 247, 1);
								border: 1px solid rgba(230, 230, 230, 1);
								font-size: 24rpx;
								text-align: center;
								line-height: 48rpx;
							}
							.subtract {
								color: rgba(153, 153, 153, 1);
								border-radius: 8rpx 0px 0px 8rpx;
							}
							.proNum {
								margin: 0 6rpx;
								width: 56rpx;
								height: 48rpx;
								background: rgba(247, 247, 247, 1);
								border: 1px solid rgba(230, 230, 230, 1);
								line-height: 48rpx;
								text-align: center;
								font-size: 24rpx;
								color: rgba(80, 80, 80, 1);
							}
							.plus {
								color: rgba(80, 80, 80, 1);
								border-radius: 0px 8rpx 8rpx 0px;
							}
						}
					}
				}
				.cart-item-img_del {
					position: absolute;
					right: 50upx;
					top: 80upx;
					z-index: 50;
					width: 80upx;
					height: 80upx;
					z-index: 2;
					image {
						width: 100%;
						height: 100%;
					}
				}
				.cart-item-mask {
					position: absolute;
					left: 0;
					top: 0;
					background: #ccc;
					opacity: 0.4;
					width: 100%;
					height: 100%;
					z-index: 20;
				}
			}
		}
	}
	.shoppingCart-footer {
		width: 100vw;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 21;
		display: flex;
		justify-content: space-between;
		height: 98rpx;
		align-items: center;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 0px 4rpx 0px rgba(217, 217, 217, 1);
		.shoppingCart-footer-left {
			display: flex;
			margin-left: 46rpx;
			height: 98rpx;
			align-items: center;
			.text {
				margin-left: 18rpx;
				color: rgba(21, 21, 21, 1);
				font-size: 28rpx;
				font-weight: 500;
			}
		}
		.shoppingCart-footer-right {
			display: flex;
			margin-right: 32rpx;
			.left {
				margin-right: 36rpx;
			}
			.right {
				width: 200rpx;
				height: 72rpx;
				background: #06B720;
				border-radius: 36rpx;
				color: #ffffff;
				font-weight: bold;
				font-size: 28rpx;
				text-align: center;
				line-height: 72rpx;
			}
			.delete {
				width: 150rpx;
				height: 62rpx;
				border-radius: 31rpx;
				border: 1px solid #06B720;
				color: #06B720;
				background-color: #fff;
				font-weight: bold;
				text-align: center;
				line-height: 62rpx;
				font-size: 28rpx;
			}
		}
		.shoppingCart-footer-ops {
		}
	}
	.shoppingCart-empty {
		position: relative;
		height: 100vh;
		width: 100vw;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		.content {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
		}
		image {
			width: 200upx;
		}
		.tips {
			font-size: 30upx;
			margin: 30upx 0;
		}
		.goBtn {
			width: 250upx;
			height: 70upx;
			background-color: #06B720;
			color: #fff;
			text-align: center;
			line-height: 70upx;	
			font-size: 32upx;
		}
	}
}
// .checkbox-box {

// 	display: flex;
// 	align-items: center;

.checkbox {
	width: 28rpx;
	height: 28rpx;
	background: rgba(255, 255, 255, 1);
	border: 2rpx solid #06B720;
	border-radius: 50%;
	// display: flex;
	// align-items: center;
	// justify-content: center;
	position: relative;

	.on {
		width: 18upx;
		height: 18upx;
		border-radius: 50%;
		background-color: #06B720;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
}

// .text {
// 	font-size: 28upx;
// 	margin-left: 10upx;
// }
// }
</style>
