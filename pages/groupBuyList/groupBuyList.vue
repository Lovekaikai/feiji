<template>
	<view class="group-buy-list">
		<view class="group">
			<view class="group-item" v-for="(item,index) in groupList" :key="index">
				<view class="header">
					<view class="left-wrap">
						<view class="avatar-wrap">
							<view class="first-avatar">
								<image :src="item.commander"></image>
								<view class="first-desc">团长</view>
							</view>
							<image class="member" :style="{'zIndex': item.memberList.length-subIndex}"
							:src="subItem" v-for="(subItem,subIndex) in item.memberList" :key="subIndex"></image>
						</view>
						<view class="commander">团长: <text class="name">{{item.name}}</text></view>
					</view>
					<my-button desc="去参团"></my-button>
				</view>
				<view class="down">
					<view class="desc">进度:</view> 
					<progress-bar :sold="item.progress" :width="'100%'" class="progress"></progress-bar>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import ProgressBar from '@/components/progress-bar/ProgressBar.vue'
import MyButton from '@/components/my-button/MyButton.vue'
export default {
	components: {
		ProgressBar,
		MyButton
	},
	data() {
		return {
			groupList: [
				{
					commander: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1588999972098&di=d8c4ee8fb32885e02ce3778285babba6&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201901%2F11%2F20190111151159_gwcmx.thumb.700_0.jpg",
					name: "一朵白云",
					progress: "56%",
					memberList: [
						"https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1341147932,2840502924&fm=26&gp=0.jpg",
						"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1589000143585&di=b14d92161a5fe27e2ffd4f9a675405ec&imgtype=0&src=http%3A%2F%2Fimg3.duitang.com%2Fuploads%2Fitem%2F201504%2F08%2F20150408H0205_ymHYZ.jpeg"
					]
				},
				{
					commander: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1588999972098&di=d8c4ee8fb32885e02ce3778285babba6&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201901%2F11%2F20190111151159_gwcmx.thumb.700_0.jpg",
					name: "平安健康快乐",
					progress: "79%",
					memberList: [
						"https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1341147932,2840502924&fm=26&gp=0.jpg",
						"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1589000143585&di=b14d92161a5fe27e2ffd4f9a675405ec&imgtype=0&src=http%3A%2F%2Fimg3.duitang.com%2Fuploads%2Fitem%2F201504%2F08%2F20150408H0205_ymHYZ.jpeg"
					]
				},
				{
					commander: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1588999972098&di=d8c4ee8fb32885e02ce3778285babba6&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201901%2F11%2F20190111151159_gwcmx.thumb.700_0.jpg",
					name: "双莉真好野",
					progress: "40%",
					memberList: [
						"https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1341147932,2840502924&fm=26&gp=0.jpg",
						"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1589000143585&di=b14d92161a5fe27e2ffd4f9a675405ec&imgtype=0&src=http%3A%2F%2Fimg3.duitang.com%2Fuploads%2Fitem%2F201504%2F08%2F20150408H0205_ymHYZ.jpeg"
					]
				}
			]
		}
	}
}
</script>

<style lang="less" scoped>
.group-buy-list {
	height: 100vh;
	background: #f7f7f7;
	padding: 0 32upx;
	.group {
		padding-top: 67upx;
		.group-item {
			background-color: #fff;
			padding: 20upx 24upx;
			&:not(:last-child) {
				margin-bottom: 66upx;
			}
			.header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 28upx;
				.left-wrap {
					display: flex;
					align-items: center;
					.avatar-wrap {
						display: flex;
						margin-right: 27upx;
						.first-avatar {
							position: relative;
							z-index: 10;
							width: 95upx;
							height: 95upx;
							border-radius: 50%;
							border: 3upx solid #E70202;
							overflow: hidden;
							margin-top: -48upx;
							image {
								width: 100%;
								height: 100%;
								border-radius: 50%;
							}
							.first-desc {
								position: absolute;
								
								width: 100%;
								bottom: 0;
								font-size: 19upx;
								color: #fff;
								background-color: #E70202;
								text-align: center;
							}
						}
						.member {
							position: relative;						
							width: 48upx;
							height: 48upx;
							border-radius: 50%;
							margin-left: -10upx;
						}					
					}
					.commander {
						font-size: 26upx;
						color: #333;
						.name {
							padding-left: 18upx;
						}
					}
				}
			}
			.down {
				display: flex;
				align-items: center;
				.desc {
					position: relative;
					top: -4upx;
					font-size: 26upx;
					color: #333;
					margin-right: 16upx;
				}
				.progress {
					flex: 1;
				}
			}
		}
	}
}
</style>
