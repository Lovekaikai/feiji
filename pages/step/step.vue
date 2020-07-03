<template>
	<view class="content">

		<view class="message">
			<image style="width: 100%;" src="https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/4/13/a593254a-d1af-45b2-b5e6-714c88d11b8e.png"
			 mode="widthFix"></image>
			<view class="text">
				<view class="top"><text style="color: #999999;font-size: 28upx;">物流公司：</text>{{alidata2.information.expName}}</view>
				<view class="top"><text style="color: #999999;font-size: 28upx;">快递单号：</text>{{alidata2.information.no}}</view>
			</view>
		</view>

		<ali :state="alidata2.state" :datas="alidata2.data" :ways="alidata2.information"></ali>
	</view>
</template>

<script>
	import ali from '../../components/WuLiu-step.vue';
	export default {
		components: {
			ali
		},
		data() {
			return {
				alidata2: {
					state: 3,
					uptime: '2019-05-24 10:58:24',
					data: [],
					information: {
						no: '70939995911523',
						sName: 'HTKY',
						expName: '百世快递(原汇通)',
						url: 'http:www.htky365.com',
						tel: '021-62963636',
						img: 'https:oss-cn2.apistore.cnexpHTKY.png'
					}
				}
			};
		},
		onLoad() {
			this.init();
			
			let info={
				nu: "776002878782410",
				ischeck: 1,
				com: "shentong",
				company: "申通快递",
				status: 200,
				state: 3,
			}
			this.alidata2.information={
				no: info.nu,
				sName:  info.nu,
				expName:info.company
			}
			let arr =[{
			"ftime": "2020-04-09 18:41:45",
			"context": "已签收,签收人是（北和中学旁边申通快递）先生/女士，如有疑问请联系派件员北和服务点(18820642125,0759-8595196)，如您未收到此快递，请拨打投诉电话：02022505286，感谢使用申通快递，期待再次为您服务"
		}, {
			"ftime": "2020-04-09 18:10:01",
			"context": "派送不成功-原因：超派件,客户自取"
		}, {
			"ftime": "2020-04-09 17:55:10",
			"context": "广东雷州北和镇服务点-北和服务点(18820642125,0759-8595196)-派件中"
		}, {
			"ftime": "2020-04-09 16:59:25",
			"context": "已到达-广东雷州北和镇服务点"
		}, {
			"ftime": "2020-04-09 10:11:59",
			"context": "广东雷州公司-已发往-广东雷州北和镇服务点"
		}, {
			"ftime": "2020-04-08 17:00:57",
			"context": "广东湛江转运中心-已发往-广东雷州公司"
		}, {
			"ftime": "2020-04-08 16:45:16",
			"context": "已到达-广东湛江转运中心"
		}, {
			"ftime": "2020-04-08 08:29:00",
			"context": "广东中山转运中心-已发往-广东湛江转运中心"
		}, {
			"ftime": "2020-04-08 08:29:00",
			"context": "广东中山转运中心-已进行装车扫描"
		}, {
			"ftime": "2020-04-08 08:21:50",
			"context": "快件已在【广东中山转运中心】进行卸车，扫描员【熊素素】"
		}, {
			"ftime": "2020-04-08 08:21:50",
			"context": "已到达-广东中山转运中心"
		}, {
			"ftime": "2020-04-08 05:04:05",
			"context": "广东广州转运中心-已装袋发往-广东中山转运中心"
		}, {
			"ftime": "2020-04-08 05:04:05",
			"context": "广东广州转运中心-已进行装车扫描"
		}, {
			"ftime": "2020-04-08 04:44:50",
			"context": "已到达-广东广州转运中心"
		}, {
			"ftime": "2020-04-06 20:18:44",
			"context": "陕西西安转运中心-已装袋发往-广东广州转运中心"
		}, {
			"ftime": "2020-04-06 20:18:44",
			"context": "陕西西安转运中心-已进行装车扫描"
		}, {
			"ftime": "2020-04-06 20:14:32",
			"context": "快件已在【陕西西安转运中心】进行卸车，扫描员【大件13号】"
		}, {
			"ftime": "2020-04-06 20:14:32",
			"context": "已到达-陕西西安转运中心"
		}, {
			"ftime": "2020-04-05 20:30:31",
			"context": "宁夏银川转运中心-已装袋发往-陕西西安转运中心"
		}, {
			"ftime": "2020-04-05 20:30:31",
			"context": "宁夏银川转运中心-已进行装车扫描"
		}, {
			"ftime": "2020-04-05 20:30:30",
			"context": "宁夏银川转运中心-已装袋发往-广东中山转运中心"
		}, {
			"ftime": "2020-04-05 20:19:14",
			"context": "宁夏银川转运中心-已装袋发往-广东中山转运中心"
		}, {
			"ftime": "2020-04-05 20:13:26",
			"context": "宁夏银川转运中心-已装袋发往-广东中山转运中心"
		}, {
			"ftime": "2020-04-05 20:13:26",
			"context": "宁夏银川转运中心-已进行装袋扫描"
		}, {
			"ftime": "2020-04-05 20:13:04",
			"context": "宁夏银川转运中心-已装袋发往-广东中山转运中心"
		}, {
			"ftime": "2020-04-05 19:34:39",
			"context": "已到达-宁夏银川转运中心"
		}, {
			"ftime": "2020-04-05 18:45:38",
			"context": "宁夏银川老城营业厅-已发往-宁夏银川转运中心"
		}, {
			"ftime": "2020-04-05 15:52:08",
			"context": "宁夏银川老城营业厅-老康(18295599517)-已收件"
		}]
		
		for (let s of arr) {
			this.alidata2.data.push({
				time: s.ftime,
				remark:s.context
			})
		}
	},
	methods: {
		init() {}
	}
	};
</script>

<style lang="less">
	.message {
		position: relative;

		.text {
			font-size: 26upx;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			width: 80%;
			margin-left: 150rpx;
			// text-align: center;
		}
	}
</style>
