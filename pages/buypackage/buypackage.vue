<template>
	<view class="buypackage">
		<view class="top">
<!-- 			<navigator url="../../pages/index/index" class="homeIcon-wrap">
				<view class="homeIcon">
					<uni-icon type="arrowleft" size="20" color="#fff"></uni-icon>
					<view>首页</view>
				</view>
			</navigator> -->
			<view class="grade"><image class="star" src="../../static/images/levelup.png" mode=""></image></view>
			<view class="content">
				<view class="txt one">购买套餐升级为代理商</view>
				<view class="txt">获取更多福利</view>
				<view class="cro_left_bottom"></view>
				<view class="cro_right_bottom"></view>
			
			</view>
			<view class="bottom">
				<view class="cro_left_top"></view>
				<view class="cro_right_top"></view>
			</view>
		</view>
		
		<!-- 代理商权益 -->
		<view class="group-rule">
			<view class="group-rule-right" @tap='goGroupRules'>
				<view class="iconImg">
					<image src="../../static/images/groupRule.png" mode=""></image>
				</view>
				<view class="title">代理商权益</view>
			</view>
		</view>
		
		<!-- 快洁安消毒水 -->
		<view class="goods">
			<view class="items" v-for="(item,index) in packageList" :key="index">
				<view class="good_img"><image :src="item.image"></image></view>
				<view class="good_desc">
					<view class="good_name">{{ item.goodsName }}</view>
					<view class="good_size">{{ item.introduce }}</view>
					<view class="good_price_wrap">
						<view class="good_price">
							￥
							<text>{{ item.price }}</text>
						</view>
						<view class="good_btn" @tap="handleBuy(index)"><text>购买</text></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			packageList: []
		};
	},
	onLoad(e) {
		this.getpackagelist(); // 调用方法
	},
	methods: {
		//定制套餐
		getpackagelist() {
			this.$common.httpGet('common-goods/upMall/userPrice/customized/' + 0).then(res => {
				console.log(res);
				if (Number(res.data.code) === 200200) {
					this.packageList = res.data.data;
				} else {
					this.$common.showToast(res.data.desc, 'none');
				}
			});
		},
		// 点击购买
		handleBuy(index) {
			console.log(index)
			// this.$common.passUserauth().then((res) => {
				// if (res) {
					// console.log(res)
					const item = this.packageList[index];
					let goodlist = [{
						image: item.image,  //商品图片
						goodsName: item.goodsName,  //商品名称
						price: item.price,  //  商品单价
						productId: item.skuId,  // 商品sku
						count: 1,//数量
					}]
					let goodInfo = {
						freightPrice : 0,  // 运费
						totalAmount:item.price, //总价
						share: '', //分享码
						pagesInfo: 2,   // 页面识别
						comboLevel: item.comboLevel,   //套餐标识
						goodlist: goodlist
					}
					uni.setStorageSync('goodInfo',goodInfo)
					uni.navigateTo({
						url: '../orderSettlement/orderSettlement'
					})
			// 	} else {
			// 		uni.navigateTo({
			// 			url: `../auth/auth`
			// 		})
			// 	}
			
			// })
		},
		goGroupRules() {
			uni.navigateTo({
				url: '../equity/equity'
			})
		}
	}
};
</script>

<style lang="less" scoped>
.buypackage {
	.top {
		width: 750rpx;
		height: 404rpx;
		background: rgba(29, 28, 28, 1);
		position: relative;
		.grade {
			width: 160rpx;
			height: 160rpx;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0rpx 0rpx 8rpx 0rpx rgba(253, 220, 165, 1);
			border-radius: 50%;
			position: absolute;
			top: 51rpx;
			left: 50%;
			// margin-left: -80rpx;
			transform: translateX(-50%);
			.star {
				position: absolute;
				top: 29rpx;
				left: 10rpx;
				width: 140rpx;
				height: 87rpx;
				z-index: 999;
			}
		}
		.content {
			width: 686rpx;
			height: 257rpx;
			background: rgba(255, 255, 255, 1);
			border-radius: 10rpx;
			border-bottom: 2rpx solid rgba(78, 78, 79, 1);
			position: absolute;
			top: 128rpx;
			left: 50%;
			// margin-left: -343rpx;
			transform: translateX(-50%);
			.one {
				padding-top: 100rpx;
			}
			.txt {
				margin: 10rpx 0;
				text-align: center;
				font-size: 32rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: rgba(29, 28, 28, 1);
			}
		}
		.bottom {
			width: 686rpx;
			height: 19rpx;
			background: rgba(255, 255, 255, 1);
			// border-radius:10rpx;
			position: absolute;
			bottom: 0rpx;
			left: 50%;
			margin-left: -343rpx;
		}
		.homeIcon-wrap {
			position: absolute;
			top: 20upx;
			left: 10upx;
			font-size: 24upx;
			z-index: 2;
			.homeIcon {
				display: flex;
				align-items: center;
				color: #fff;
			}
		}
		.cro_left_top,
		.cro_right_top,
		.cro_left_bottom,
		.cro_right_bottom {
			position: absolute;
			width: 10rpx;
			height: 10rpx;

			z-index: 1;
			background: rgba(29, 28, 28, 1);
		}
		.cro_left_top {
			top: -1rpx;
			left: -1rpx;
			border-radius: 0 0 10rpx 0;
			border-bottom: 1rpx solid rgba(255, 255, 255, 1);
			border-right: 1rpx solid rgba(255, 255, 255, 1);
		}

		.cro_right_top {
			top: -1rpx;
			right: -1rpx;
			border-radius: 0 0 0 10rpx;
			border-bottom: 1rpx solid rgba(255, 255, 255, 1);
			border-left: 1rpx solid rgba(255, 255, 255, 1);
		}

		.cro_left_bottom {
			left: -1rpx;
			bottom: -1rpx;
			border-radius: 0 10rpx 0 0;
			border-top: 1rpx solid rgba(255, 255, 255, 1);
			border-right: 1rpx solid rgba(255, 255, 255, 1);
		}

		.cro_right_bottom {
			right: -1rpx;
			bottom: -1rpx;
			border-radius: 10rpx 0 0 0;
			border-top: 1rpx solid rgba(255, 255, 255, 1);
			border-left: 1rpx solid rgba(255, 255, 255, 1);
		}
	}
	.goods {
		width: 686rpx;
		min-height: 800rpx;
		margin: 0 auto;
		background: rgba(255, 255, 255, 1);
		.items {
			min-height: 300rpx;
			display: flex;
			padding: 28rpx 0 28rpx 10rpx;
			.good_img {
				// background: rgba(255, 255, 255, 1);
				image {
					width: 244rpx;
					height: 244rpx;
					display: block;
				}
			}
			.good_desc {
				flex: 1;
				margin-left: 31rpx;
				padding: 20rpx 0;
				.good_name {
					width: 400rpx;
					min-height: 26rpx;
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(29, 28, 28, 1);
					line-height: 48rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				.good_size {
					width: 400rpx;
					margin-top: 10rpx;
					min-height: 25rpx;
					font-size: 26rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(128, 124, 124, 1);
					line-height: 48rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				.good_price_wrap {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 60rpx;
					.good_price {
						width: 119rpx;
						height: 48rpx;
						line-height: 48rpx;
						font-family: PingFang SC;
						font-weight: bold;
						color: rgba(29, 28, 28, 1);
						line-height: 48rpx;
					}
					.good_btn {
						width: 89rpx;
						height: 48rpx;
						line-height: 48rpx;
						background: rgba(255, 255, 255, 1);
						border: 1rpx solid rgba(29, 28, 28, 1);
						border-radius: 4rpx;
						text-align: center;
						text {
							width: 50rpx;
							font-size: 26rpx;
							font-family: PingFang SC;
							font-weight: 500;
							color: rgba(29, 28, 28, 1);
						}
					}
				}
			}
		}
	}
}
.group-rule {
		padding: 28rpx 32rpx 28rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.group-rule-right {
			display: flex;
			align-items: center;
			.iconImg {
				
				image {
					width: 32rpx;
					height: 32rpx;
				}
			}
			.title {
				margin-left: 10rpx;
				color: #06B720;
				font-size: 24rpx;
				font-weight: 500;
				text-decoration: underline;
			}
		}
	}
</style>
