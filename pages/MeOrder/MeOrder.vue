<template>
	<view class="MeOrder">
		<yu-kefu position="3"></yu-kefu>
		<view class="wucTabBox1">
			<uni-nav-bar :status-bar="true" background-color="#FFFFFF" color="#000000" left-icon="arrowleft" title="我的订单"
			 :shadow='false' fixed="true" @click-left="back" />
		</view>
		<view class="wucTabBox2">
			<wuc-tab :tab-list="tabList3" textFlex :tabCur.sync="TabCur3" tab-class="text-center text-black bg-white"
			 select-class="text-orange" @change="change"></wuc-tab>
		</view>
		<!-- 全部 -->
		<view class="list-wrap">
			<view class="item" v-for="(item,index) in goodList" :key="index">
				<view class="header">
					<view class="header-left">
						订单编号：{{item.orderSn}}
						<text class="pintuan"  v-if="item.isGroup!=-1" :class="[item.isGroup === 0?'ing':item.isGroup === 1?'yes':'no']">{{item.isGroup==0?'组团中':item.isGroup ==1?'组团成功':'组团失败'}}</text>
					</view>
					<view class="header-right">
						<text v-if="item.orderStatus===0">待付款</text>
						<text v-if="item.orderStatus===1">待收货</text>
						<text v-if="item.orderStatus===2">已完成</text>
						<text v-if="item.orderStatus===3">已取消</text>
						<text v-if="item.orderStatus===4">待发货</text>
						<text v-if="item.orderStatus===5">退款中</text>
						<text v-if="item.orderStatus===6">退款完成</text>
					</view>
				</view>
				<view class="item-list_box" v-for="(shopItem,index1) in item.orderListProductList" :key="index1" @tap="goOrder(item)">
					<view class="item-list">
						<view class="left">
							<image :src="shopItem.productImg" mode=""></image>
						</view>
						<view class="right">
							<view class="right-header">
								{{shopItem.productName}}
								<view class="right-body">规格：
									<text style="margin: 0 5px;">{{shopItem.productSpec}}</text>
								</view>
								<text style="margin: 0 5px;"  class="pintuan no" v-if="shopItem.clearInfo">{{shopItem.clearInfo | statusFormat}}</text>
							</view>
							<view class="right-bottom">
								<text>￥{{shopItem.productPrice}}</text> <text>x {{shopItem.productCount}}</text>
							</view>
						</view>
					</view>
				</view>
				
				<view class="item-price">
					共{{item.totalProductCounts}}件商品 实付款：<text>￥{{item.totalAmount}}</text>
				</view>
				<view class="item-submit" v-if="Number (item.orderStatus) < 2">
					<view class="submit" @tap.stop="cancelOrder(item)" v-if="Number (item.orderStatus)===0">取消订单</view>
					<view class="submit" @tap.stop="pay(item)" v-if="Number (item.orderStatus)===0">去付款</view>
					<view class="submit" v-if="item.orderStatus===1" @tap.stop='confirmProduct(item)'>确认收货</view>
					<view class="submit" v-if="Number(item.orderStatus)===1|| Number(item.orderStatus)===2" @tap.stop='goLogistics(item)'>查看物流</view>
				</view>
			</view>


		</view>
		<view class="notThing" v-if="goodList.length===0">
			<image src="../../static/images/feedback/Artwork.png" mode="aspectFill"></image>
		</view>
		<bottomNav></bottomNav>
	</view>
</template>

<script>
	import uniNavBar from '../../components/uni-nav-bar/uni-nav-bar.vue'
	import WucTab from '../../components/wuc-tab/wuc-tab.vue';
	import bottomNav from '../../components/bottomNav/bottomNav.vue';
	import yuKefu from '@/components/yu-kefu/yu-kefu.vue'
	import throttle from '../../common/throttle.js';
	export default {
		components: {
			WucTab,
			uniNavBar,
			yuKefu,
			bottomNav
		},
		data() {
			return {


				// （0待付款，1待收货，2已完成，3已取消，4待发货，5退款中，6退款完成）
				tabList3: [{
						name: '全部'
					}, {
						name: '待付款'
					},

					{
						name: '待发货'
					},
					{
						name: '待收货'
					},
					{
						name: '退款中'
					},
					{
						name: '退款完成'
					},
					{
						name: '已完成'
					},
					{
						name: '已取消'
					}

				],
				TabCur3: 0,
				navIndex: 0,
				cancel: false,
				goodList: [],
				loadingType: 'nomore',
				isRefresh: true,
				param: {
					pageNum: 1,
					pageSize: 5,
					memberId: '1',
					status: ""
				}
			}
		},
		
		filters: {
			statusFormat(value) {
				return Number(value) === 0 ? '未拼中商品' : '拼中商品'
			}
		},

		onLoad(option) {
			if (Number(option.navIndex) <= 7) {
				console.log('页面加载有', option)
				this.navIndex = Number(option.navIndex)
			} else {
				console.log('页面加载没有', option)
				this.navIndex = 0
			}

		},
		onShow() {

			// （0待付款，1待收货，2已完成，3已取消，4待发货，5退款中，6退款完成）
			this.goodList = []
			this.param.pageNum = 1
			this.param.status = Number(this.navIndex)
			this.TabCur3 = Number(this.navIndex)
			switch (this.navIndex) {
				case 0:
					this.param.status = "";
					this.getOrder()
					break;
				case 1:
					this.param.status = "0";
					this.getOrder()
					break;
				case 2:
					this.param.status = "4";
					this.getOrder()
					break;
				case 3:
					this.param.status = "1";
					this.getOrder()
					break;
				case 4:
					this.param.status = "5";
					this.getOrder()
					break;
				case 5:
					this.param.status = "6";
					this.getOrder()
					break;
				case 6:
					this.param.status = "2";
					this.getOrder()
					break;
				case 7:
					this.param.status = "3";
					this.getOrder()
					break;
				default:
					break;
			}
		},
		onReachBottom() {
			this.loadData()
		},
		beforeDestroy() {
			// 清除定时器
			clearInterval(this._inter)
		},

		methods: {
			// 订单列表查询
			getOrder() {
				this.goodList = []
				this.$common.httpGet('/order/order/getOrderPages?pageNum=' + this.param.pageNum + '&pageSize=' + this.param.pageSize +
					'&orderStatus=' + this.param.status).then((res) => {
					if (Number(res.data.code) === 300200) {
						this.goodList = res.data.data.records
						// console.log(this.goodList)
						// 清除定时器
						clearInterval(this._inter)   
					} else {
						this.goodList = []
						clearInterval(this._inter)
					}
				})
			},
			// 跳转订单详情
			goOrder(item) {
				console.log(item)
				uni.navigateTo({
					url: `../orderDetails/orderDetails?id=${item.orderId}`
				})
			},
			// 点击取消订单
			cancelOrder(item) {
				// console.log(item)
				uni.showModal({
					content: '确认取消订单？',
					success: (res) => {
						if (res.confirm) {
							this.$common.httpPost('order/order/cancel/' + item.orderId, true).then((res) => {
								console.log(res)
								this.param.pageNum = 1
								if (Number(res.data.code) === 300200) {
									this.$common.showToast1(res.data.message, 'none')
									// 设定3秒后刷新
									this._inter = setInterval(() => {
										this.getOrder()
									}, 3000)
								} else {
									this.$common.showToast1(res.data.message, 'none')
								}
							})
						}
					}
				})
			},
			// 点击确认收货
			confirmProduct(item) {
				console.log(item)
				uni.showModal({
					content: '确认收货？',
					success: (res) => {
						if (res.confirm) {
							// console.log('用户点击确定');
							this.$common.httpPost('order/order/updateOrderStatus/' + item.orderId, true).then((res) => {
								console.log(res)
								this.param.pageNum = 1
								if (Number(res.data.code) === 300200) {
									this.$common.showToast1(res.data.message, 'none')
									this._inter = setInterval(() => {
										this.getOrder()
									}, 3000)
								} else {
									this.$common.showToast1(res.data.message, 'none')
								}
							})
						}
					}
				});
			},
			// 点击去付款
			pay(item) {
				uni.navigateTo({
					url: `../orderDetails/orderDetails?id=${item.orderId}`,

				})
			},
			// 点击查看物流
			goLogistics(item) {
				console.log(item)
				uni.navigateTo({
					url: `../logistics/logistics?id=${item.orderSn}`,
				})
			},
			// 上拉加载更多
			loadData() {
				if (this.isRefresh) {
					this.param.pageNum = this.param.pageNum + 1
					this.$common.httpGet('/order/order/getOrderPages?pageNum=' + this.param.pageNum + '&pageSize=' + this.param.pageSize +
						'&orderStatus=' + this.param.status).then((res) => {
						let data = res.data.data.records ? res.data.data.records : []
						console.log(data.length)
						if (data.length > 0) {
							this.loadingType = 'loading'
							this.goodList = this.goodList.concat(data)
						} else {
							this.loadingType = 'nomore'
							this.isRefresh = false
							uni.showToast({
								title: '没有更多了',
								duration: 3000,
								icon: 'none'
							});
						}
					})
				} else {
					this.loadingType = 'nomore'
				}
			},
			// 点击头部导航切换
			change(index) {
				// console.log(index)
				this.navIndex = index
				this.param.pageNum = 1
				this.isRefresh = true
				this.goodList = []
				switch (index) {
					case 0:
						this.param.status = "";
						this.getOrder()
						break;
					case 1:
						this.param.status = "0";
						this.getOrder()
						break;
					case 2:
						this.param.status = "4";
						this.getOrder()
						break;
					case 3:
						this.param.status = "1";
						this.getOrder()
						break;
					case 4:
						this.param.status = "5";
						this.getOrder()
						break;
					case 5:
						this.param.status = "6";
						this.getOrder()
						break;
					case 6:
						this.param.status = "2";
						this.getOrder()
						break;
					case 7:
						this.param.status = "3";
						this.getOrder()
						break;
					default:
						break;
				}
			},
			goorderDetails(id) {
				this.$store.commit("setUrl", {
					url: '../MeOrder/MeOrder?navIndex=' + this.navIndex,
					isindex: false
				})
				uni.navigateTo({
					url: '../orderDetails/orderDetails?tradeNo=' + id
				})
			},
			// 定义导航
			back: throttle.throttleFunc(function() {
				let shareId = ''
				this.$common.passUserauth(shareId).then(res => {
					console.log(res);
					if (res) {
						// this.$common.navigateTo('../profile/profile');
						uni.reLaunch({
							url: '../profile/profile'
						})
					} else {
						console.log('pk')
						this.$common.navigateTo('../auth/auth?share=' + shareId + '&isAuth=2');
					}
				});

			}, 1500),
			// 确认收货
			confirmReceipt(tradeNo) {
				uni.showModal({
					title: '提示',
					content: '确认收货吗？',
					success: function(res) {
						if (res.confirm) {
							this.$common.httpGet('/mall-order/goodsTradeInfo/confirmReceipt?tradeNo=' + tradeNo, true).then((res) => {
								this.$common.showToast1(res.data.desc, 'none')
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F2F2F2 !important;
	}

	.MeOrder {
		touch-action: default;
		background: #F2F2F2;
		position: relative;
		padding-top: 90upx;
		padding-bottom: 170upx;
		.notThing {
			width: 100px;
			height: 100px;
			margin: 50px auto;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.wucTabBox1 {
			position: fixed;
			left: 0;
			/* #ifdef MP-WEIXIN */
			top: 0upx;
			/* #endif */
			width: 100%;
			z-index: 100;
		}

		.wucTabBox2 {
			position: fixed;
			top: 0;
			/* #ifdef MP-WEIXIN */
			top: 50upx;
			/* #endif */
			width: 100%;
			padding-top: 100upx;
			background-color: #FFFFFF;
			z-index: 99;
		}


		.list-wrap {
			position: relative;
			padding-top: 150upx;

			.item {
				width: 100vw;
				min-height: 430upx;
				background: #fff;
				margin-top: 15upx;

				.header {
					box-sizing: border-box;
					padding: 0 20upx;
					height: 100upx;
					width: 100%;
					font-size: 28upx;
					font-family: PingFang-SC-Medium;
					font-weight: 500;
					color: rgba(0, 0, 0, 1);
					display: flex;
					justify-content: space-between;
					align-items: center;
					// line-height: 100upx;

					// border-bottom: 1px solid #ccc;
					.header-left {
						.pintuan {
							margin-left: 20upx;
							display: inline-block;
							padding: 10upx 20upx;
							font-size: 24upx;
						}
						.yes {
							color: #094;
							background-color: #e4fff0;
						}
						.no {
							color: #ec9662;
							background-color: #fff4ed;
						}
						.ing {
							color: #128bed;
							background-color: #e7f4ff;
						}
					}

					.header-right {
						color: #4A90E2;
					}
				}

				.item-list {
					.pintuan {
						margin-left: 20upx;
						display: inline-block;
						padding: 10upx 20upx;
						font-size: 24upx;
					}
					.no {
						color: #ec9662;
						background-color: #fff4ed;
					}
					min-height: 206upx;
					// width: calc(100vw - 48upx);
					// border-bottom: 1px solid #B3B3B3;
					padding: 0 24upx;
					display: flex;
					background-color: #F8F6F9;

					.left {
						width: 160upx;
						height: 160upx;
						margin: 24upx;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.right {
						flex: 1;
						padding: 24upx 0;
						display: flex;
						flex-direction: column;
						justify-content: space-between;

						.right-header {
							font-size: 28upx;
							font-family: PingFang-SC-Medium;
							font-weight: 500;
							color: rgba(0, 0, 0, 1);
							text-overflow: -o-ellipsis-lastline;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							// -webkit-line-clamp: 1;
							// line-clamp: 1;
							-webkit-box-orient: vertical;

						}

						.right-body {
							font-size: 24upx;
							font-family: PingFang-SC-Medium;
							font-weight: 500;
							color: rgba(128, 128, 128, 1);
						}

						.right-bottom {
							display: flex;
							justify-content: space-between;
							font-size: 28upx;
							font-family: PingFang-SC-Medium;
							font-weight: 500;
							color: #4A90E2;

							// margin-top: 48upx;
							text:last-child {
								color: #000;
							}
						}
					}
				}

				.item-price {
					text-align: right;
					font-size: 24upx;
					font-family: PingFang-SC-Medium;
					font-weight: 500;
					color: rgba(0, 0, 0, 1);
					padding: 25upx 0;

					text {
						margin-right: 36upx;
						font-size: 28upx;
						font-family: PingFang-SC-Medium;
						font-weight: 500;
						color: #4A90E2;
					}
				}

				.item-submit {
					display: flex;
					flex-direction: row-reverse;
					margin: 0upx 30upx;
					padding: 20upx 0;
					box-sizing: border-box;
					border-top: 1px solid #F7F7F7;

					.submit {
						border-radius: 20px;
						width: 140upx;
						border: 1px solid #4A90E2;
						text-align: center;
						line-height: 48upx;
						height: 48upx;
						font-size: 24upx;
						font-family: PingFang-SC-Medium;
						font-weight: 500;
						color: #4A90E2;
						margin-left: 36upx;
					}
				}

				.item-submit-cancel {
					display: flex;
					flex-direction: row-reverse;
					padding: 15upx 0 0 0;

					.submit {
						border-radius: 20px;
						width: 140upx;
						border: 1px solid #4A90E2;
						text-align: center;
						line-height: 48upx;
						height: 48upx;
						font-size: 24upx;
						font-family: PingFang-SC-Medium;
						font-weight: 500;
						color: #4A90E2;
						margin-right: 36upx;
					}
				}
			}

			.item:first-child {
				margin-top: 16upx;
			}
		}
	}
</style>
