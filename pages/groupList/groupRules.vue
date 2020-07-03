<template>
	<view class="groupRules">
		<image src="https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/6/3/898b5887-e3bf-4af9-ac0b-13bb81675e3b.png" mode="widthFix"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad(option) {
			if (option.shareId) {
				console.log('分享进来')
				this.$common.loginGetToken(option.shareId).then()
			}
		},
		methods: {
			
		},
		// 分享
		onShareAppMessage(res) {
			let userInfo = this.$common.getStorage('userInfo');
			if (res.from === 'button') {
				// this.$refs.posterPopup.close();
				this.$refs.popup.close();
				console.log(1111)
			}
			return {
				title: '拼团攻略',
				imageUrl: 'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/6/3/898b5887-e3bf-4af9-ac0b-13bb81675e3b.png',
				path: 'pages/groupList/groupRules&share=' + userInfo.shareId
			};
		},
		onPageScroll(e) {
			if (e.scrollTop > 100) {
				this.topShow = true;
				uni.setNavigationBarTitle({
					title: '商品详情'
				});
			} else {
				this.topShow = false;
			}
		}
	}
</script>

<style lang="less" scoped>
	.groupRules {
		image {
			width: 100%;
			// height: 100%;
		}
	}
</style>
