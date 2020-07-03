<template>
	<view class="authorization">
		<view class="logo">
			<image src="https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/4/15/5da53422-1039-436d-a4b6-162ceeb8e540.png" mode=""></image>
		</view>
		<view class="title">
			<text>UP商城小程序申请获取以下权限 </text>
		</view>
		<view class="title-message">
			<text>获取你的公开信息（昵称、头像、地区及性别）</text>
		</view>
		<button class="Btn" type='primary'  size="mini" open-type="getUserInfo"  withCredentials="true" lang="zh_CN" @getuserinfo="auth" >授权登录</button>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				info:{},
				option:{}
			}
		},
		onLoad(option) {
			console.log(option)
			this.option = option
		},
		onBackPress() {
			console.log(1)
		},
		methods:{
			auth(){
				this.$common.goGetUserInfo(this.option.share, Number(this.option.isAuth))			
			}
		}
	}
	
</script>

<style lang="less">
	.authorization {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 30upx;
		box-sizing: border-box;
		.logo {
			display: flex;
			justify-content: center;
			margin: 50upx  0;
			image {
				width: 100upx;
				height: 100upx;
				border-radius: 50%;
			}
		}

		.title {
			margin-top: 20upx;
			font-size: 30upx;
			font-weight: 600;
			display: flex;
			align-items: center;
			image{
				width: 60upx;
				height: 60upx;
				margin-right: 10rpx;
			}
		}
		.title-message{
			margin-top: 20upx;
			font-size: 26upx;
			font-weight: 400;
			color: #C0C0C0;
			display: flex;
			align-items: center;
		}
		.user {
			margin-top: 20upx;
			border-top: 1px solid #f3f3f3;
			display: flex;
			padding: 20upx 5upx;
			.userImg {
				width: 100upx;
				height: 100upx;
				// background-color: pink;
				border-radius: 50%;
				image {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}

			.userInfo {
				margin-left: 20upx;
				padding: 10upx 0;
				.userName {
					font-size: 32upx;
					font-weight: 500;
				}
				.userItem {
					margin-top: 10upx;
					font-size: 28upx;
					color: #808080;
				}
			}
		}
	.Btn {
		margin-top: 50upx;
		box-sizing: border-box;
		width: 100%;
		padding: 8upx;
		text-align: center;
		background-color: #07ad39;
		color: #F1F1F1;
		border-radius: 10upx;
	}
	}
</style>
