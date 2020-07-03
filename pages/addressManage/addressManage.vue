<template>
	<view class="addressManage">
		<yu-kefu position="3"></yu-kefu>
		<view class="addressList">
			<view class="listBox">
				<scroll-view class="scroll-view_H" style="height: 100%;" scroll-Y="true" @scrolltolower="scroll">
					<uni-swipe-action style="width: 100%;" :options="options" v-for="(address, aidx) in addressList" :key='aidx'
					 @click="bindClick" @opened='bindOpened(address.id)'>
						<view class="swipeAction" @tap="selectAdress(address)">
							<view class="text">
								<view class="top">
									<text>{{address.name}}</text><text>{{address.tel}}</text><text class="default" v-if="address.isDefault">默认</text>
								</view>
								<view class="bottom">
									{{address.fullSite}}{{address.addressDetail}}
									<!-- 广东省广州市天河区天源路401号天源广场A1座3楼中国追溯链.com广州运营中心 -->
								</view>
							</view>
							<view class="icon" @tap.stop="goEditAddress(2, address.id)">
								<text class="iconfont icon-bianji"></text>
							</view>
						</view>
					</uni-swipe-action>
				</scroll-view>

			</view>
		</view>
		<view class="btn">
			<button type="warn" @tap="goEditAddress(1)">新增收货地址</button>
		</view>
	</view>
</template>

<script>
	import uniSwipeAction from '../../components/uni-swipe-action/uni-swipe-action.vue'
	import yuKefu from '@/components/yu-kefu/yu-kefu.vue'
	export default {
		components: {
			uniSwipeAction,
			yuKefu
		},
		data() {
			return {
				usersId: '',
				options: [{
					text: '设为默认',
					style: {
						backgroundColor: '#F2F2F2',
						color: '#333333'
					}
				}, {
					text: '删除',
					style: {
						backgroundColor: '#E2252B',
						color: '#FFFFFF'
					}
				}],
				pageNum: 1,
				addressList: [],
				addressid: '',
				page: '',
				loadIng:true
			}
		},
		onLoad(options) {
			if (options) {
				this.page = options.page
			}

		},
		onShow() {
			this.pageNum=1
			this.getAddresslist()
		},
	
		methods: {
			scroll() {
				console.log("sadas")
				this.getAddresslistMore()
			},
			setDefault() {
				this.$common.httpGet('user/userAddress/getPages?pageNum=' + this.pageNum).then((res) => {
					console.log(res.data)
					_this.addressList = res.data.data.records
				})
			},
			getAddresslistMore() {
				if(!this.loadIng){
					return;
				}
				this.pageNum++
				let _this = this
				this.$common.httpGet('user/userAddress/getPages?pageNum=' + this.pageNum).then((res) => {
					console.log(res.data)
					if(res.data.data.records.length>0){
						for (let s of res.data.data.records) {
							_this.addressList.push(s)
						}
						this.loadIng=true
					}else{
						this.loadIng=false
					}
					
				})
			},
			//切换不同地址 存储在本地
			selectAdress(item) {
				if (this.page === 'exchange') {
					this.$common.setStorage("address2", item)
				} else {
					this.$common.setStorage("address", item)
				}

				uni.navigateBack({
					delta: 1
				});

				// uni.redirectTo({
				//  url: '../orderSettlement/orderSettlement'
				// })
			},
			// 前往新增/更新地址页面
			goEditAddress(idx, id) {
				if (id) {
					uni.navigateTo({
						url: '../editAddress/editAddress?type=' + idx + '&arid=' + id
					});
				} else {
					uni.navigateTo({
						url: '../editAddress/editAddress?type=' + idx
					});
				}

			},
			//获取地址列表
			getAddresslist() {
				var _this = this
				_this.addressList = []
				this.$common.httpGet('user/userAddress/getPages?pageNum=' + this.pageNum).then((res) => {
					console.log(res.data)
					_this.addressList = res.data.data.records
				})


			},
			//删除方法
			bindClick(value, id) {
				console.log(value,id)
				if (id) {
					this.addressid = id
				}
				var _this = this

				if (value.text === '删除') {
					uni.showModal({
						content: '确认删除吗？',
						success: (res) =>{
							if (res.confirm) {
								_this.$common.httpPost('user/userAddress/deleteById?id=' + _this.addressid).then((
									res) => {
									if (res.data.code === 100200) {
										console.log(121)
										// _this.$common.showToast('已删除', 'none')
										let infoAddress = _this.$common.getStorage('address')
										if (infoAddress.id === _this.addressid) {
											console.log(12131313)
											uni.removeStorage({
												key:'address'
											})
										}
										// this.$common.setStorage('address', infoAddress)
										_this.getAddresslist()
									}
								})
							} else if (res.cancel) {
								_this.$common.showToast('你取消了删除该地址', 'none')
							}
						}
					})

				} else if (value.text === '设为默认') {
					uni.showModal({
						content: '确认设置该地址为默认吗？',
						success: (res) => {
							if (res.confirm) {
								_this.$common.httpPost('user/userAddress/updateDefault?id=' + _this.addressid).then(
									(res) => {
										if (res.data.code === 100200) {
											// _this.$common.showToast('已删除', 'none')
											let infoAddress = this.$common.getStorage('address')
											if (infoAddress.id === _this.addressid) {
												infoAddress.isDefault = 1
											}
											this.$common.setStorage('address', infoAddress)
											_this.getAddresslist()
										}
									})
							} else if (res.cancel) {
								_this.$common.showToast('你取消该操作', 'none')
							}
						}
					})
				}
				// console.log(value.index)
				// uni.showToast({
				// 	title: `点击了${value.text}按钮`,
				// 	icon: 'none'
				// })
			},
			bindOpened(id) {
				console.log('bindOpened')
				this.addressid = id
			}
		}
	}
</script>

<style lang="scss">
	.addressManage {
		height: calc(100vh - 76upx);
		.addressList {
			position: relative;
			height: 100%;
			width: 100vw;
			overflow-y: auto;

			.listBox {
				left: 0;
				width: 100%;
				top: 0;
				position: absolute;
				padding-bottom: 26upx;
			}

		}

		.swipeAction {
			border-bottom: 1px solid #ccc;
			display: flex;
			// width: 100%;
			min-height: 84upx;
			align-items: center;
			padding: 24upx 24upx;

			.text {
				flex: 1;

				.top {
					font-size: 28upx;
					font-family: PingFang-SC-Medium;
					font-weight: 500;
					color: rgba(51, 51, 51, 1);

					.default {
						font-size: 24upx;
						font-family: PingFang-SC-Medium;
						font-weight: 500;
						padding: 5upx 10upx;
						color: #fff;
						margin-left: 10upx;
						border-radius: 5upx;
						background: #E2252B;
					}
				}

				.bottom {
					margin-top: 16upx;
					font-size: 20upx;
					font-family: PingFang-SC-Regular;
					font-weight: 400;
					color: rgba(128, 128, 128, 1);
				}
			}

			.icon {
				width: 88upx;
				text-align: center;
			}
		}

		.btn {
			height: 76upx;
			width: 100%;
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 10;

			button {
				width: calc(100vw);
				height: 100%;
				font-size: 28upx;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				background: #06B720;
				color: rgba(255, 255, 255, 1);
				border-radius: 0;
			}

		}
	}
</style>
