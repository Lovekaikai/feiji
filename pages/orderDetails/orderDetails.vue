<template>
	<view class="orderDetails">
		<yu-kefu position="3"></yu-kefu>
		<view class="NavBar">
			<uni-nav-bar :status-bar="true" background-color="#FFFFFF" color="#000000" left-icon="arrowleft" title="订单详情"
			 :shadow='false' fixed="true" @click-left="oneTap()" />
		</view>
		<view class="list-wrap">
			<view class="take" v-if="Number(Status)===0">
				<view class="take-left">
					<image src="../../static/images/orderDateills/cart.png" mode=""></image>
				</view>
				<view class="take-right">
					<view class="take-top">
						等待买家付款
					</view>
					<view class="take-bottom">
						<uni-countdown :show-day="false" :minute="0" :second="second" @timeup="timeup()" />
						<view class="left-title" style="margin-left: 10rpx;">
							秒内付款
						</view>
					</view>
					<view class="take-bottom-title">
						超时订单将自动关闭
					</view>
				</view>
			</view>
			<view class="adress" v-if="(Number(Status) === 1)||(Number(Status) === 2)|| (Number(Status) === 0)|| (Number(Status) === 4)">
				<view class="adress_icon">
					<view class="left_icon">
						<text class="iconfont icon-iclocationonpx"></text>
						<view class="default" v-if="Number(address.isDefault)=== 1">默认</view>
					</view>
				</view>
				<view class="adress_text">
					<view class="user_receive">
						<text>收货人：{{address.name || "无"}}</text>
						<text>{{address.tel || ""}}</text>
					</view>
					<view class="user_adress">
						<text>收货地址：{{address.fullSite}}{{address.addressDetail || ""}}</text>
					</view>
				</view>
				<view class="icon">
					<!-- <text class="iconfont icon-xiangyou1"></text> -->
				</view>
				<image src="../../static/images/orderSettlement/header_logo.png" mode=""></image>
			</view>
			<view class="header">
				<view class="steps">
					<uni-steps :options="[{title: '买家付款'}, {title: '商家发货'}, {title: '交易完成'}]"
					 :active="active"></uni-steps>
				</view>
			</view>
			<view class="item">
				<view class="item-list_box">
					<view class="item-list_header">
						<view class="shopName" style="color:#0077AA">订单状态：{{Info.statusText}}</view>
					</view>
					<view class="item-list_header">
						<view class="shopIcon">
							<image src="../../static/images/shop.png" mode=""></image>
						</view>
						<view class="shopName">UP商城</view>
						<uni-icons type="arrowright" size="18"></uni-icons>
					</view>
					<view class="item-list" v-for="(item,index) in goodList" :key="index">
						<view class="left">
							<image :src="item.skuImage" mode=""></image>
						</view>
						<view class="right">
							<view class="right-header">
								{{item.skuName}}
								<view class="right-body">规格：
									<text style="margin: 0 5px;">{{item.spec}}</text>
								</view>
							</view>
							<view class="right-bottom">
								<text>￥{{item.skuPrice}}</text> <text>x {{item.productCount}}</text>
							</view>
						</view>
					</view>
					<!-- 			<view class="item-list_footer">
					<text class="point">余额抵扣：{{balanceValue}}</text>
				</view> -->
				</view>
			</view>
			<view class="item-statistics">
				<view class="item-statistics-Box">
					<text class="item-statistics-title">商品金额</text>
					<text class="item-statistics-money">￥{{sum}}</text>
				</view>
				<view class="item-statistics-Box">
					<text class="item-statistics-title">运费</text>
					<text class="item-statistics-money">￥{{Info.freightPrice}}</text>
				</view>
				<view class="total-Box">
					<text class="total-Box-sum">合计：</text>
					<text class="total-Box-num">￥{{Info.actualPrice}}</text>
				</view>
			</view>
			<view class="orderInfo">
				<view class="orderInfo-Box">
					<view class="orderInfo-item">
						订单编号：
					</view>
					<view class="orderInfo-value">
						{{Info.orderSn}}
					</view>
					<view class="copy" @tap="handleCopy()">
						复制
					</view>
				</view>
				<view class="orderInfo-Box">
					<view class="orderInfo-item">
						提交时间：
					</view>
					<view class="orderInfo-value">
						{{Info.submitTime}}
					</view>
				</view>
				<view class="orderInfo-Box" v-if="(Number(this.Status) === 2) || (Number(this.Status) === 3)">
					<view class="orderInfo-item">
						{{Number(this.Status)===3?'完成时间':'取消时间'}}：
					</view>
					<view class="orderInfo-value">
						{{Info.cancelTime || Info.finishTime}}
					</view>
				</view>
				<view class="orderInfo-Box">
					<view class="orderInfo-item">
						支付方式：
					</view>
					<view class="orderInfo-value">
						{{Number(Info.payWay)===2?'微信支付':'余额支付'}}
					</view>
				</view>
			</view>
			<view class="footer">
				<view class="footer-right" @tap="goLogistics()" v-if="(Number(this.Status) === 1)||(Number(this.Status) === 2)">
					查看物流
				</view>
				<view class="footer-right" v-if="Number(this.Status) === 1" @tap="confirmProduct()">
					确认收货
				</view>
				<view class="footer-right" v-if="(Number(this.Status) === 0)" @tap="cancelOrder()">
					取消订单
				</view>
				<view class="footer-right back" style="background-color: #CCCCCC;" v-if="(Number(this.Status) === 0) && clickTime === 1">
					确认支付
				</view>
				<view class="footer-right" v-if="(Number(this.Status) === 0) && clickTime === 0" @tap="payway()">
					确认支付
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import uniIcons from "../../components/uni-icon/uni-icon.vue"
	import uniNavBar from '../../components/uni-nav-bar/uni-nav-bar.vue'
	import uniCountdown from '../../components/uni-countdown/uni-countdown.vue'
	
	// 客服组件
	import yuKefu from '@/components/yu-kefu/yu-kefu.vue'
	export default {
		components: {
			uniIcons,
			uniCountdown,
			uniNavBar,
			yuKefu
		},
		data() {
			return {
				active: '', // 步骤条
				id: '73', //订单ID
				Status: '0', //订单状态
				Info: {}, //订单详情
				goodList: [],
				address: {},
				second: 0, //倒计时秒数
				Now: 0, //现在的时间
				navIndex: 0, //我的订单页面导航ID
				sum: 0, //商品金额
				pages: '',
				pageLoading: 0, //多次点击
				clickTime: 0, // 按钮置灰
				timeId: '',
			};
		},
		onLoad(option) { //option为object类型，会序列化上个页面传递的参数
			console.log(option) //打印出上个页面传递的参数
			this.id = option.id
			this.pages = option.pages
			console.log(this.pages) //打印出上个页面传递的参数
			this.Now = Math.round(new Date() / 1000)
			this.getOrder(this.id)
		},
		onShow() {
			this.pageLoading = !1;
		},
		beforeDestroy() {
			// 清除定时器
			clearInterval(this._inter)
		},
		methods: {
			// 订单查询
			getOrder(id) {
				this.sum = 0
				this.id = id
				this.goodList = []
				this.$common.httpGet('/order/order/getById/' + this.id).then((res) => {
					// console.log(res)
					if (Number(res.data.code) === 300200) {
						this.Info = res.data.data
						this.goodList = res.data.data.productDetailList
						this.address = res.data.data.addressInfo
						this.Status = this.Info.status
						if (Number(this.Status) === 1) {
							this.navIndex = 3
							this.active = 1
						} else if (Number(this.Status) === 0) {
							this.navIndex = 1
							this.second = Number(this.Info.expire_time) - this.Now
							// this.second = 1586942006 - this.Now
							this.active = 0
						} else if (Number(this.Status) === 2) {
							this.active = 2
							this.navIndex = 6
						} else if (Number(this.Status) === 3) {
							this.navIndex = 7
							this.active = 2
						} else if (Number(this.Status) === 4) {
							this.navIndex = 2
							this.active = 0
						} else if (Number(this.Status) === 5) {
							this.navIndex = 4
							this.active = 2
						} else {
							this.active = 2
							this.navIndex = 5
						}
						let sum1 = Number(this.Info.actualPrice) - Number(this.Info.freightPrice)
						this.sum = sum1.toFixed(1)
						// console.log(this.sum)
						clearInterval(this._inter)
						this.clickTime = 0
					} else {
						this.Info = res.data.data = {}
						this.goodList = []
						this.clickTime = 1
						clearInterval(this._inter)
					}
				})
			},
			// 付款
			payway() {
				// var _this = this
				// 按钮置灰
				this.clickTime = 1
				clearTimeout(this.timeId)
				if (this.Info.orderSn) {
					this.timeId = setTimeout(() => {
						this.clickTime = 0
					}, 5000)
					let openid = this.$common.getStorage('userInfo').weixinOpenid
					let parmas = {
						"orderSn": this.Info.orderSn,
						"openid": openid,
					}
					this.$common.httpPost('order/order/createOrder', parmas).then((res) => {
						console.log(res)
						if (Number(res.data.code) === 300200) {
							let Paydata = res.data.data
							uni.requestPayment({
								provider: 'wxpay',
								timeStamp: Paydata.unifiedData.timestamp,
								nonceStr: Paydata.unifiedData.noncestr,
								package: 'prepay_id=' + Paydata.unifiedData.prepayid,
								signType: Paydata.unifiedData.signType,
								paySign: Paydata.unifiedData.sign,
								success: (res) => {
									this.$common.showToast1('支付成功', 'success')
									if (this.Info.comboLevel) {
										let BuyCombo = {
											'orderNo': this.Info.orderSn,
											'comboFlag': this.Info.comboLevel
										}
										this.$common.httpPost('up_mall_rebate/rebate/agentIntiveBuyCombo', BuyCombo).then((res) => {
											console.log('朝华的接口', res)
											if (Number(res.data.code) === 500200) {
												this.getOrder(Paydata.orderId)
											}
										})
									} else {
										this.getOrder(Paydata.orderId)
									}
								},
								fail: (res) => {
									this.$common.showToast1('取消支付', "none")
									// console.log('fail:' + JSON.stringify(err));
								}
							});

						} else {
							// console.log(res)
							uni.showToast({
								title: res.data.message,
								duration: 3000,
								icon: 'none'
							});
						}
					})
				}
			},
			// 点击取消订单
			cancelOrder() {
				uni.showModal({
					content: '确认取消订单？',
					success: (res) => {
						if (res.confirm) {
							this.$common.httpPost('order/order/cancel/' + this.id, true).then((res) => {
								if (Number(res.data.code) === 300200) {
									this.$common.showToast1(res.data.message, 'none')
									this.getOrder(this.id)
								} else {
									this.$common.showToast1(res.data.message, 'none')
								}
							})
						}
					}
				})
			},
			// 点击确认收货
			confirmProduct() {
				uni.showModal({
					content: '确认收货？',
					success: (res) => {
						if (res.confirm) {
							this.$common.httpPost('order/order/updateOrderStatus/' + this.id, true).then((res) => {
								if (Number(res.data.code) === 300200) {
									this.$common.showToast1(res.data.message, 'none')
									// 设定3秒后刷新
									// this.getOrder(this.id)
									this._inter = setInterval(() => {
										this.getOrder(this.id)
									}, 3000)
								} else {
									this.$common.showToast1(res.data.message, 'none')
								}
							})
						}
					}
				});
			},
			// 倒计时时间结束触发
			timeup() {
				this.$common.showToast1('订单超时', 'none')
				// 设定3秒后刷新
				this._inter = setInterval(() => {
					this.getOrder(this.id)
				}, 3000)
			},
			// 点击查看物流
			goLogistics() {
				uni.navigateTo({
					url: `../logistics/logistics?id=${this.Info.orderSn}`,
				})
			},
			//解决多次点击
			oneTap() {
				if (!this.pageLoading) {
					this.pageLoading = !0;
					this.back()
				} else {}
			},
			// 定义导航
			back() {
				if (Number(this.Status) === 0) {
					console.log('是代付款')
					let goodsInfo = this.$common.getStorage('goodInfo')
					if (!this.pages) {
						uni.navigateBack({
							delta: 1
						});
					} else {
						// console.log('成功')
						if (Number(goodsInfo.pagesInfo) === 1) {
							console.log('商品详情')
							uni.redirectTo({
								url: '../product/product?spu=' + goodsInfo.productSpuId + '&sku=' + goodsInfo.productId
							});
						} else if (Number(goodsInfo.pagesInfo) === 2) {
							console.log('不知道是啥')
							uni.redirectTo({
								url: `../MeOrder/MeOrder?navIndex=1`
							})
						}
						// else {
						// 	uni.redirectTo({
						// 		url: '../buypackagecode/buypackagecode?share' + goodsInfo.share
						// 	})
						// }
					}
				} else if (Number(this.Status) === 1) {
					console.log('代收货')
					uni.navigateTo({
						url: `../MeOrder/MeOrder?navIndex=2`
					})
				} else {
					console.log('其他')
					uni.navigateBack({
						delta: 1
					});
				}
			},
			// 点击复制
			handleCopy() {
				wx.setClipboardData({
					data: this.Info.orderSn,
					success: function(res) {
						wx.getClipboardData({ //这个api是把拿到的数据放到电脑系统中的
							success: function(res) {
								console.log(res.data) // data
								// this.$common.showToast1('复制成功', 'none')
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.orderDetails {
		height: 94vh;
		background-color: #F8F6F9;
		position: relative;

		.NavBar {
			position: fixed;
			left: 0;
			/* #ifdef MP-WEIXIN */
			top: 0upx;
			/* #endif */
			width: 100%;
			z-index: 100;
		}

		.list-wrap {
			padding-top: 150upx;

			.take {
				padding: 20upx 40upx;
				display: flex;
				align-items: center;

				.take-left {
					height: 60upx;
					width: 60upx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.take-right {
					margin-left: 30upx;

					.take-top {
						padding: 10upx 0;
						font-size: 28upx;
						color: #06B720;
					}

					.take-bottom {
						padding: 10upx 0;
						font-size: 28upx;
						color: #818181;
						display: flex;
						align-items: center;

						.left-title {}
					}

					.take-bottom-title {
						font-size: 28upx;
						color: #818181;
					}
				}
			}

			.adress {
				// margin-bottom: 40upx;
				height: 196upx;
				width: 100%;
				background: #fff;
				display: flex;
				align-items: center;
				position: relative;

				image {
					position: absolute;
					height: 8px;
					width: 100%;
					bottom: -8px;
					left: 0;
				}

				.adress_icon {
					width: 154upx;
					height: 100%;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					.left_icon {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;

						.default {
							text-align: center;
							border: 1px solid rgb(91, 142, 219);
							border-radius: 4px;
							flex: 1;
							padding: 2px 5px;
							width: 50upx;
							font-size: 16upx;
							font-family: PingFang-SC-Medium;
							font-weight: 500;
							color: rgb(91, 142, 219);
						}

						.icon-iclocationonpx {
							color: rgb(91, 142, 219);
							margin-bottom: 20upx;
							flex: 1;
						}
					}
				}

				.adress_text {
					flex: 1;

					// padding: 40upx 0;
					.user_receive {
						font-size: 28upx;
						font-family: PingFang-SC-Bold;
						font-weight: bold;
						color: rgba(0, 0, 0, 1);
						display: flex;
						justify-content: space-between;

						text:last-child {
							font-size: 24upx;
							font-family: PingFang-SC-Medium;
							font-weight: 500;
							color: rgba(0, 0, 0, 1);
						}
					}

					.user_adress {
						margin-top: 10upx;
						font-size: 24upx;
						font-family: PingFang-SC-Medium;
						font-weight: 500;
						color: rgba(0, 0, 0, 1);
					}
				}

				.icon {
					width: 100upx;
					height: 100%;
					line-height: 196upx;
					text-align: center;

					.icon-xiangyou {
						color: #ccc;
					}
				}
			}

			.header {
				padding: 0 20upx;
				background-color: #FFFFFF;
				margin-bottom: 40upx;
				margin-top: 20upx;

				.take {
					padding: 20upx 0;
					display: flex;
					align-items: center;

					.take-left {
						height: 60upx;
						width: 60upx;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.take-right {
						margin-left: 20upx;

						.take-top {
							padding: 10upx 0;
							font-size: 28upx;
							color: #06B720;
						}

						.take-bottom {
							padding: 10upx 0;
							font-size: 28upx;
							color: #818181;
						}
					}
				}

				.steps {
					padding: 20upx 0;
				}
			}

			.item {
				.item-list_box {
					margin-bottom: 20upx;

					.item-list_header {
						height: 90upx;
						width: calc(100% - 72upx);
						font-family: PingFang-SC-Medium;
						display: flex;
						background-color: #FFFFFF;
						align-items: center;
						padding: 0 36upx;

						.shopIcon {
							width: 40upx;
							height: 40upx;
							margin-right: 30upx;

							image {
								width: 100%;
								height: 100%;
							}
						}

						.shopName {
							font-size: 32upx;
							font-weight: 500;
							color: rgba(0, 0, 0, 1);
							margin-right: 30upx;
						}
					}

					.item-list_footer {
						box-sizing: border-box;
						height: 80upx;
						width: 100%;
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding: 0 36upx;
						background-color: #FFFFFF;

						.point {
							font-size: 28upx;
							// flex: 1;
							font-family: PingFang-SC-Medium;
							font-weight: 500;
							color: rgba(0, 0, 0, 1);
						}
					}

					.item-list {
						min-height: 206upx;
						padding: 0 24upx;
						display: flex;
						background-color: #F7F7F7;

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
								margin-top: 48upx;

								text:last-child {
									color: #000;
								}
							}
						}
					}
				}
			}

			.item-statistics {
				margin-top: 20upx;
				background-color: #FFFFFF;
				padding: 0 36upx;

				.item-statistics-Box {
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 80upx;

					.item-statistics-title {
						font-size: 30upx;
					}

					.item-statistics-money {
						font-size: 30upx;
					}
				}

				.total-Box {
					display: flex;
					justify-content: end;
					border-top: 1px solid #f4f4f4;
					// margin: 0upx 20upx;
					font-size: 32upx;
					padding: 20upx 0;
					justify-content: flex-end;

					.total-Box-sum {
						font-size: 28upx;
						color: #808080;
					}

					.total-Box-num {
						color: #06B720;
						font-size: 28upx;
					}
				}
			}

			.orderInfo {
				// margin-top: 40upx;
				padding: 30rpx 36upx 90upx 56upx;
				background-color: #F7F7F7;
				font-size: 26upx;

				.orderInfo-Box {
					display: flex;
					height: 60upx;
					align-items: center;

					.orderInfo-item {
						// font-size: 30upx;
					}

					.orderInfo-value {
						// font-size: 30upx;
						color: #808080;
					}

					.copy {
						margin-left: 30upx;
						// font-size: 30upx;
						color: #06B720;
						text-decoration: underline
					}
				}
			}

			.footer {
				position: fixed;
				width: 100%;
				bottom: 0;
				height: 90upx;
				background-color: #FFFFFF;
				display: flex;
				justify-content: flex-end;
				align-items: center;

				.footer-left {
					.footer-left-sum {
						font-size: 32upx;
					}

					.footer-left-num {
						color: #06B720;
						font-weight: 600;
						font-size: 34upx;
					}
				}

				.footer-right {
					margin: 0 20upx;
					height: 70upx;
					width: 240upx;
					background-color: #06B720;
					color: #FFFFFF;
					font-size: 32upx;
					text-align: center;
					line-height: 70upx;
					border-radius: 40upx;

					&.back {
						background: #ccc;
					}
				}
			}
		}
	}
</style>
