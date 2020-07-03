<template>
	<view class="logistics">
		<view class="banner-wrap">
			<image class="banner" src="https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/4/1/8f954129-cf0c-4948-9133-0a02c615b775.png"></image>
			<view class="logistics-info">
				<view class="picker-Box">
					<view class="title">请选择快递公司：
						<view class="trackingCompany">
							<picker @change="bindPickerChange" :value="index" :range="array" range-key="trackingCompanyName">
								<view class="uni-input">{{array[index].trackingCompanyName}} <image src="../../static/xia.png" mode=""></image></view>
							</picker>
						</view>
					</view>
				</view>
				<view class="order">快递单号：<text>{{trackingNumber}}</text></view>
				<view class="order desc">包含商品：<text v-for="(goods,name) in goodsList" :key="name">{{goods.goodsName}} </text></view>
			</view>
		</view>

		<view class="logistics-track">
			<block v-for="(item2, index2) in tracesData" :key="index2">
				<trackNode :is-first="index2===tracesData.length-1" :is-newest="index2===0" :is-main-node="false" :node-data="item2"></trackNode>
			</block>
		</view>
	</view>
</template>

<script>
	import TrackNode from '../../components/logistics/trackNode.vue'
	export default {
		components: {
			TrackNode
		},
		data() {
			return {
				option: {},
				info: {},
				tracesData: [],
				index: 0,
				trackingNumber: '',
				array: [],
				goodsList: []
			}
		},
		onLoad(option) {
			this.option = option
			this.getLogisitics()
		},
		methods: {
			getLogisitics() {
				this.$common.httpGet("/order/tracking/getTracking/list?orderNo=" + this.option.id).then((res) => {
					// console.log('res',res)
					if (Number(res.data.code) === 300200) {
						this.array = res.data.data
						this.goodsList = this.array[this.index].goodsList
						this.trackingNumber = this.array[this.index].trackingNumber
						this.getTracking(this.array[this.index].trackingNumber)
					}
				})
			},
			// 选择快递公司
			bindPickerChange(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.index = e.target.value
				for (let i = 0; i < this.array.length; i++) {
					console.log(i,this.index)
					if (i === Number(this.index)) {
						console.log(i,this.index)
						this.trackingNumber = this.array[i].trackingNumber
						this.getTracking(this.trackingNumber)
						this.goodsList = this.array[this.index].goodsList
					}
				}
			},
			// 查物流
			getTracking(e) {
				console.log('trackingSn',e)
				this.$common.httpGet("/order/tracking/getTracking/subpackage?trackingSn=" + e).then((res) => {
					let arr = []
					for (let s of res.data.data.trackList) {
						arr.push({
							acceptStation: s.context,
							createTime: s.ftime
						})
					}
					this.tracesData = arr
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.logistics {
		.uni-input {
			display: flex;
			align-items: center;
			justify-content: center;
			color: #06B720;
			font-weight: 600;
			background-color: #FFFFFF;
			border-radius: 20upx;
			padding: 10upx 20upx;
			image {
				width: 40upx;
				height: 40upx;
				margin-left: 10upx;
			}
		}
		.banner-wrap {
			position: relative;
			height: 224upx;

			.banner {
				width: 100%;
				height: 100%;
			}

			.logistics-info {
				position: absolute;
				top: 50%;
				left: 160upx;
				transform: translateY(-50%);
				font-size: 30upx;
				color: #808080;
				
				.picker-Box {
					margin: 5upx 0;
					.title {
					padding: 5upx 0;
					display: flex;
					align-items: center;
					
						.trackingCompany {
							display: flex;
						}
					}
				}
				.desc {
					height: 80upx;
					overflow: hidden;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					// height: 34upx;
				}
				.order {
					margin: 5upx 30upx 5upx 0;
				}
			}
		}

		.logistics-track {
			padding: 32upx 45upx 0;
			min-height: calc(100vh - 224upx);

		}
	}
</style>
