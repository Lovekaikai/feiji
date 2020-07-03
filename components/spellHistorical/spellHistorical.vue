<template>
	<view class="spellhistorical">
		<view class="spellhistorical-top">
			<picker mode="date" @change="changeDate">
				<view class="spellhistorical-top-date">
					<view class="" style="margin-right: 18rpx;">
						<view class="iconfont icon-rili"></view>
					</view>
					<view>{{date}}</view>
				</view>
				
			</picker>
		</view>
		
		<view class="spellhistorical-list" v-if="historyList.length > 0">
			<view class="spellhistorical-list-item" v-for="(hItem, hidx) in historyList" :key='hidx'>
				<view class="spellhistorical-list-title">
					<view class="" style="flex: 1;">团名：{{hItem.title}}</view>
					<view class="" style="margin-left: 70rpx;width: 140rpx">{{hItem.groupCount}}人成团</view>
				</view>
				<view class="spellhistorical-list-table">
					<view class="table-header">
						<view class="item">买家</view>
						<view class="item">拼团状态</view>
						<view class="item2">拼团结果</view>
					</view>
					
					<view class="table-body" v-for="(hdeItem, hdeIdx) in hItem.detail" :key="hdeIdx">
						<view class="item">{{hdeItem.memberName || ''}}</view>
						<view class="item" :class="hdeItem.status === 1 ? 'success' : 'error'">{{hdeItem.status === 1 ? '拼中' : '拼不中'}}</view>
						<view class="item3">{{hdeItem.result || '拼团失败'}}</view>
					</view>
				</view>
			</view>
			<view class="noList" v-if="total > historyList.length" @tap='changPageNum'>---更多的数据---</view>
			<view class="noList" v-else>---没有更多的数据了---</view>
		</view>
		
		<view class="noList" v-else>---该日期没有拼团历史---</view>
	</view>
</template>

<script>
	export default {
		components: {
		},
		props: {
			historyList: {
				type: Array,
				default: []
			},
			date: {
				type: String,
				// default: this.$common.newDate(new Date)
			},
			total: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				// date: ''
			};
		},
		onLoad() {
			
		},
		mounted() {
			// this.date = this.$common.newDate(new Date)
			console.log(this.total)
		},
		methods: {
			changeDate (e) {
				this.$emit('changeHistoryDate', e.detail.value)
				// this.date = e.detail.value
			},
			// 下一页
			changPageNum() {
				this.$emit('changePage', 1)
			}
		}
	}
</script>

<style lang="less">
	.spellhistorical {
		.spellhistorical-top {
			height: 88rpx;
			align-items: center;
			display: flex;
			justify-content: center;
			color: #06B720;
			.spellhistorical-top-date {
				display: flex;
				align-items: center;
			}
		}
		.spellhistorical-list {
			max-height: 800rpx;
			overflow: auto;
			.spellhistorical-list-item {
				margin-top: 18rpx;
			}
			.spellhistorical-list-title {
				display: flex;
				font-size: 28rpx;
				color: rgba(51, 51, 51, 1);
				font-weight: bold;
			}
		}
		.spellhistorical-list-table {
			.table-header {
				display: flex;
				align-items: center;
				justify-content: space-around;
				color: rgba(51, 51, 51, 1);
				font-size: 26rpx;
				.item {
					margin: 15upx 10upx;
					flex:1;
					text-align: center;
					border-right: 2rpx solid #06B720;
				}
				.item2 {
					margin: 15upx 10upx;
					text-align: center;
					flex: 2;
				}
			}
			.table-body {
				height: 66rpx;
				display: flex;
				align-items: center;
				color: rgba(128, 128, 128, 1);
				font-size: 26rpx;
				border-top: 1upx solid #e4e1e1;
				view {
					margin: 15upx 10upx;
					text-align: center;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
				.item {
					flex: 1;
				}
				.success {
					color: rgba(48, 205, 0, 1);
				}
				.error {
					color: rgba(205, 0, 0, 1);
				}
				.item3 {
					flex: 2;
				}
			}
			// .table-body:last-child {
			// 	border: none;
			// }
		}
		.noList {
			text-align: center;
			font-size: 14px;
		}
	}
</style>
