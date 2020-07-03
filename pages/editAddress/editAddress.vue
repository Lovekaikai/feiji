<template>
	<view class="editAddress">
		<view class="item">
			<view class="left">姓名</view>
			<view class="right"><input type="text" placeholder="请输入姓名" value="" v-model="name" /></view>
		</view>
		<view class="item">
			<view class="left">手机号码</view>
			<view class="right"><input type="text" placeholder="请输入手机号码" v-model="tel" /></view>
		</view>
		<view class="item">
			<view class="left">所在地区</view>
			<view class="right region" @tap="openPicker" style="width: 100%;min-height: 60px;">
				<!-- <icon type="location-filled"></icon> -->

				<view>{{ lotusAddressData.provinceName }}{{ lotusAddressData.cityName }}{{ lotusAddressData.townName }}</view>

				<view class="iconfont icon-iclocationonpx"></view>
				<!-- <uni-icon type="location" size="20"></uni-icon> -->
			</view>
		</view>
		<view class="item">
			<view class="left">详细地址</view>
			<view class="right"><input type="text" placeholder="请输入地址" value="" v-model="address" class="textece" /></view>
		</view>
		<view class="default" @tap="setDefault" v-if="Number(type) !== 2">
			<view class="iconfont icon-dui" :class="isDefault ? 'red' : ''"></view>
			<view class="adress">设为默认地址</view>
		</view>
		<view class="btn">
			<button type="warn" @tap="Update" v-if="addressId">修改</button>
			<button type="warn" @tap="setaddress" v-else :disabled="isDisabled">保存并使用</button>
		</view>
		<view class=""><lotus-address v-on:choseVal="choseValue" :lotusAddressData="lotusAddressData"></lotus-address></view>
	</view>
</template>

<script>
import lotusAddress from '../../components/Winglau14-lotusAddress/Winglau14-lotusAddress.vue';
import uniIcon from '../../components/uni-icon/uni-icon.vue';
export default {
	data() {
		return {
			usersId: '',
			tel: '',
			isDefault: false,
			name: '',
			address: '',
			// countryId: "3",
			// provinceId: "1",
			// cityId: "2",
			fullSite: '',
			addressId: '',
			lotusAddressData: {
				visible: false,
				provinceName: '',
				cityName: '',
				townName: '',
				AreaID: ''
			},
			proviceCode: '',
			region: '',
			type: '',
			isDisabled: false //控制是否禁用
		};
	},
	components: {
		lotusAddress,
		uniIcon
	},
	onLoad(option) {
		let addressList = uni.getStorageSync('addressList');
		if (option.type === '2') {
			this.type = option.type;
			this.getAddressDetail(option.arid);
			uni.setNavigationBarTitle({
				title: '修改收货地址'
			});
		} else {
			uni.setNavigationBarTitle({
				title: '新增收货地址'
			});
		}
	},
	methods: {
		openPicker() {
			// console.log("2121")
			this.lotusAddressData.visible = true;
		},
		//回传已选的省市区的值
		choseValue(res) {
			console.log(res)
			if (res.provice) {
				// console.log(res)
				this.lotusAddressData.visible = res.visible; //visible为显示与关闭组件标识true显示false隐藏
				//res.isChose = 1省市区已选 res.isChose = 0;未选
				if (res.isChose) {
					// console.log("res", res)
					this.lotusAddressData.provinceName = res.provice; //省
					this.lotusAddressData.proviceCode = res.proviceCode; //省
					this.lotusAddressData.cityName = res.city; //市
					this.lotusAddressData.cityCode = res.cityCode; //市
					this.lotusAddressData.townName = res.town; //区
					this.lotusAddressData.AreaID = res.AreaID; //区
					this.region = `${res.provice} ${res.city} ${res.town}`; //region为已选的省市区的值
				}
			} else {
				this.lotusAddressData.visible = res.visible;
			}
		},
		// 获取地址详情
		getAddressDetail(id) {
			var _this = this;
			_this.$common.httpGet('user/userAddress/getById/' + id).then(res => {
				// console.log('获取地址详情', res.data)
				_this.address = res.data.data.addressDetail;
				_this.name = res.data.data.name;
				_this.tel = res.data.data.tel;
				_this.isDefault = res.data.data.isDefault;
				_this.addressId = res.data.data.id;
				_this.lotusAddressData.provinceName = res.data.data.province;
				_this.lotusAddressData.cityName = res.data.data.city;
				_this.lotusAddressData.townName = res.data.data.area;
				// console.log(_this.lotusAddressData)
				_this.lotusAddressData.proviceCode = res.data.data.provinceCode; //省

				_this.lotusAddressData.cityCode = res.data.data.cityCode; //市
				_this.lotusAddressData.AreaID = res.data.data.areaCode;
				// _this.fullSite=res.data.data.fullSite
			});
		},
		// 新增地址
		setaddress() {
			var _this = this;
			// console.log(this.lotusAddressData)
			if (this.lotusAddressData.AreaID) {
				// console.log('you')
				if (_this.name) {
					if (_this.tel) {
						let pattern = /0?(13|14|15|18|17|16)[0-9]{9}/;
						if (!pattern.test(_this.tel)) {
							this.$common.showToast('请填写正确的手机号码格式');
						} else {
							if (_this.lotusAddressData.provinceName) {
								if (_this.address) {
									// console.log('lotusAddressData', this.lotusAddressData)
									var _data = {
										countryCode: '86',
										provinceCode: _this.lotusAddressData.proviceCode,
										cityCode: _this.lotusAddressData.cityCode,
										addressDetail: _this.address,
										areaCode: _this.lotusAddressData.AreaID,
										name: _this.name,
										tel: _this.tel,
										isDefault: Number(_this.isDefault)
									};
									console.log(1);
									this.isDisabled = true;
									// console.log(_data)
									this.$common.httpPost('user/userAddress/insert', _data).then(res => {
										// console.log(res)
										if (Number(res.data.code) === 100200) {
											setTimeout(() => {
												uni.navigateBack({
													delta: 1
												});
											});
										} else {
											_this.$common.showToast(res.data.message, 'none');
											this.isDisabled = false;
										}
									});
								} else {
									_this.$common.showToast('请输入详细地址', 'none');
								}
							} else {
								_this.$common.showToast('请选择地区', 'none');
							}
						}
					} else {
						_this.$common.showToast('请输入手机号码', 'none');
					}
				} else {
					_this.$common.showToast('请输入收货人', 'none');
				}
			} else {
				// console.log('kong')
				_this.$common.showToast('请选择地区，精确到区', 'none');
			}
		},
		// 设为默认地址
		setDefault() {
			this.isDefault = !this.isDefault;
		},
		// 修改地址
		Update() {
			var _this = this;

			if (_this.name) {
				if (_this.tel) {
					if (_this.lotusAddressData.provinceName) {
						if (_this.address) {
							var _data = {
								countryCode: '86',
								provinceCode: _this.lotusAddressData.proviceCode,
								cityCode: _this.lotusAddressData.cityCode,
								addressDetail: _this.address,
								areaCode: _this.lotusAddressData.AreaID,
								name: _this.name,
								tel: _this.tel,
								id: _this.addressId
							};

							this.$common.httpPost('user/userAddress/update', _data).then(res => {
								if (res.data.code === 100200) {
									let infoAddress = this.$common.getStorage('address');
									// console.log("Number(_this.isDefault)",_this.addressId)
									// console.log(infoAddress.id)
									if (infoAddress) {
										if (infoAddress.id === _this.addressId) {
											infoAddress = res.data.data;
										}
										this.$common.setStorage('address', infoAddress);
									}

									setTimeout(() => {
										uni.navigateBack({
											delta: 1
										});
									});
								} else {
									_this.$common.showToast(res.data.message, 'none');
								}
							});
						} else {
							_this.$common.showToast('请输入详细地址', 'none');
						}
					} else {
						_this.$common.showToast('请选择地区', 'none');
					}
				} else {
					_this.$common.showToast('请输入收货人', 'none');
				}
			} else {
				_this.$common.showToast('请输入收货人', 'none');
			}
		}
	}
};
</script>

<style lang="scss">
.editAddress {
	height: 100vh;
	background: rgb(247, 247, 247);
	position: relative;

	.item {
		background: #ffffff;
		display: flex;
		line-height: 106upx;
		align-items: center;

		border-bottom: 1px solid #ccc;

		.left {
			flex: 3;
			width: 162upx;
			text-align: left;
			text-indent: 10px;
			font-size: 28upx;
			// text-align: center;
			font-family: PingFang-SC-Regular;
			font-weight: 400;
			color: rgba(128, 128, 128, 1);
		}

		.right {
			flex: 9;
			font-size: 14px;
		}
		.textece {
		}
	}

	.region {
		font-size: 34upx;
		display: flex;
		align-items: center;

		.icon-location {
			margin-left: 5px;
		}
	}

	.default {
		justify-content: center;
		margin: 36upx 0;
		display: flex;
		align-items: center;

		.icon-dui {
			// color: #E2252B;
			font-size: 40upx;
			color: #ddd;
		}

		.red {
			color: #e2252b;
		}

		.adress {
			margin-left: 10upx;
			font-size: 34upx;
			font-family: PingFang-SC-Regular;
			font-weight: 400;
			color: rgba(128, 128, 128, 1);
		}
	}

	.btn {
		height: 76upx;
		// position: absolute;
		// bottom: 56upx;
		// left: 0;
		width: 100%;

		button {
			margin: 108upx auto 0;
			width: calc(100vw - 48upx);
			height: 100%;
			font-size: 28upx;
			font-family: PingFang-SC-Medium;
			font-weight: 500;
			color: rgba(255, 255, 255, 1);
			border-radius: 0;
			background: #06B720;
		}
	}
}
</style>
