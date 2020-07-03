<template>
	<view class="profile">
		<yu-kefu position="3"></yu-kefu>
		<view v-show="IsSkelttion">
			<skeleton :SkelttionType="SkelttionType"></skeleton>
		</view>
		<view class="content" v-show="!IsSkelttion">
			<!-- 用户头像 -->
			<my-avatar :user-info="userInfo" @getPoster="getMember"></my-avatar>
		
			<!-- 会员/代理商等级介绍 -->
			<level-introduce :user-info="userInfo"></level-introduce>
		
			<!-- 我的订单 -->
			<my-order :order-total="orderTotal"></my-order>
		
			<!-- 我的余额 -->
			<my-balance :balance-data="balanceData"></my-balance>
		
			<!-- 我的积分 -->
			<my-integral :integral-data="integralData" v-if="userInfo.type === 1"></my-integral>
		
			<!-- 我的设置 -->
			<my-setting :invite-code="inviteCode" @getPoster='getAgency'></my-setting>
		
			<!-- 海报 -->
			<view class="poster-wrap" v-if="showPoster" @touchmove.stop.prevent="moveHandle">
				<view class="poster">
					<image :src="postImage" mode="widthFix" @load="imageLoad"></image>
					<icon type="clear" size="22" class="close" @tap="closePoster" v-if="btnShow" />
				</view>
				<button class="btn" @tap="savePoster(savePostImage)" v-if="btnShow" plain>点击保存海报</button>
			</view>
		
			<!-- 遮罩 -->
			<view class="marsk"  v-if="showMask" @touchmove.stop.prevent="moveHandle"></view>
		</view>
	</view>
</template>

<script>	
import MyAvatar from '../../components/profile/MyAvatar.vue';
import LevelIntroduce from '../../components/profile/LevelIntroduce.vue';
import MyOrder from '../../components/profile/MyOrder.vue';
import MyBalance from '../../components/profile/MyBalance.vue';
import MyIntegral from '../../components/profile/MyIntegral.vue';
import MySetting from '../../components/profile/MySetting.vue';
// 客服组件
import yuKefu from '@/components/yu-kefu/yu-kefu.vue'
// 函数节流
import throttle from '@/common/throttle.js';

import { UserInfo } from './profile.js';

export default {
	components: {
		MyAvatar,
		LevelIntroduce,
		MyOrder,
		MyBalance,
		MyIntegral,
		MySetting,
		yuKefu
	},
	data() {
		return {
			SkelttionType:'member', // 骨架屏类型
			IsSkelttion:true,
			userInfo: {}, // 用户信息
			balanceData: {}, // 余额数据
			integralData: {}, // 积分数据
			// 是否有邀请码
			inviteCode: {
				show: false,
				code: ''
			},
			showPoster: false, // 是否显示海报
			btnShow: false,
			showMask: false,  // 控制是否显示遮罩层
			postImage: '', // 海报图
			savePostImage: '',  // 保存的海报图
			marskHeight: 0 ,//遮罩的高度
			postParams : {},  //传递给海报的参数
			shareUrl : ""   ,// 传递给小程序码的页面路径
			orderTotal : 0,  //订单数量
			isShow: false  // 控制是否显示主页
		};
	},
	async onShow() {
		await this.getLocalInfo();
		await this.getBalanceInfo();
		await this.getPointInfo();
		await this.getOrderToatal();
	},
	// 监听底部tabbar 点击事件
	onTabItemTap(item) {
		let shareId = uni.getStorageSync('shareId')
		
		this.postImage = ""
		this.$common.passUserauth(shareId).then(res => {
				// console.log(res);
			if (res) {
				this.$common.navigateTo('../profile/profile');
				this.isShow = true
			} else {
				uni.reLaunch({
					url: '../auth/auth?share=' + shareId + '&isAuth=2'
				})
				// this.$common.navigateTo('../auth/auth?share=' + shareId + '&isAuth=2');
			}
		});
	},
	methods: {
		// 获取本地用户信息
		getLocalInfo() {
			this.$common.goGetUserInfo(false, 3).then(userInfo => {
					this.IsSkelttion = false
					this.userInfo = new UserInfo(userInfo);
					this.inviteCode.code = userInfo.shareId;
					this.postParams.nickName = userInfo.nickName;
					this.postParams.shareId = userInfo.shareId;
					if (this.userInfo.userLevel >= 0 && this.userInfo.userLevel <= 3) {
						console.log('是新人或是会员');
						this.userInfo.type = 0; // 0是会员
					} else if (this.userInfo.userLevel >= 4 && this.userInfo.userLevel <= 6) {
						console.log('是代理商');
						this.inviteCode.show = true;
						this.userInfo.type = 1; // 1 是代理商
					}
				
			})
		},

		// 获取余额详情
		getBalanceInfo() {
			this.$common.httpGet('upmall-point/balance/details',null,false).then(res => {
				const { code, data } = res.data;
				if (Number(code) === 400200) {
					this.balanceData = data;
				}
				// console.log(this.balanceData,'balance')
			});
		},

		// 获取积分详情
		getPointInfo() {
			this.$common.httpGet('upmall-point/point/details',null,false).then(res => {
				const { code, data } = res.data;
				if (Number(code) === 400200) {
					this.integralData = data;
				}
				// console.log(this.integralData,'integralData')
			});
		},
		
		// 获取订单列表总数
		getOrderToatal() {
			this.$common.httpGet('order/order/getOrderPages?orderStatus=&pageNum=10',null,false).then(res => {
				const {code , data} = res.data
				if(Number(code) === 300200) {
					this.orderTotal = data.total
				}
			})
		},

		// 监听生成海报
		getPoster() {
			console.log('点击了邀请码');
			this.showMask = true;
			let that = this;
			this.postImage = ""
			console.log(this.postImage)
			this.$common.loading('海报生成中...');
			const { type } = this.userInfo;
			switch (type) {
				case 0:  // 新人或是会员
					this.postParams.backUrl = 'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/29/5f57196a-0b78-4bdc-a8b3-b91527304055.png';
					this.postParams.shareText = "邀请你加入UpMall，扫码购物后成为会员"
					this.shareUrl = "pages/index/index"   //跳转商城首页
					break; 
				case 1:  // 代理商
					this.postParams.backUrl = 'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/29/67a58990-aed4-4258-a503-61be8ddacb91.png';
					this.postParams.shareText = "推荐你加入UpMall代理商团队"
					this.shareUrl = "pages/buypackagecode/buypackagecode"  // 跳转到购买套餐页
					break;
			}
			
			this.$common.httpPost(`user/userMember/getUnlimited`,{page: this.shareUrl},false).then(res => {
				console.log('获取小程序码')
				this.postParams.qrCodeContent = res.data.data  // 获取小程序码

				uni.request({
					url: 'https://mall.cntracechain.com/shareQrImage/share/up/user',
					data: this.postParams,
					method: 'post',
					header: {
						token: uni.getStorageInfoSync('token')
					},
					success(res) {
						const { code, data, message } = res.data;
						console.log('获取海报地址')
						console.log(data)
						// that.showPoster = true;
						if (Number(code) === 200) {
							// 这里的目的是清除海报的缓存
							uni.downloadFile({
							    url: data, //仅为示例，并非真实的资源
							    success: (res) => {
									console.log(res)
							        if (res.statusCode === 200) {
							            that.postImage = res.tempFilePath;
										uni.hideLoading();
							        }
							    }
							});
							that.showPoster = true;
							that.savePostImage = data				
						}else {
							that.$common.showToast('海报生成失败')
							that.showPoster = false
							this.showMask = false
						}
						console.log(res, 'img');
					}
				});
			})
		},
		// 生成会员海报
		getMember() {
			console.log('点击了邀请码');
			this.showMask = true;
			let that = this;
			this.postImage = ""
			console.log(this.postImage)
			this.$common.loading('海报生成中...');
			this.postParams.backUrl = 'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/29/5f57196a-0b78-4bdc-a8b3-b91527304055.png';
			this.postParams.shareText = "邀请你加入UpMall，扫码购物后成为会员"
			this.shareUrl = "pages/index/index"   //跳转商城首页
			this.$common.httpPost(`user/userMember/getUnlimited`,{page: this.shareUrl},false).then(res => {
				console.log('获取小程序码')
				this.postParams.qrCodeContent = res.data.data  // 获取小程序码
			
				uni.request({
					url: 'https://mall.cntracechain.com/shareQrImage/share/up/user',
					data: this.postParams,
					method: 'post',
					header: {
						token: uni.getStorageInfoSync('token')
					},
					success(res) {
						const { code, data, message } = res.data;
						console.log('获取海报地址')
						console.log(data)
						// that.showPoster = true;
						if (Number(code) === 200) {
							// 这里的目的是清除海报的缓存
							uni.downloadFile({
							    url: data, //仅为示例，并非真实的资源
							    success: (res) => {
									console.log(res)
							        if (res.statusCode === 200) {
							            that.postImage = res.tempFilePath;
										uni.hideLoading();
							        }
							    }
							});
							that.showPoster = true;
							that.savePostImage = data				
						}else {
							that.$common.showToast('海报生成失败')
							that.showPoster = false
							this.showMask = false
						}
						console.log(res, 'img');
					}
				});
			})
		},
		// 生成代理商海报
		getAgency() {
			console.log('点击了邀请码');
			this.showMask = true;
			let that = this;
			this.postImage = ""
			console.log(this.postImage)
			this.$common.loading('海报生成中...');
			this.postParams.backUrl = 'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/29/67a58990-aed4-4258-a503-61be8ddacb91.png';
			this.postParams.shareText = "推荐你加入UpMall代理商团队"
			this.shareUrl = "pages/buypackagecode/buypackagecode"  // 跳转到购买套餐页
			this.$common.httpPost(`user/userMember/getUnlimited`,{page: this.shareUrl},false).then(res => {
				console.log('获取小程序码')
				this.postParams.qrCodeContent = res.data.data  // 获取小程序码
			
				uni.request({
					url: 'https://mall.cntracechain.com/shareQrImage/share/up/user',
					data: this.postParams,
					method: 'post',
					header: {
						token: uni.getStorageInfoSync('token')
					},
					success(res) {
						const { code, data, message } = res.data;
						console.log('获取海报地址')
						console.log(data)
						// that.showPoster = true;
						if (Number(code) === 200) {
							// 这里的目的是清除海报的缓存
							uni.downloadFile({
								url: data, //仅为示例，并非真实的资源
								success: (res) => {
									console.log(res)
									if (res.statusCode === 200) {
										that.postImage = res.tempFilePath;
										uni.hideLoading();
									}
								}
							});
							that.showPoster = true;
							that.savePostImage = data				
						}else {
							that.$common.showToast('海报生成失败')
							that.showPoster = false
							this.showMask = false
						}
						console.log(res, 'img');
					}
				});
			})
		},
		// 保存图片的方法
		saveImage(img) {
			uni.downloadFile({
				url: img,
				success: res => {
					uni.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success: res => {
							uni.showToast({ title: '保存成功' });
							this.showPoster = false;
							this.btnShow = false;
							this.showMask = false
						},
						fail: () => {
							uni.showToast({ title: '保存失败,请稍后重试', icon: 'none' });
						}
					});
				}
			});
		},
		
		// 保存海报
		savePoster:throttle.throttleFunc(function(img){
			console.log('保存海报');
			let self = this;
			//相册授权
			uni.getSetting({
				success(res) {
					// 进行授权检测 , 为授权则进行弹层授权
					if (!res.authSetting['scope.writePhotosAlbum']) {
						console.log(res)
						uni.authorize({
							scope: 'scope.writePhotosAlbum',
							success() {
								// 成功则调用存储图片
								self.saveImage(img);
							},
							// 拒绝授权时，则进入手机设置页面，可进行授权设置
							fail: () => {
								 uni.showModal({
									content:'检测到您没打开保存相册权限，是否去设置打开？',
									confirmText: "确认",
									cancelText:'取消',
									success: (res) => {
										if(res.confirm){
											uni.openSetting({
												success: (res) => {
													console.log(res);
												}
											})
										}else{
											console.log('取消');
										}
									}
								})
							}
						});
					} else {
						// 已授权则直接进行保存图片
						self.saveImage(img);
					}
				}
			});
		},500),

		// 关闭海报
		closePoster() {
			// console.log('关闭海报');
			this.showPoster = false;
			this.showMask = false
			this.btnShow = false
		},

		moveHandle() {
			return false;
		},

		// 图片加载完毕
		imageLoad() {
			this.btnShow = true;
		}
	}
};
</script>

<style lang="less" scoped>
.profile {
	font-size: 24upx;
	color: #1e1e1e;
	background-color: #f8f6f7;
	padding: 0 32upx 60upx;
	height: 100vh;
	overflow: auto;
	-webkit-overflow-scrolling: touch;

	.poster-wrap {
		position: absolute;
		z-index: 3;
		top: 10%;
		left: 50%;
		transform: translateX(-50%);
		.poster {
			position: relative;
			> image {
				width: 600upx;
			}
			.close {
				position: absolute;
				top: -12upx;
				right: -20upx;
			}
		}
		.btn {
			width: 240upx;
			height: 58upx;
			background: #d0bb8b;
			font-size: 26upx;
			line-height: 58upx;
			color: #fff;
			border-radius: 29upx;
			margin-top: 20upx;
			border-color: #d0bb8b;
		}
	}

	.marsk {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 2;
		width: 100%;
		background: rgba(0, 0, 0, 0.5);
	}
}
</style>
