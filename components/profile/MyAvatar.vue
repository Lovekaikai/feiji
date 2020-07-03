<template>
	<view class="my-avatar" v-if="Object.keys(userInfo).length > 0">
		<image class="avatar" :src="userInfo.avatar" ></image>
		<view class="name">{{userInfo.nickName}}</view>
		
		<view class="invitate-code" @tap="getPoster">
			<image class="code" src="../../static/images/invite.png"></image>
			<view class="desc">邀请码</view>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		props: {
			userInfo : {
				type : Object,
				default() {
					return {}
				}
			}
		},
		created() {
			console.log(this.inviteCode)
		},
		methods: {
			// 点击邀请码
			getPoster() {
				this.$emit("getPoster")
			}
		}
	}
</script>
 
<style lang="less" scoped>
	.my-avatar {
		display: flex;
		flex-direction: column;
		position: relative;
		align-items: center;
		padding: 71upx 0 43upx 0;
		.avatar {
			width: 120upx;
			height: 120upx;
			border-radius: 50%;
			margin-bottom: 19upx;
		}
		
		.invitate-code {
			position: absolute;
			top: 62upx;
			right: 10upx;
			text-align: center;
			.code {
				width: 48upx;
				height: 48upx;
			}
			.desc {
				font-size: 20upx;
				color: #333;
			}
		}
		
		.poster-wrap {
			position: absolute;
			background-color: rgba(0,0,0,.3);
		}
	}
</style>
