<template>
	<!--地址picker-->
	<view :status="checkStatus" v-if="lotusAddressData.visible" class="lotus-address-mask">
		<view class="lotus-address-box">
			<view class="lotus-address-action">
				<text @tap="cancelPicker" class="lotus-address-action-cancel">取消</text>
				<text @tap="chosedVal" class="lotus-address-action-affirm">确认</text>
			</view>
			<view class="lotus-address-picker-box">
				<!--省-->
				<scroll-view scroll-y :scroll-into-view="'pid'+pChoseIndex" class="lotus-address-picker-box-item">
					<view @tap="clickPicker(0,pIndex,pItem.name,pItem.value);" :id="'pid'+pIndex" :class="pIndex === pChoseIndex?'lotus-address-picker lotus-address-picker2':'lotus-address-picker'"
					 v-for="(pItem,pIndex) in province" :key="pIndex">{{pItem.name}}</view>
				</scroll-view>
				<!--市-->
				<scroll-view scroll-y :scroll-into-view="'cid'+cChoseIndex" class="lotus-address-picker-box-item">
					<view @tap="clickPicker(1,cIndex,cItem.name,cItem.value);" :id="'cid'+cIndex" :class="cIndex === cChoseIndex?'lotus-address-picker lotus-address-picker2':'lotus-address-picker'"
					 v-for="(cItem,cIndex) in city" :key="cIndex">{{cItem.name}}</view>
				</scroll-view>
				<!--区-->
				<scroll-view scroll-y :scroll-into-view="'tid'+tChoseIndex" class="lotus-address-picker-box-item">
					<view @tap="clickPicker(2,tIndex,tItem.name,tItem.value);" :id="'tid'+tIndex" :class="tIndex === tChoseIndex?'lotus-address-picker lotus-address-picker2':'lotus-address-picker'"
					 v-for="(tItem,tIndex) in town" :key="tIndex">{{tItem.name}}</view>
				</scroll-view>
				<!--区END-->
			</view>
		</view>
	</view>
	<!--地址picker END-->
</template>

<script>
	import {
		lotusAddressJson
	} from "./Winglau14-lotusAddress.js";
	export default {
		props: ['lotusAddressData'],
		data() {
			return {
				visible: false,
				province: [],
				city: [],
				town: [],
				provinceName: '',
				provinceValue: '',
				cityName: '',
				cityValue: '',
				townName: '',
				townValue:'',
				AreaID: '',
				type: 0, //0新增1编辑
				pChoseIndex: -1,
				cChoseIndex: -1,
				tChoseIndex: -1,
			};
		},
		methods: {
			//取消
			cancelPicker() {
				this.type = 1;
				this.$emit("choseVal", {
					provice: this.provinceName,
					city: this.cityName,
					town: this.townName,
					AreaID: this.townValue,
					isChose: 1,
					visible: false
				});
			},
			//获取最后选择的省市区的值
			chosedVal() {
				console.log( "this.townValue",this.cityName)
				this.type = 1;
				this.$emit("choseVal", {
					provice: this.provinceName,
					proviceCode: this.provinceValue,
					city: this.cityName,
					cityCode:this.cityValue,
					town: this.townName,
					AreaID: this.townValue,
					isChose: 1,
					visible: false
				});
			},
			//获取省市区value
			getTarId(name, value, type) {
				// console.log('获取省市区', value)
				let id = 0;
				const _this = this;
				lotusAddressJson.map((item, index) => {
					if (value) {
						if (item.name === name) {
							if (item.value === value) {
								id = item.value;
							}
						}
					} else {
							if (item.name === name) {
								id = item.value;
							}
					}
				});
				return id;
			},
			//获取市数据
			getCityArr(parentId) {
				console.log('获取市数据',parentId)
				let city = [];
				lotusAddressJson.map((item, index) => {
					if (Number(item.parent) === Number(parentId)) {
						let cityItem = {}
						cityItem = {
							name: item.name,
							value: item.value
						}
						city.push(cityItem);
					}
				});
				
				return city;
			},
			//获取区数据
			getTownArr(parentId) {
				let town = [];
				lotusAddressJson.map((item, index) => {
					if (index >= 33 && item.parent === parentId) {
						console.log("进来")
						let townItem = {}
						townItem = {
							name:item.name,
							value:item.value
						}
						town.push(townItem);
					}
				});
				return town;
			},
			//初始化数据
			initFn() {
				// console.log(1);
				this.province = []
				lotusAddressJson.map((item, index) => {
					if (index <= 33) {
						let provinceItem = {}
						 provinceItem = {
							name: item.name,
							value: item.value
						}
						this.province.push(provinceItem);
					}
				});
				//已选择省市区，高亮显示对应选择省市区
				console.log(this._props.lotusAddressData)
				const p = this._props.lotusAddressData.provinceName;
				const c = this._props.lotusAddressData.cityName;
				const t = this._props.lotusAddressData.townName;
				if (p) {
					this.pChoseIndex = this.getTarIndex(this.province, p);
				}
				if (p && c) {
					const pid = this.getTarId(p);
					this.city = this.getCityArr(pid);
					this.cChoseIndex = this.getTarIndex(this.city, c);
				}
				if (p && c && t) {
					// console.log('t',t)
					const cid = this.getTarId(c);
					console.log('cid', cid)
					this.town = this.getTownArr(cid);
					console.log('this.town', this.town,t)
					this.tChoseIndex = this.getTarIndex(this.town, t);
					console.log('this.tChoseIndex',this.tChoseIndex)
				}
			},
			//获取已选省市区
			getChosedData() {
				const pid = this.getTarId(this.provinceName, this.provinceValue, 'provice');
				this.city = this.getCityArr(pid);
				const cid = this.getTarId(this.cityName, this.cityValue, 'city');
				// console.log('获取已选省市区cid',cid)
				this.town = this.getTownArr(cid);
				// console.log('获取已选省市区',this.town)
				//已选省市区获取对应index
				if (this.provinceName) {
					this.pChoseIndex = this.getTarIndex(this.province, this.provinceName);
				}
				if (this.cityName) {
					this.cChoseIndex = this.getTarIndex(this.city, this.cityName);
				}
				if (this.townName) {
					this.tChoseIndex = this.getTarIndex(this.town, this.townName);
				}
			},
			//选择省市区交互
			clickPicker(type, index, name, value) {
				console.log('选择省市区交互',type,index,name,value)
				//省
				if (type === 0) {
					this.pChoseIndex = index;
					this.provinceName = name;
					this.provinceValue = value
					this.cChoseIndex = -1;
					this.tChoseIndex = -1;
					this.cityName = ''
					this.cityValue = ''
					this.townName = ''
				}
				//市
				if (type === 1) {
					this.cChoseIndex = index;
					this.cityName = name;
					this.cityValue = value
					this.tChoseIndex = -1;
					this.townName = '';
					this.townValue =''
				}
				//区
				if (type === 2) {
					this.tChoseIndex = index;
					this.townName = name;
					this.townValue =value
				}
				//获取省市区数据
				this.getChosedData();
			},
			//获取已选省市区index
			getTarIndex(arr, tarName) {
				// console.log('获取已选省市区index',arr,tarName)
				let cIndex = 0;
				arr.map((item, index) => {
					if (item.name === tarName) {
						cIndex = index;
					}
				});
				return cIndex;
			}
		},
		created() {
			console.log(this._props.lotusAddressData)
			this.provinceName = this._props.lotusAddressData.provinceName;
			this.cityName = this._props.lotusAddressData.cityName;
			this.townName = this._props.lotusAddressData.townName;
		},
		computed: {
			checkStatus() {
				let t = null;
				const _this = this;
				if (!_this.visible) {
					_this.initFn();
					_this.visible = _this._props.lotusAddressData.visible;
					t = _this.visible;
				}
				return t;
			}
		}
	}
</script>

<style lang="less">
	@import "./Winglau14-lotusAddress.css";
</style>
