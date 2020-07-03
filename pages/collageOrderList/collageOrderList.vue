<template>
	<view class="collageOrderList">
		<yu-kefu position="3"></yu-kefu>
		<view class="wucTabBox1">
			<uni-nav-bar :status-bar="true" background-color="#FFFFFF" color="#000000" left-icon="arrowleft" title="我的拼团" shadow='false'
			 fixed="true" @click-left="back" />
		</view>
		 <view class="wucTabBox2">
			<wuc-tab :tab-list="tabList3" textFlex :tabCur.sync="TabCur3" tab-class="text-center text-black bg-white"
			 select-class="text-orange" @change="change"></wuc-tab>
		 </view>
		<!-- 全部 -->
		<view class="list-wrap">
			<view class="item" v-for="(item,index) in goodList" :key="index">
				<view class="header">
					<view class="header-left" v-show="param.type !== '2'">
						
					<!-- 	<text v-if="item.status==='拼中'" style="color: #00DD34;">拼中</text>
						<text v-else-if="item.status==='拼不中'" style="color: #DD0000;">拼不中</text>
						<text v-else>{{item.status}}</text> -->
						<text :style="{color: item.status === '进行中'?'#333':item.status === '拼不中'?'#DD0000':'#00DD34'}">{{item.status}}</text>

					</view>
						<view class="header-right">
							{{item.groupCount || 0}} 人团
						</view>
				</view>
				<view class="item-list_box" >
					<view class="item-list">
						<view class="left">
							<image :src="item.cover" mode=""></image>
						</view>
						<view class="right">
							<view class="right-header">
								{{item.title}}
								<view class="right-body">我的拼团凭证：{{item.voucher}}
								<view class="">{{item.joinTime}}</view>
								
								</view>
							</view>
							<view class="right-bottom">
								<text>￥{{item.grouponPrice}}  <text style="margin-left: 20upx;font-size: 20upx; text-decoration:line-through;color: #CCCCCC;">￥{{item.initPrice}}</text></text>
							</view>
						</view>
					</view>
				</view>

				<view class="item-submit">
					<view class="left" @tap="goCollage(item)"> 
						拼团详情
					</view>
					<view class="right" @tap="goOrder(item)" >
						订单详情
					</view>
				</view>
			</view>


		</view>
		<view class="notThing" v-if="goodList.length===0">
			<image src="../../static/images/feedback/Artwork.png" mode="aspectFill"></image>
		</view>

	</view>
</template>

<script>
	import uniNavBar from '../../components/uni-nav-bar/uni-nav-bar.vue'
	import WucTab from '../../components/wuc-tab/wuc-tab.vue';
	
	// 客服组件
	import yuKefu from '@/components/yu-kefu/yu-kefu.vue'
	export default {
		components: {
			WucTab,
			uniNavBar,
			yuKefu
		},
		data() {
			return {
				tabList3: [{
						name: '全部'
					}, {
						name: '进行中'
					},
					{
						name: '成功'
					}, {
						name: '失败'
					},
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
					type: -1
				}
			}
		},

		onLoad(option) {
			// if (Number(option.navIndex) < 5) {
			// 	console.log('页面加载有', option)
			// 	this.navIndex = Number(option.navIndex)
			// } else {
			// 	console.log('页面加载没有', option)
			// 	this.navIndex = 0 
			// }
			this.navIndex = 0 

		},
		onShow() {
			this.goodList = []
			this.param.pageNum = 1
			this.TabCur3 = Number(this.navIndex)
			switch (this.navIndex) {
				case 0:
					this.param.type = -1;
					this.getOrder()
					break;
				case 1:
					this.param.type = "0";
					this.getOrder()
					break;
				case 2:
					this.param.type = "1";
					this.getOrder()
					break;
				case 3:
					this.param.type = "2";
					this.getOrder()
					break;
				case 4:
					this.param.type = "3";
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
			goCollage(item){
				console.log("211221")
				uni.navigateTo({
					url:'../groupAchieve/groupAchieve?orderId='+item.orderId	
				})
			},
			goOrder(item){
				console.log(item)
				uni.navigateTo({
					url:'../orderDetails/orderDetails?id='+item.orderId	
				})
			},
			// 订单列表查询
			getOrder() {
				this.goodList = []
				console.log(this.param)
				this.$common.httpGet('common-goods/upMall/userGroupon/orderList?pageNum=' + this.param.pageNum + '&pageSize=' + this.param.pageSize +
					'&type=' + this.param.type).then((res) => {
					if (Number(res.data.code) === 200200) {
						
						this.goodList = res.data.data.list
						console.log(this.goodList)
						// 清除定时器
						clearInterval(this._inter)
					} else {
						this.goodList = []
						clearInterval(this._inter)
					}
				})
			},
			// 跳转订单详情
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
			// 点击去付款
			pay(item) {
				uni.navigateTo({
					url: `../orderDetails/orderDetails?id=${item.orderId}`,

				})
			},
			// 点击查看物流
			goLogistics(item) {
				uni.navigateTo({
					url: `../logistics/logistics?id=${item.orderId}`,
				})
			},
			// 上拉加载更多
			loadData() {
				if (this.isRefresh) {
					this.param.pageNum = this.param.pageNum + 1
					this.$common.httpGet('common-goods/upMall/userGroupon/orderList?pageNum=' + this.param.pageNum + '&pageSize=' + this.param.pageSize +
						'&type=' + this.param.type).then((res) => {
						let data = res.data.data.list ? res.data.data.list : []
						if (data.length > 0) {
							this.loadingType = 'loading'
							this.goodList = this.goodList.concat(data)
						} else {
							this.loadingType = 'nomore'
							this.isRefresh = false
							uni.showToast({
								title: '没有更多了',
								duration: 1500,
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
						this.param.type = -1;
						this.getOrder()
						break;
					case 1:
						this.param.type = "0";
						this.getOrder()
						break;
					case 2:
						this.param.type = "1";
						this.getOrder()
						break;
					case 3:
						this.param.type = "2";
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
			back() {
				uni.reLaunch({
					url: '../profile/profile'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F2F2F2 !important;
	}
	.collageOrderList {
		touch-action: default;
		background: #F2F2F2;
		position: relative;
		padding-top: 90upx;

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
				min-height: 400upx;
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
					line-height: 100upx;
		
					// border-bottom: 1px solid #ccc;
					.header-left {
						>text {
							font-weight: 600;
						}
					}
		
					.header-right {
						color: #4A90E2;
						margin-left: auto;
					}
				}
		
				.item-list {
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
		
					view{
						background:rgba(255,68,68,1);
						border-radius: 20px;
						width: 140upx;
						border: 1px solid #ffff;
						text-align: center;
						line-height: 48upx;
						height: 48upx;
						font-size: 24upx;
						font-family: PingFang-SC-Medium;
						font-weight: 500;
						color: #ffff;
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
