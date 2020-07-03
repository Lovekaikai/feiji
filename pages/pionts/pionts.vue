<template>
	<view class="balance">
		<yu-kefu position="3"></yu-kefu>
		<view class="header">
			<view class="header-box">
				<view class="left">
					<image :src="userInfo.avatar" mode=""></image>
				</view>
				<view class="right">
					<view class="top">{{userInfo.nickName}}</view>
					
					<!-- 0 新人，1 铜牌，2 银牌，3金牌，4，事业伙伴，5经销商，6官方代理 -->
					<view class="center">当前头衔：{{userInfo.userLevel | capitalize}}</view>
				</view>
			</view>
			<view class="pay" @tap="topay">
				立即提现
			</view>

			<view class="current">
				<view class="text">当前积分</view>
				
				<!-- <view class="number">{{userPiont.integral|| "0"}}</view> -->
				 <countup :num="userPiont.integral|| '0'" color="#fddca5" :width='32' :height='46' :fontSize='50'></countup>
			</view>
		</view>
		<view class="nav">
			<view class="item">
				<view class="text">当前可用积分</view>
				<view class="number">{{userPiont.usableIntegral|| "0"}}</view>
			</view>
			<view class="item">
				<view class="text">冻结积分</view>
				<view class="number">{{userPiont.freezeIntegral|| "0"}}</view>
			</view>
		</view>

		<view class="header-nav">积分明细</view>
		<view class="list" v-for="(item,index) in listData" v-if="listData.length>0" :key="index">
			<view class="list-left">
				<view class="top">{{item.description}}</view>
				<view class="bottom">{{item.createTime}}</view>
			</view>
			<view class="list-right">{{item.point}}</view>
		</view>
	</view>
</template>

<script>
	import yuKefu from '@/components/yu-kefu/yu-kefu.vue'
	export default {
		components: {
			yuKefu
		},
		data() {
			return {
				title: 'Hello',
				//用户积分
				userPiont: {
					"usableIntegral": 0,
					"integral": 0,
					"freezeIntegral": 0
				},
				userInfo: {},
				pageSize: 10,
				pageNum: 1,
				total: 0, // 列表总共有多少条
				//列表数据
				listData: []

			}
		},
		filters: {
		  capitalize (value) {
			let arr=[0,1,2,3,4,5,6]
			let arrName=['新人','铜牌','银牌','金牌','事业伙伴','经销商','官方代理']
		    // value = value.toString()
			let index = arr.findIndex((val, index)=>{
				return val === value
			})
		    return arrName[index]
		  }
		},
		onShow() {
			console.log('提现')
			this.getBalanceList()
			this.getUserBalance()
			this.userInfo = uni.getStorageSync("userInfo")
		},
		onReachBottom() {
			if(this.total > this.listData.length) {
				this.getBalanceListMore()
			}
		},
		methods: {
			getUserBalance() {
				this.$common.httpGet("upmall-point/point/details").then((res) => {
					// console.log(res)
					if (res.data.code === 400200) {
						this.userPiont = res.data.data
						// console.log("212121",this.userPiont)
					} else {
						uni.showToast({
							title: res.data.message
						})
					}
				})
			},
			getBalanceListMore() {
				this.pageNum++
				this.$common.httpGet("upmall-point/point/list?pageNum=" + this.pageNum + "&pageSize=" + this.pageSize).then((res) => {
					// console.log(res)
					if (res.data.code === 400200) {
						if (res.data.data.rows.length > 0) {
							for (let s of res.data.data.rows) {
								this.listData.push(s)
							}
						}
					} else {
						uni.showToast({
							title: res.data.message
						})
					}
				})
			},
			getBalanceList() {
				this.$common.httpGet("upmall-point/point/list?pageNum=" + this.pageNum + "&pageSize=" + this.pageSize).then((res) => {
					// console.log(res)
					if (res.data.code === 400200) {
						this.total = res.data.data.total
						this.listData = res.data.data.rows
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.message
						})
					}
				})
			},
			// 提现积分转化为钱
			topay() {
				let num = 50
				if (this.userInfo.userLevel === 5) {
					num = 70
				} else if (this.userInfo.userLevel === 6) {
					num = 100
				}
				if (this.userPiont.usableIntegral === 0) {
					uni.showToast({
						icon: 'none',
						title: '当前可提现的积分为0'
					})
					return false
				}
				uni.showModal({
					content: '当前提取积分只能将'+ num + '%积分变成余额，是否立即提取？',
					success: (res) => {
						if (res.confirm) {
							let interal = this.userPiont.usableIntegral || 0
							this.$common.httpGet("upmall-point/point/withdraw?integral=" + interal).then((res) => {
								if (res.data.code === 400200) {
									uni.showToast({
										title: "提取成功"
									})
									this.getUserBalance()
									this.pageNum=1
									this.getBalanceList()
								} else {
									uni.showToast({
										icon: 'none',
										title: res.data.message
									})
								}
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
<style lang="less">
	.balance {
		width: 100vw;
		overflow-x: hidden;
	}
	.pay {
		width: 158rpx;
		height: 60rpx;
		background: rgba(253, 220, 165, 0.2);

		border-radius: 30px;
		border-radius: 30rpx;
		position: absolute;
		bottom: 50upx;
		right: -20upx;
		font-size: 26rpx;
		line-height: 60rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FDDCA5;
		text-align: center;
	}

	.header {
		position: relative;
		color: #AA9572;
		width: calc(100vw - 60upx);
		height: 360rpx;
		background: rgba(29, 28, 28, 1);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 30upx 30upx 0;

		.header-box {
			display: flex;
		}

		.left {
			margin-right: 30upx;
			width: 80rpx;
			height: 80rpx;
			background: red;
			border-radius: 50%;

			image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}

		.right {
			flex: 1;

			.top {
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: rgba(255, 236, 176, 1);
				line-height: 48rpx;
			}

			.center {

				font-size: 20rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(170, 149, 114, 1);
				// line-height:48rpx;
			}


		}

		.current {
			color: #AA9572;
			height: 200upx;
			// background: yellow;
			text-align: center;

			.text {

				font-size: 20rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(170, 149, 114, 1);
				margin-bottom: 20upx;
			}

			.number {
				font-size: 50rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: rgba(253, 220, 165, 1);
			}
		}
	}

	//积分头部

	.header-nav {
		text-align: center;
		height: 58px;
		font-size: 30px;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(29, 28, 28, 1);
		line-height: 58px;
		background: rgb(248, 246, 249);
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(29, 28, 28, 1);
	}

	//导航
	.nav {
		border-top: 1px solid #44423e;

		width: 750rpx;
		height: 126rpx;
		background: rgba(29, 28, 28, 1);
		// opacity:0.05;
		display: flex;
		flex: 1;

		.item {
			display: flex;
			// background: red;
			flex: 1;
			color: #AA9572;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.number {
				color: #FDDCA5;
			}

			.text {
				font-size: 20rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(170, 149, 114, 1);
			}
		}

		.item:last-child {
			border-left: 1px solid #44423e;
		}

	}

	.list {
		display: flex;
		justify-content: space-between;
		padding: 20upx 30upx;
		align-items: center;

		// background: red;
		.top {
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(29, 28, 28, 1);
		}

		.bottom {
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(128, 124, 124, 1);
		}

		.list-right {
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: rgba(229, 67, 79, 1);
		}
	}
</style>
