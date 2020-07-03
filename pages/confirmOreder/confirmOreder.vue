<template>
	<view class="confirmOreder">
		<view class="content">
			<view class="adress" @tap="goAddress()">
				<view class="adress_icon">
					<view class="left_icon">
						<text class="iconfont icon-iclocationonpx"></text>
						<view class="default" v-if="Number(address.isDefault) === 1">默认</view>
					</view>
				</view>
				<view class="adress_text">
					<view class="user_receive">
						<text>收货人：{{ address.name || '请填写收货人' }}</text>
						<text>{{ address.tel || '' }}</text>
					</view>
					<view class="user_adress">
						<text>收货地址：{{ address.fullSite || '请选择收货地址' }}{{ address.addressDetail || '' }}</text>
					</view>
				</view>
				<view class="icon"><text class="iconfont icon-xiangyou1"></text></view>
				<image src="../../static/images/orderSettlement/header_logo.png" mode=""></image>
			</view>
			<!-- 		<view class="header">
				<view class="steps"><uni-steps :options="[{ title: '买家付款' }, { title: '商家发货' }, { title: '买家收货' }, { title: '交易完成' }]" :active="0"></uni-steps></view>
			</view> -->
			<view class="item">
				<view class="item-list_box">
					<view class="item-list_header">
						<view class="shopIcon">
							<image src="../../static/images/shop.png" mode=""></image>
						</view>
						<view class="shopName">UP商城</view>
						<uni-icons type="arrowright" size="18"></uni-icons>
					</view>
					<view class="item-list">
						<view class="item-box">
							<view class="left">
								<image :src="goodInfo.image" mode=""></image>
							</view>
							<view class="right">
								<text class="right-header">
									{{ goodInfo.goodsName }}
									<text style="color:red; margin-left:10px;"></text>
								</text>
								<view class="right-bottom">
									<text>￥{{ goodInfo.price }}</text>
									<text>x{{ goodInfo.productCount }}</text>
								</view>
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
					<text class="item-statistics-title">商品合计</text>
					<!-- <text class="item-statistics-money">￥{{Number(goodInfo.productPrice) * Number(goodInfo.productCount)}}</text> -->
					<text class="item-statistics-money">￥{{ sum }}</text>
				</view>
				<!-- 			<view class="item-statistics-Box">
					<text class="item-statistics-title">运费</text>
					<text class="item-statistics-money">￥{{ Number(goodInfo.freightPrice).toFixed(1) }}</text>
				</view>
				<view class="total-Box">
					<text class="total-Box-sum">合计：</text>
					<text class="total-Box-num">￥{{ sum }}</text>
				</view> -->
			</view>
			<!-- 支付方式 -->
			<view class="item-statistics">
				<view class="item-statistics-Box">
					<text class="item-statistics-title">支付方式</text>
				</view>
				<view class="payBox">
					<view class="payselect" @tap="payWay(2)" :class="[currency===2?'pick':'']">
						<view>
							<uni-icons type="weixin" size="30" color="#3AD04F"></uni-icons>
							<text class="payselect-title" style="margin-left: 10upx;">微信支付</text>
						</view>
					</view>
					<view class="payselect" @tap="payWay(3)" :class="[currency===3?'pick':'']">
						<text class="payselect-title">余额支付</text>
						<!-- <uni-icons type="weixin" size="30" color="#3AD04F"></uni-icons> -->
						<text class="residue">（当前余额 ¥{{balance}}）</text>
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="footer-left">
				<view class="footer-left-sum">合计：</view>
				<view class="footer-left-num">￥{{ sum }}</view>
			</view>
			<view class="footer-right back" v-if="clickTime === 1">提交订单</view>
			<view class="footer-right" v-if="clickTime === 0" @tap="goPlaceorder()">提交订单</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from '../../components/uni-icon/uni-icon.vue';
	export default {
		components: {
			uniIcons
		},
		data() {
			return {
				active: '', // 步骤条
				goodInfo: {},
				currency: 2, // 支付方式
				clickTime: 0,
				timeId: '',
				sum: 0, //
				address: {},
				balance: 0, // 用户可用余额
				residueActor: 0,
			}; 
		},
		onShow() {
			this.address = this.$common.getStorage('address')

		},
		onLoad(e) {
			//option为object类型，会序列化上个页面传递的参数
			this.goodInfo = this.$common.getStorage('pintuanInfo')
			let sum1 = Number(this.goodInfo.price) * Number(this.goodInfo.productCount) + Number(this.goodInfo.freight);
			this.sum = sum1.toFixed(2);
			this.getDefault()
			this.getBalance()
			if (Number(this.goodInfo.joinGroupId) !== 0) {
				this.getResidueActor()
			} else{
				this.residueActor=this.goodInfo.groupCount
			}
		},
		onUnload() {

		},
		methods: {
			// 获取可用余额
			getBalance() {
				this.$common.httpGet('upmall-point/balance/details').then(res => {
					if (Number(res.data.code) === 400200) {
						// console.log(res)
						this.balance = res.data.data.usableBalance
					}
				})
			},
			// 获取团队剩余位
			getResidueActor() {
				this.$common.httpGet('common-goods/upMall/groupon/residueActor?grouponId=' + this.goodInfo.joinGroupId).then(res => {
					console.log(res)
					if (Number(res.data.code) === 200200) {
						// console.log(res)
						this.residueActor = res.data.data
					}
				})
			},
			//支付方法
			getPlayway(openid,conut,sum) {

				let parmas = {
					shareId: this.goodInfo.shareId,
					openid: openid,
					cartId: 0,
					freight: this.goodInfo.freight,
					productId: this.goodInfo.productId,
					productCount: conut,
					addressId: Number(this.address.id),
					payWay: this.currency,
					totalAmount: sum,
					grouponActivityId: this.goodInfo.grouponActivityId,
					joinGroupId: this.goodInfo.joinGroupId
				}
				// 判断微信支付
				if (Number(parmas.payWay) === 2) {
					this.$common.httpPost('order/order/createOrder', parmas).then(res1 => {
						if (Number(res1.data.code) === 300200) {
							let Paydata = res1.data.data;
							// let orderId = res.data.data.orderId;

							uni.requestPayment({
								provider: 'wxpay',
								timeStamp: Paydata.unifiedData.timestamp,
								nonceStr: Paydata.unifiedData.noncestr,
								package: 'prepay_id=' + Paydata.unifiedData.prepayid,
								signType: Paydata.unifiedData.signType,
								paySign: Paydata.unifiedData.sign,
								success: res => {
									this.$common.showToast1('支付成功', 'success');
									let that = this
									uni.requestSubscribeMessage({
										tmplIds: ['m38RGiDBNVl0BMz_I-fkm0ovAxB_2VFljssGxsCSMG8',
											'vy8Vx0T3m8HfYivwa48DU7uoKR5o7nyEwua9JZUzSPo', 'qJB77iqR6URfon__3FqWqi0BtGkJ38lmas3FOeE9rgk'
										],
										success: () => {
											console.log(res)
											that.$common.httpGet("common-goods/upMall/userGroupon/orderCheck/" + Paydata.orderId).then((
												data1) => {
												console.log("data1", data1)
												if (data1.data.data) {
													uni.navigateTo({
														url: '../groupAchieve/groupAchieve?orderId=' + Paydata.orderId
													});
												} else {
													uni.navigateTo({
														url: '../MeOrder/MeOrder?navIndex=2'
													});
												}
											})
										}

									})
								},
								fail: res => {
									this.$common.showToast1('支付失败', 'none');
									// console.log('fail:' + JSON.stringify(err));
									uni.redirectTo({
										url: '../collageOrderList/collageOrderList'
									});
								}
							});
						} else {
							uni.showToast({
								title: res1.data.message,
								duration: 3000,
								icon: 'none'
							});
						}
					});
					// 判断余额支付
				} else {

					if (this.balance < this.sum) {
						this.$common.showToast1('当前可用余额不足！', 'none');
						return false
					}
					this.$common.httpPost('order/order/createOrder', parmas).then(res => {
						console.log("余额支付", res)
						if (Number(res.data.code) === 300200) {
							this.$common.showToast1('支付成功', 'success');

							console.log("开个", res)
							let that = this
							uni.requestSubscribeMessage({
								tmplIds: ['m38RGiDBNVl0BMz_I-fkm0ovAxB_2VFljssGxsCSMG8',
									'vy8Vx0T3m8HfYivwa48DU7uoKR5o7nyEwua9JZUzSPo', 'qJB77iqR6URfon__3FqWqi0BtGkJ38lmas3FOeE9rgk'
								],
								success: () => {
									that.$common.httpGet("common-goods/upMall/userGroupon/orderCheck/" + res.data.data.orderId).then((data1) => {
										console.log("data1", data1)
										if (data1.data.data) {
											uni.navigateTo({
												url: '../groupAchieve/groupAchieve?orderId=' + res.data.data.orderId
											});
										} else {
											uni.navigateTo({
												url: '../MeOrder/MeOrder?navIndex=2'
											});
										}
									})
								}

							})

							// let Paydata = res.data.data;

						} else {
							this.$common.showToast1(res.data.message);
							// console.log('fail:' + JSON.stringify(err));
							uni.redirectTo({
								url: '../collageOrderList/collageOrderList'
							});
						}
					});
				}

			},
			// 点击下单
			goPlaceorder() {
				// console.log(this.goodInfo);
				clearTimeout(this.timeId);
				let openid = this.$common.getStorage('userInfo').weixinOpenid;

				if (this.address.id) {
					// 按钮置灰
					this.clickTime = 1;
					if (openid) {
						this.timeId = setTimeout(() => {
							this.clickTime = 0;
						}, 2000);
						if (Number(this.goodInfo.productCount) > Number(this.residueActor)) {
							console.log('超过')
							uni.showModal({
								title: '提示',
								content: '已超过购买份额，是否购买最大份额',
								success: (res)=>{
									if (res.confirm) {
										// console.log('用户点击确定');
										let sum2 = Number(this.goodInfo.price) * Number(this.residueActor) + Number(this.goodInfo.freight);
										this.sum = sum2.toFixed(2);
										this.getPlayway(openid,this.residueActor,this.sum )
									} else if (res.cancel) {
										// console.log('用户点击取消');
									}
								}
							});
						} else {
							console.log('不超过')
							this.getPlayway(openid,this.goodInfo.productCount,this.sum)
						}
					}
				} else {
					uni.showToast({
						title: '请选择地址',
						duration: 3000,
						icon: 'none'
					});
				}
			},
			// 检查用户是否有默认地址
			getDefault() {
				this.$common.httpGet('user/userAddress/getDefault').then(res => {
					// console.log(res);
					if (Number(res.data.code) === 100200) {
						// this.packageList = res.data.data;
						if (res.data.data) {
							this.address = res.data.data;
							this.$common.setStorage('address', this.address);
						} else {
							this.address = this.$common.getStorage('address') || {};
						}
					} else {
						this.address = this.$common.getStorage('address') || {};
					}
				});
			},
			// 选择支付方式
			payWay(e) {
				this.currency = Number(e)
			},
			// 跳转地址选择页面
			goAddress() {
				uni.navigateTo({
					url: '../addressManage/addressManage'
				});
			}
		}
	};
</script>

<style lang="less">
	.confirmOreder {
		background-color: #f8f6f9;
		position: relative;
		// width: 99.9vw;
		.content {
			height: calc(100vh - 90upx);
			overflow-y: auto;
			overflow-x: hidden;
		}
		.header {
			padding: 20upx 0;
		}

		.adress {
			margin-bottom: 40upx;
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

		.item {
			.item-list_box {
				margin-bottom: 20upx;

				.item-list_header {
					height: 90upx;
					width: 100%;
					font-family: PingFang-SC-Medium;
					display: flex;
					background-color: #ffffff;
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
					background-color: #ffffff;

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
					background-color: #f8f6f9;

					.item-box {
						display: flex;

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
							display: flex;
							flex-direction: column;
							justify-content: space-between;
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
								font-weight: 600;
								color: #4a90e2;
								// margin-top: 48upx;

								text:last-child {
									color: #000;
								}
							}
						}
					}
				}
			}
		}

		.item-statistics {
			margin-top: 20upx;
			background-color: #ffffff;
			padding: 0 36upx;

			.payBox {
				margin: 10upx 10upx;
				border-top: 1px solid #F4F4F4;
				padding: 30upx 50upx 30upx 50upx;
				display: flex;
				justify-content: space-between;

				// align-items: center;
				.payselect {
					border: 1px solid #E6E6E6;
					border-radius: 15upx;
					padding: 20upx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					.payselect-title {
						font-size: 28upx;
						font-weight: 600;
					}

					.residue {
						font-size: 26upx;
						color: #808080;
					}
				}

				.pick {
					position: relative;
					overflow: hidden;
					border: 1px solid #4390df;

					&::before {
						position: absolute;
						display: block;
						border-bottom: 28px solid #4390df;
						border-left: 28px solid transparent;
						right: 0;
						bottom: 0;
						content: "";
						z-index: 101;
					}

					&::after {
						position: absolute;
						display: block;
						content: "√";
						bottom: 0;
						right: 2upx;
						font-family: Source Han Sans CN;
						font-size: 14px;
						font-weight: normal;
						z-index: 102;
						color: #fff;
					}
				}
			}

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

		.footer {
			position: fixed;
			width: 100%;
			bottom: 0;
			height: 90upx;
			background-color: #ffffff;
			display: flex;
			justify-content: flex-end;
			align-items: center;

			.footer-left {
				display: flex;

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
				margin: 0 30upx;
				height: 70upx;
				width: 240upx;
				background-color: #06B720;
				color: #ffffff;
				font-size: 30upx;
				text-align: center;
				line-height: 70upx;
				border-radius: 40upx;

				&.back {
					background: #ccc;
				}
			}
		}
	}
</style>
