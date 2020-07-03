<template>
	<view class="cash">
		<view class="header">
			<view class="header-box">
				<view class="left">
					<image :src="userInfo.avatar" mode=""></image>
				</view>
				<view class="right">
					<view class="top">{{userInfo.nickName}}</view>
					<view class="center">当前头衔：{{userInfo.userLevel | capitalize}}</view>
				</view>
			</view>
			<view class="current">
				<view class="text">当前可提现余额</view>
				<view class="number">{{balance|| "0.00"}}</view>
			</view>
		</view>
		<view class="header-nav">
			<image src="../../static/wechat.png" mode="widthFix"></image>
			微信提现
		</view>
		<view class="navBox">
			<view class="item" @click="topay(100)">
				提现<text>100元</text>
			</view>
			<view class="item" @click="topay(200)">
				提现<text>200元</text>
			</view>
			<view class="item" @click="topay(500)">
				提现<text>500元</text>
			</view>
			<view class="item" @click="topay(800)">
				提现<text>800元</text>
			</view>
			<view class="item" @click="topay(1000)">
				提现<text>1000元</text>
			</view>
		</view>
		
		<view class="tips" v-if="isShow">注: 代理商级别提现收取10%手续费</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// arr:[100,200,500,800,1000],
				title: 'Hello',
				userInfo: {
					userImg: '',
					userName: '秃头小宝贝',
					userID: '金牌会员'
				},
				balance:0,
				isShow: false  //是否显示提示
			}
		},
		filters: {
		  capitalize (value) {
			let arr=[0,1,2,3,4,5,6]
			let arrName=['新人','铜牌','银牌','金牌','事业伙伴','经销商','官方代理']
		    // value = value.toString()
			let index=arr.findIndex((val, index)=>{
				return val === value
			})
		    return arrName[index]
		  }
		},
		onLoad(option) {
			this.balance=option.balance
			this.userInfo = uni.getStorageSync("userInfo")
			console.log(this.userInfo.userLevel)
			const userLevel = this.userInfo.userLevel
			if(userLevel > 3 && userLevel <= 6) {
				this.isShow = true
			}
		},
		methods: {
			// 
			// 提现操作
			topay(num) {
				if (num > this.balance) {
					uni.showToast({
						icon: 'none',
						title: '要提现的金额大于可提现的余额'
					})
					return
				}
				uni.showModal({
					content: `确定要提取${num}元？`,
					success: (res) => {
						// let balance = this.userPiont.balance || 0
						if (res.confirm) {
							this.$common.httpGet("upmall-point/balance/withdraw?balance=" + num).then((res) => {
								if (res.data.code === 400200) {
									uni.showToast({
										icon: 'success',
										title: '提取成功'
									})
									
									this.getUserBalance()
								} else {
									uni.showToast({
										icon: 'none',
										title: res.data.message
									})
								}
							})
						}
						
					}
				})
			},
			
			// 用户余额详情
			getUserBalance() {
				this.$common.httpGet("upmall-point/balance/details").then((res) => {
					console.log(res)
					if (res.data.code === 400200) {
						this.balance = res.data.data.balance
					} else {
						uni.showToast({
							title: res.data.message
						})
					}
				})
			}
		}
	}
</script>
<style lang="less" scoped>
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
		height: 350rpx;
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
		// text-align: center;
		height: 58px;
		font-size: 30px;
		padding-left: 30px;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(29, 28, 28, 1);
		line-height: 58px;
		background: rgb(248, 246, 249);
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(29, 28, 28, 1);

		image {
			width: 45upx;
			height: 45upx;
			vertical-align: middle;
			margin-right: 10px;
		}
	}

	.navBox {
		display: flex;
		flex-wrap: wrap;

		.item {
			width: 216rpx;
			height: 134rpx;
			background: rgba(255, 255, 255, 1);
			border: 1px solid rgba(235, 235, 235, 1);
			border-radius: 8rpx;
			text-align: center;
			line-height: 134rpx;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: rgba(29, 28, 28, 1);
			margin: 20upx 15upx;

			text {
				color: #E72D2D;
			}
		}
	}
	.tips {
		font-size: 20upx;
		color:#E72D2D;
		letter-spacing: 1px;
		padding-left: 20upx;
		margin-top: 80upx;
	}
</style>
