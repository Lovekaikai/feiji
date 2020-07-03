<template>
	<view class="membersList">
		 <view class="header">
			 团名：24h保温电水壶
		 </view>
		 <view class="List">
			<view class="List-header">
				<view class="item">List</view>
				<view class="item">成交时间</view>
				<view class="item">数量</view>
			</view>
			<view class="List-body" v-for="(item,index) in 10" :key="index">
				<view class="item">阿狸阿狸不讲...</view>
				<view class="item">2020/09/09 13:12</view>
				<view class="item">10</view>
			</view>
		 </view>
	</view>
</template>

<script>
</script>

<style lang="less">
	.membersList{
		min-height: 100vh;
		background: rgb(247, 247, 247);
		padding:  0 30upx;
	
		.header{
			padding: 30upx 0;
			font-size:28upx;
			font-family:PingFang SC;
			font-weight:bold;
			color:rgba(51,51,51,1)
		}
		.List{
				background: #fff;
				.List-header{
					justify-content: space-around;
					display: flex;
					align-items: center;
						font-size:28upx;
						border-bottom: 1upx solid #e4e1e1;
						
					.item{
						padding: 15upx 10upx;
						flex:1;
						text-align: center;
					
					}
				}
				.List-body{
					justify-content: space-around;
					display: flex;
					align-items: center;
					color:rgba(128,128,128,1);
					font-size:26upx;
					border-bottom: 1upx solid #e4e1e1;
					.item{
						padding: 15upx 10upx;
						flex:1;
						text-align: center;
					
					}
					.item:first-child{
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
						
						// width: 100%;
					}
					.item:nth-child(2){
						font-size:20upx;
					}
				}
				.List-body:last-child{
					border: none;
				}
		}
	}
</style>