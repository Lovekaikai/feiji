<template>
	<view class="shareGroup">
		<view v-if="IsSkelttion"><skeleton :SkelttionType="SkelttionType"></skeleton></view>
		<view v-else>
			<view class="item-list">
				<view class="item-box">
					<view class="left"><image :src="goodInfo.cover" mode=""></image></view>
					<view class="right">
						<text class="right-header">
							{{ goodInfo.title }}
							<text style="color:red; margin-left:10px;"></text>
						</text>
						<view class="right-bottom">
							<view class="price">
								<text>￥{{ goodInfo.groupPrice }}</text>
								<text style="text-decoration:line-through">￥{{ goodInfo.initPrice }}</text>
							</view>
							<view class="info">
								<text>{{ goodInfo.groupCount }}人成团</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="stateBox">
				<view class="look" @tap="getLookwho">
					<image src="../../static/images/look.png" mode=""></image>
				</view>
				<view class="timeBox" v-if="state === 0">
					<view class="biao"><image src="../../static/images/time.png" mode="widthFix"></image></view>
					<view class="countdown">
						<text>剩余</text>
						<uni-countdown color="#FFFFFF" background-color="#808080" :show-day="true" :minute="0" :second="residueMsTimes" @timeup="timeup" />
						<text>结束</text>
					</view>
				</view>
				<view class="lose" v-if="state === 2"><image src="../../static/images/biglose.png" mode="widthFix"></image></view>
				<view class="succeed" v-if="state === 1"><image src="../../static/images/succeed.png" mode="widthFix"></image></view>
				<view class="title">
					<text v-if="state === 0">拼团中，还差 {{ residueActor }}人 拼团成功</text>
				</view>
				<view class="Btn" v-if="state === 0" @tap="goPay(state)">我要参团</view>
				<view class="Btn" v-if="residueMsTimes > 0 && residueActor === 0" style="background-color: #808080;" @tap="goPay(state)">来晚了此团已满</view>
				<view class="Btn" v-if="residueMsTimes <= 0" style="background-color: #808080;" @tap="goPay(state)">来晚了此团已结束</view>
				<!--<view class="Btn" v-if="state > 1 && residueActor < 0" style="background-color: #808080;">
					来晚了此团已结束
				</view> -->
				<!-- <view class="tips">
					拼团说明：拼团成功后随机抽取5名获得购买资格
				</view> -->
			</view>
			<view class="hotGoods">
				<view class="topNav"><view class="topBox">最热拼团好物</view></view>
				<spell-good :speGoodList="recommend"></spell-good>
			</view>
			
			<!-- 参团列表  弹窗 -->
			<popup :isPopup="isPopUpJoinList" title="参团列表" @close="isPopUpJoinList=false" class="popup-joinList">
				<template #body>
					<scroll-view scroll-y class="body">
						<view class="header-wrap">
							<view class="leader">
								<image class="leader-avatar" :src="joindetail.groupAvatar"></image>
								<text class="leader-tag">团长</text>
							</view>
							<view class="leader-info">
								<view class="leader-name">团长: <text>{{joindetail.groupNickName}}</text></view>
								<view class="good-desc">团名: <text>{{joindetail.grouponName}}</text></view>
							</view>
						</view>
						<view class="body-wrap">
							<view class="title-wrap">
								<view class="title-item" v-for="(item,index) in ['买家','成交时间','数量']" :key="index">{{item}}</view>
							</view>
							<view class="list-wrap">
								<view class="list-item" v-for="(item2,index2) in joinList" :key="index2">
									<view class="buyer">{{item2.nickName}}</view>
									<view class="time">{{item2.payTime}}</view>
									<view class="num">{{item2.goodsCount}}</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</template>
			</popup>
		</view>
	</view>
</template>

<script>
import spellGood from '../../components/spellGood/spellGood.vue';
import Popup from '../../components/Popup/Popup.vue'
export default {
	components: {
		spellGood,
		Popup
	},
	data() {
		return {
			SkelttionType: 'joinItem', // 骨架屏类型
			IsSkelttion: true,
			goodInfo: {},
			isResult: false,
			state: 1, //状态
			residueActor: 0, //团人数
			orderId: 81, //团ID
			residueMsTimes: 0,
			shareId: 0, // 分享ID
			spu: 0,
			shareInfo: {}, //分享信息
			recommend: [],
			isPopUpJoinList: false, // 控制弹出参团列表弹窗
			joinList: [], //参与拼团列表
			joindetail: {
				'groupNickName': '',
				'groupAvatar': '',
				'grouponName': '',
			}
		};
	},
	onLoad(option) {
		console.log('option', option);
		this.groupId = option.groupId;
		this.shareId = option.shareId;
		const token = uni.getStorageSync('token');
		console.log(token, 'token');

		console.log('this.shareId ', this.shareId + '你妈的' + this.groupId);
		// 有token的情况下 再获取方法
		if (!token) {
			this.$common.loginGetToken(this.shareId).then(res => {
				this.getorderDetail();
				this.getRecommend();
			});
		} else {
			if (this.shareId) {
				this.$common.loginGetToken(this.shareId).then(res => {
					this.getorderDetail();
					this.getRecommend();
				});
			} else {
				this.getorderDetail();
				this.getRecommend();
			}
			
		}
	},
	methods: {
		getRecommend() {
			this.$common.httpGet('common-goods/upMall/groupon/recommend/6').then(res => {
				this.recommend = res.data.data || [];
			});
		},
		// 获取拼团信息
		getorderDetail() {
			this.$common.httpGet('common-goods/upMall/groupon/grouponPage/' + this.groupId).then(res => {
				console.log('草泥馬----垃圾', res);

				this.IsSkelttion = false;
				this.goodInfo = res.data.data || {};
				this.state = Number(this.goodInfo.groupStatus);
				this.residueMsTimes = this.goodInfo.residueMsTimes;
				this.residueActor = this.goodInfo.actorCount; //团队剩余位置
				this.getGoodsInfo(this.goodInfo.spuId);
				this.getGrouponlist(this.goodInfo.grouponId)
			});
		},
		//  获取某个团队的剩余可参团位置
		getresidueActor(e) {
			this.$common.httpGet('common-goods/upMall/groupon/residueActor?grouponId=' + e).then(res => {
				console.log(res);
				this.residueActor = res.data.data || 0;
			});
		},
		//  获取拼团商品分享信息
		getGoodsInfo(e) {
			this.$common.httpGet('common-goods/upMall/groupon/spu/' + e).then(res => {
				this.shareInfo = res.data.data;
				console.log('share', this.shareInfo);
			});
		},
		// 获取参与拼团列表
		getGrouponlist(groupId) {
			this.$common.httpGet("order/groupon/list", {
				grouponOrderId: groupId
			}).then((res) => {
				console.log(res,'getGrouponlist')
				this.joinList = res.data.data.records || []
				this.joindetail.groupAvatar = this.joinList[0].groupAvatar
				this.joindetail.grouponName = this.joinList[0].grouponName
				this.joindetail.groupNickName = this.joinList[0].groupNickName
			})
		},
		// 点击查看谁在买
		getLookwho() {
			this.isPopUpJoinList = true
		},
		// 倒数到0执行
		timeup() {
			uni.showToast({
				title: '活动结果正在中...',
				icon: 'none'
			});
			let timer = setTimeout(() => {
				this.getorderDetail();
				clearInterval(timer);
			}, 1000);
			// this.isResult = true
		},
		// 去商品详情页下单
		goPay(state) {
			// let _goodInfo = {
			// 		shareId: '',
			// 		productId: 1118,
			// 		productCount: 1,
			// 		freight:0,
			// 		grouponActivityId:1,
			// 		joinGroupId: 0,
			// 		image: 'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/1/10/4bf77334-c44b-4ba5-b047-0760ff58ce8e.png',
			// 		goodsName: '台湾华珍手烧香脆煎饼',
			// 		price: 0.1,
			// }
			// uni.setStorageSync('pintuanInfo', _goodInfo)
			console.log(' this.shareId', this.shareId);
			if (state > 0) {
				return false;
			} else {
				uni.navigateTo({
					url: '../groupGoodsDetails/groupGoodsDetails?spuId=' + this.goodInfo.spuId + '&shareId=' + this.shareId + '&grouponId=' + this.groupId
				});
			}
		}
	},
	// 右上角分享
	onShareAppMessage(res) {
		if (res.from === 'button') {
			console.log(1111);
		}
		return {
			title: this.shareInfo.shareTitle,
			imageUrl: this.shareInfo.shareCover,
			path: 'pages/shareGroup/shareGroup?groupId=' + this.groupId + '&shareId=' + this.shareId,
			desc: this.shareInfo.shareDesc
		};
	}
};
</script>

<style lang="less">
.shareGroup {
	height: 100vh;
	box-sizing: border-box;
	background-color: #f8f8f8;
	position: relative;
	padding: 20upx 0;
	
	.leader {
		width: 100upx;
		height: 100upx;
		position: relative;
	
		.leader-avatar {
			width: 100upx;
			height: 100upx;
			border-radius: 50%;
			border: 1px solid #06B720;
		}
	
		.leader-tag {
			position: absolute;
			bottom: -4upx;
			right: 0;
			background: #06B720;
			color: #fff;
			font-size: 20upx;
			padding: 0 10upx;
			border-radius: 13upx;
		}
	}

	.item-list {
		min-height: 206upx;
		padding: 0 24upx;
		background-color: #FFFFFF;

		.item-box {
			display: flex;
			background: #ffffff;

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
					align-items: center;

					// margin-top: 48upx;
					.price {
						font-size: 28upx;
						font-family: PingFang-SC-Medium;
						font-weight: 500;
						color: #4a90e2;

						text:last-child {
							margin-left: 10upx;
							font-size: 24upx;
							font-weight: 400;
							color: #b4b4b4;
						}
					}

					.info {
						font-size: 28upx;
					}
				}
			}
		}
	}

	.stateBox {
		margin-top: 20upx;
		padding: 20upx 0;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		height: 400upx;
		background-color: #ffffff;
		position: relative;
		.look {
			position: absolute;
			right: 0;
			top: 20upx;
			width: 130upx;
			height: 55upx;
		
			image {
				width: 100%;
				height: 100%;
			}
		}

		.timeBox {
			margin-top: 40upx;
			display: flex;
			align-items: center;
			justify-content: center;

			.biao {
				width: 50upx;
				height: 50upx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.countdown {
				margin-left: 20upx;
				display: flex;
				align-items: center;

				text {
					margin: 0 10upx;
				}
			}
		}

		.title {
			// margin-top: 30upx;
			display: flex;
			flex-direction: column;
			color: #06B720;
			font-weight: 600;
			text-align: center;

			text:last-child {
				margin-top: 30upx;
				font-size: 26upx;
				font-weight: 400;
				color: #808080;
				text-align: center;
			}
		}

		.succeed {
			// margin-top: 40upx;
			width: 60upx;
			height: 60upx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.lose {
			// margin-top: 40upx;
			width: 100upx;
			height: 100upx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.Btn {
			// margin-top: 30upx;
			height: 80upx;
			width: 400upx;
			background-color: #06B720;
			border-radius: 50upx;
			line-height: 80upx;
			text-align: center;
			color: #ffffff;
		}

		.tips {
			font-size: 24upx;
			color: #aaaaaa;
		}
	}

	.hotGoods {
		margin: 20upx 0;
		background-color: #ffffff;
		padding: 0 14upx 50upx;

		.topNav {
			padding: 20upx 16upx;
			border-bottom: 1px solid #f2f2f2;

			.topBox {
				margin: 5upx 0;
				padding: 5upx 20upx;
				font-size: 28upx;
				font-weight: 600;
				border-left: 3px solid #06B720;
			}
		}
	}
	
	.popup-joinList {
		.body {
			padding-top: 34upx;
			min-height: 300upx;
			max-height: 600upx;
			overflow: auto;
	
			.header-wrap {
				display: flex;
	
				.leader-info {
					padding-left: 50upx;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
	
					.leader-name,
					.good-desc {
						font-size: 26upx;
						color: #333;
	
						>text {
							margin-left: 10upx;
						}
					}
				}
			}
	
			.body-wrap {
				margin-top: 40upx;
	
				.title-wrap {
					display: flex;
					justify-content: space-around;
					text-align: center;
					font-size: 26upx;
					padding: 20upx 0;
					border-bottom: 1px solid #F7F7F7;
	
					.title-item {
						flex: 1;
	
						&:not(:last-child) {
							border-right: 1px solid #06B720;
						}
	
						&:nth-child(2) {
							flex: 1.5;
						}
	
						&:nth-child(3) {
							flex: 0.7;
						}
					}
				}
	
				.list-wrap {
					.list-item {
						display: flex;
						font-size: 26upx;
						color: #808080;
						padding: 20upx 0;
						border-bottom: 1px solid #F7F7F7;
	
						.buyer,
						.num,
						.time {
							flex: 1;
							text-align: center;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							padding: 0 10upx;
						}
	
						.num {
							flex: 0.7;
						}
	
						.time {
							flex: 1.5;
						}
					}
				}
			}
		}
	}
	
}
</style>
