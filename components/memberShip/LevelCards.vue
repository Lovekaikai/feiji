<template>
	<view class="level-cards">
		<!-- 用户等级 -->
		<view class="my-level">
			<image class="avatar" :src="userInfo.avatar"></image>
			<view class="info-wrap">
				<view class="name">{{userInfo.nickName}}</view>
				<view class="level">当前头衔：<text>{{userInfo.userLevel | formatLevel}}</text></view>
			</view>
		</view>
		
		<!-- 等级卡牌 -->
		<swiper class="card-wrap" previous-margin="140rpx" next-margin="110rpx" :current="current" @change="changeCurrent1">
			<swiper-item class="card-item" v-for="(item,index) in level" :key="index">
				<image class="card" :src="item.image"></image>
				<view class="member-desc">
					<view class="name">{{item.userLevel | formatLevel}}</view>
					<view class="line"></view>
					<view class="start-wrap">
						<star :score="userInfo.score" v-if="userInfo.score != undefined" />
					</view>
				</view>
				<view class="progress">{{item.desc}}</view>
				
				<!-- 当前等级 -->
				<view class="current-level" v-if="index === current">当前等级</view>
				
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import Star from "./Star.vue"  // 星星组件
	import { formatLevel } from '../../pages/profile/profile.js'
	
	export default {
		components: {
			Star
		},
		props: {
			userInfo : {
				type : Object,
				default() {
					return {}
				}
			},
			level : {
				type : Array,
				default() {
					return []
				}
			},
			memberLevel : {
				type : Object,
				default() {
					return {}
				}
			}
		},
		filters: {
			formatLevel
		},
		computed: {
			current() {
				const { userLevel } = this.userInfo
				switch(userLevel) {
					case 0:
					case 4:
					return 0
					break
					case 1:
					case 5:
					return 1
					break
					case 2:
					case 6:
					return 2
					break
					case 3:
					return 3
					break
				}
			}
		},
		methods: {
			changeCurrent1(e) {
				console.log(e)
				let _current = e.detail.current
				this.$emit('changeCurrent', _current)
			}
		}
	}
</script>

<style lang="less" scoped>
	.level-cards {
		height: 582upx;
		background-color: #1D1C1C;
		.my-level{
			display: flex;
			padding:30upx 0 30upx 32upx ;
			align-items: center;
			.avatar {
				width: 80upx;
				height: 80upx;
				border-radius: 50%;
				margin-right: 12upx;
			}
			.info-wrap {
				.name {
					color: #FFECB0;
					font-size: 30upx;
					font-weight: bold;
					margin-bottom: 8upx;
				}
				.level {
					color: #AA9572;
					font-size: 20upx;
				}
			}
		}
		
		.card-wrap {
			height: 300upx;
			.card-item {
				display: flex;
				align-items: center;
				position: relative;
				.card {
					display: flex;
					width: 463upx;
					height: 247upx;
					align-items: center;
					justify-content: center;
				}
				.member-desc {
					position: absolute;
					top: 32%;
					left: 30upx;
					// transform: translateY(-50%);
					color: #2D2C2B;
					.name {
						font-size: 26upx;
					}
					.line {
						width: 166upx;
						height: 1px;
						background-color: #2D2C2B;
						margin: 18upx 0;
					}
					.start-wrap {
						position: relative;
						top: -12upx;
					}
				}
				.progress {
					position: absolute;
					font-size: 20upx;
					bottom: 52upx;
					left: 30upx;
				}
				.current-level {
					position: absolute;
					right: 40upx;
					top: 52upx;
					width: 107upx;
					height: 36upx;
					line-height: 36upx;
					text-align: center;
					background:rgba(0,0,0,1);
					opacity:0.2;
					border-radius:18px 0px 0px 18px;
					font-size: 20upx;
					color: #fff;
				}
			}		
		}
	}
</style>
