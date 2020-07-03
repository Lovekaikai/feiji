<template>
	<view class="my-authority">
		<view class="title">我的特权</view>
		
		<view class="content" v-if="userInfo.type === 1">
			<view class="item" v-for="(item,index) in authList" :key="index">
				<image class="icon" src="https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/3/31/edd4fac2-ec1d-4db3-8ad1-350236ef3f36.png"></image>
				<text>{{item}}</text>
			</view>
		</view>
		<view class="imgContent" v-else>
			<image :src="leverImg" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			userInfo: {
				type: Object,
				default() {
					return {}
				}
			},
			current: {
				type: Number,
				default() {
					return 0
				}
			}
		},
		data() {
			return {
				leverIhages: '',
				member: [
					"购物享等级折扣",
					"完成首单后享推荐返价格差权益",
					"推荐返价格差权益：通过直接推荐好友下单，享该好友等级与您当前等级的下单商品价格差，好友下单后，价格差即到账余额"
				],
				agentAuth : [
					"享受直接或间接推荐会员购买商品后的价格差价",
					"获得扩展代理商采购额20%",
					"获得代理团队奖励40%",
					"制定商品的代理权"
				]
			}
		},
		computed: {
			// member的第一条是动态的
			memberAuth() {
				const { userLevel } = this.userInfo
				switch(userLevel) {
					case 0: 
						this.member[0] = '购物享新人等级折扣'  // 新人
						break
					case 1:
						this.member[0] = '购物享铜牌会员等级折扣'   // 铜牌会员
						break
					case 2:
						this.member[0] = '购物享银牌会员等级折扣'  // 银牌
						break
					case 3:
						this.member[0] = '购物享金牌会员等级折扣'  // 金牌
						break
					default:
						break
				}
				return this.member
			},
			// 判断会员等级是什么
			leverImg() {
				// const { userLevel } = this.userInfo
				switch(this.current) {
					case 0:
						this.leverIhages = 'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/6/3/5407d936-796f-4fdf-874d-87b6e8ba64f7.jpg'
						break
					case 1:
						this.leverIhages = 'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/6/3/62bd98fb-bb97-4006-8efd-762bcf0ef703.png'
						break
					case 2:
						this.leverIhages = 'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/6/3/e468d340-1558-499a-ac25-e1830b9c6808.png'
						break
					case 3:
						this.leverIhages = 'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/6/3/0a15c3f0-20d5-49b9-aff5-7e14cb927d1a.png'
						break
					default:
						break
				}
				return this.leverIhages
			},
			authList() {
				const { type } = this.userInfo
				if(type === 0) {
					// 则是会员
					return this.memberAuth
				}else if(type === 1) {
					// 则是代理商
					return this.agentAuth
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.my-authority {
		width: 686upx;
		background-color: #fffeff;
		margin: -120upx auto 0;
		border-radius: 16upx;
		padding-bottom: 50upx;
		.title {
			font-size: 30upx;
			font-weight: bold;
			padding: 39upx 0 50upx 0;
			text-align: center;
		}
		
		.content {
			padding: 0 37upx 0;
			.item {
				display: flex;
				align-items: center;
				margin-bottom: 57upx;
				&:last-child {
					margin-bottom: 0;
				}
				.icon {
					width: 36upx;
					height: 34upx;
					margin-right: 28upx;
				}
				>text {
					flex: 1;
					font-size: 26upx;
				}
			}
		}
		.imgContent {
			image {
				width: 100%;
			}
		}
	}
</style>
