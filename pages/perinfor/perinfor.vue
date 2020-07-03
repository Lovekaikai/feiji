<template>
	<view class="perinfor">
		<yu-kefu position="3"></yu-kefu>
		<view class="title"><text>基本信息</text></view>

		<view class="content">
			<view class="item">
				<text>头像</text>

				<view class="right-wrap">
					<image :src="perInfor.avatar" mode="" class="avatar"></image>
					<view class="arrow"></view>
				</view>
			</view>
			<view class="item">
				<text>昵称</text>
				<view class="right-wrap">
					<input class="input" type="text" v-model="perInfor.nickName" disabled />
					<view class="arrow"></view>
				</view>
			</view>
			<view class="item">
				<text>真实姓名</text>
				<view class="right-wrap">
					<input class="input" type="text" v-model="perInfor.realName" placeholder="请输入" />
					<view class="arrow"></view>
				</view>
			</view>
			<view class="item">
				<text>身份证号</text>
				<view class="right-wrap">
					<input class="input" type="text" v-model="perInfor.identityCard" placeholder="请输入" />
					<view class="arrow"></view>
				</view>
			</view>
			<view class="item">
				<text>手机号码</text>
				<view class="right-wrap">
					<input class="input" type="text" v-model="perInfor.mobile" placeholder="请输入" />
					<view class="arrow"></view>
				</view>
			</view>
			<view class="item">
				<text>验证码</text>
				<view class="right-wrap">
					<input class="input" type="text" v-model="captcha" placeholder="请输入" />
					<view class="captcha" v-show="isCaptcha" @tap="sendCode">获取验证码</view>
					<view class="again" v-show="!isCaptcha">
						(<text>{{ second }}</text>)秒后重新获取
					</view>
				</view>
			</view>
		</view>

		<button class="saveBtn" type="default" @tap="updateInfo">保存信息</button>
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
			//个人信息数据
			perInfor: {
				nickName: '', //用户昵称
				realName: '', //用户真实姓名
				mobile: '', //	手机号码
				identityCard: '', //用户身份证号码
				avatar: '', // 用户头像
				gender: '' //  性别：0 未知， 1男， 2 女
			},
			captcha: '', //验证码
			isCaptcha: true,
			second: 60 //倒计时
		};
	},

	onLoad() {
		const userInfo = uni.getStorageSync('userInfo')
		this.perInfor.nickName = userInfo.nickName;
		this.perInfor.realName = userInfo.realName;
		this.perInfor.mobile = userInfo.mobile;
		this.perInfor.identityCard = userInfo.identityCard;
		this.perInfor.avatar = userInfo.avatar;
		this.perInfor.gender = userInfo.gender;
		this.perInfor.balance = userInfo.balance;
		this.perInfor.integral = userInfo.integral;
		this.perInfor.memberRecommendedId = userInfo.memberRecommendedId;
		this.perInfor.agentRecommendedId = userInfo.agentRecommendedId;
		this.perInfor.userLevel = userInfo.userLevel;
		this.perInfor.shareId = userInfo.shareId;
		console.log(this.perInfor);
	},
	methods: {
		// 发送验证码
		sendCode() {
			let that = this;
			const { mobile } = this.perInfor;

			// 手机号码非空判断
			if (!mobile.trim()) {
				this.$common.showToast('请输入手机号码')
				return;
			}
			// 获取验证码请求
			uni.request({
				url: `https://mall.cntracechain.com/baseService/sms/smsCaptcha/${mobile}/mall`,
				method: 'get',
				success(res) {
					if (res.data.statusCode === 200) {
						that.isCaptcha = false;
						that.$common.showToast('短信发送成功');
						// 设计倒计时
						let timerId = setInterval(() => {
							--that.second;
						}, 1000);
						//清除倒计时
						setTimeout(() => {
							clearInterval(timerId);
							that.isCaptcha = true;
							that.second = 60; // 重新变成60s
						}, 60000);
					} else {
						that.$common.showToast(res.data.statusMsg);
					}
				}
			});
		},

		// 验证短信验证码
		validCaptcha(mobile, code) {
			return new Promise((resolve, reject) => {
				uni.request({
					url: `https://mall.cntracechain.com/baseService/sms/smsCaptcha/${mobile}/${code}/mall`,
					method: 'get',
					success(res) {
						resolve(res.data);
					}
				});
			});
		},

		// 点击保存信息
		updateInfo() {
			const { identityCard, mobile } = this.perInfor;
			if(identityCard && identityCard.trim()) {
				console.log('填写了身份证')
				let pattern = /\d{17}[\d|x]|\d{15}/
				if(!pattern.test(identityCard)) {
					this.$common.showToast('请填写正确的身份证号码格式')
					return
				}
			}

			if(mobile && mobile.trim()) {
				let pattern = /0?(13|14|15|18|17|16)[0-9]{9}/;
				if(!pattern.test(mobile)) {
					this.$common.showToast('请填写正确的手机号码格式')
					return
				}
				
				if(!this.captcha || !this.captcha.toString().trim()) {
					this.$common.showToast('请输入验证码')
					return;
				}
				
				this.validCaptcha(mobile, this.captcha).then(res => {
					if (res.statusCode === 200) {
						// 验证码匹配  可以继续接下来的操作
						this.$common.httpPost('user/userMember/update', this.perInfor).then(res => {
							console.log(res,"填写了手机");
							const {code, data, message} = res.data
							if (code === 100200) {
								this.$common.showToast(message);
								uni.setStorageSync('userInfo',data)
								uni.navigateBack({
									delta: 1
								})
							}
						});
					} else {
						// 验证码不匹配
						this.$common.showToast(res.statusMsg);
					}
				});
			}else {
				this.$common.httpPost('user/userMember/update', this.perInfor).then(res => {
					console.log(res,"没填写手机");
					const {code, data, message} = res.data
					if (code === 100200) {
						this.$common.showToast(message);
						uni.setStorageSync('userInfo',data);
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						},1500)
					}
				});
			}


			console.log(this.perInfor);
		}
	}
};
</script>

<style lang="less" scoped>
.perinfor {
	width: 100vw;
	height: 100vh;
	background-color: #f8f6f7;
	.title {
		font-size: 25rpx;
		color: #808080;
		padding: 27rpx 0 23rpx 32rpx;
	}

	.content {
		background: #ffffff;
		padding: 0 30rpx;
		.item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 24rpx 0;
			border-bottom: 1px solid #f2f2f2;
			>text {
				font-size: 28rpx;
				color: #191919;
			}
			.right-wrap {
				display: flex;
				align-items: center;
				font-size: 26rpx;
				color: #808080;
				.avatar {
					width: 70rpx;
					height: 70rpx;
					border-radius: 50%;
				}
				.input {
					text-align: right;
				}
				.arrow {
					width: 14rpx;
					height: 14rpx;
					border-top: 1rpx solid #808080;
					border-right: 1rpx solid #808080;
					transform: rotate(45deg);
					margin-left: 20rpx;
				}
				.captcha {
					width: 134rpx;
					height: 40rpx;
					border-radius: 20rpx;
					color: #06B720;
					font-size: 22rpx;
					line-height: 40rpx;
					text-align: center;
					border: 1px solid #06B720;
					margin-left: 50rpx;
				}
				.again {
					font-size: 22rpx;
					color: #c8c7cc;
					margin-left: 20rpx;
				}
			}

		}
	}
	
	.saveBtn {
		width: 686rpx;
		height: 88rpx;
		line-height: 88rpx;
		color: #fff;
		font-size: 28rpx;
		margin-top: 80rpx;
		border-radius: 6rpx;
		background: #06B720;
	}
}
</style>
