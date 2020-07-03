<template>
	<view  class="SkelttionBox">
		<!-- 首页的骨架屏  start -->
		<view v-if="SkelttionType=='index'" class="SkelttionIndexBox">
			<view class="IndexBoxBanner"></view>
			<view class="IndexBoxMenu">
				<!-- <view class="IndexBoxMenuList" v-for="(items,indexs) in 2" :key="indexs">
					<view class="MenuItemBox" v-for="(item,index) in 5" :key="index">
						<view class="MenuItem"></view>
						<view class="MenuName"></view>
					</view>  
				</view> -->
				<view class="IndexBoxMenuList">
					<view class="MenuItem" v-for="index in 3" :key="index"></view>
				</view>
			</view>
			<view class="IndexBoxMain">
				<view class="boxItem" v-for="index in 3" :key="index"></view>
			</view>
		</view>
		<!-- 首页的骨架屏   end -->
		<!-- 详情页骨架屏  start -->
		<view v-else-if="SkelttionType=='prouct'" class="SkelttionProuctBox">
			<view class="ProuctBanner">
				<view class="ProuctNav">
					<view class="NavItem"></view>
					<view class="NavItem"></view>
				</view>
			</view>
			<view class="ProuctInfo"></view>
			<view class="ProuctPrice">
				<view class="PriceLeft"></view>
				<view class="PriceCenter"></view>
				<view class="PriceRight"></view>
			</view>
			<view class="Concessions">
				<view class="ConcessionsItem"></view>
			</view>
			<view class="CommentBox">
				<view class="CommentList">
					<view class="UserLogo"></view>
					<view class="UsrtInfo">
						<view class="UserName"></view>
						<view class="UserComment"></view>
					</view>
				</view>
			</view>
		</view>
		<!-- 详情页骨架屏  end -->
		
		<!-- 个人中心骨架屏  start -->
		<view v-else-if="SkelttionType=='member'" class="SkelttionMember">
			<view class="MemberBox">
				<view class="UserBox">	
					<view class="UserInfoBox">
						<view class="UserLogo"></view>
						<view class="UserName"></view>
					</view>
				</view>
			</view>
			<view class="OrderBox"></view>
			<view class="UserSetBox" v-for="index in 3" :key="index"></view>
		</view>
		<!-- 个人中心骨架屏   end -->
		
		<!-- 商品分类  start -->
		<view v-else-if="SkelttionType=='classify'" class="SkelttionClassify">
			<view class="ClassifyLeft"></view>
			<view class="ClassifyRight">
				<view class="ClassifyList" v-for="(items,indexs) in 2" :key="indexs">
					<view class="ClassifyListName"></view>
					<view class="ClassifyItemBox">
						<view class="ItemBox" v-for="(item,index) in 4*(indexs+2)" :key="index">
							<view class="ItemLogo"></view>
							<view class="ItemName"></view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 商品分类   end -->
		
		<!-- 邀请分享骨架屏 start -->
		<view v-else-if="SkelttionType=='joinItem'" class="SkelttionJoinItem">
			<view class="joinItemGoods">
				<view class="good-img"></view>
				<view class="good-info">
					<view class="good-name"></view>
					<view class="good-price"></view>
				</view>
			</view>
			<view class="joint-desc">
				<view class="desc-1"></view>
				<view class="desc-2"></view>
				<view class="desc-3"></view>
				<view class="desc-4"></view>
				<view class="desc-5"></view>
			</view>
			<view class="goods-list">
				<view class="good-item" v-for="index in 6" :key="index"></view>
			</view>
			<!-- <view class="ClassifyRight">
				<view class="ClassifyList" v-for="(items,indexs) in 2" :key="indexs">
					<view class="ClassifyListName"></view>
					<view class="ClassifyItemBox">
						<view class="ItemBox" v-for="(item,index) in 4*(indexs+2)" :key="index">
							<view class="ItemLogo"></view>
							<view class="ItemName"></view>
						</view>
					</view>
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			SkelttionType:{
				type:String,
				default:'index'
			}
		},
		data(){
			return{
				
			}
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
	// #f3f4f6
	.SkelttionBox,.SkelttionProuctBox,.SkelttionMember{
		display: flex;flex-direction: column;align-items: center;background: #fff;
	}
	// 首页骨架屏start
	.SkelttionIndexBox{
		width:92vw;display: flex;flex-direction: column;align-items: center;background: #fff;margin-top:20rpx;
		.IndexBoxBanner{
			width:100%;height: 300rpx;background: #f3f4f6 ;border-radius: 10rpx;
		}
		.IndexBoxMenu{
			width:100%;display: flex;align-items: center;flex-direction: column;
			.IndexBoxMenuList{display: flex;width:100%;justify-content: space-between;margin-top:20rpx;margin: 30upx 0;}
			.MenuItem{width:30%;height:50rpx;background: #f3f4f6;}
		}
		.IndexBoxMain{
			width:100%;display: flex;align-items: center;flex-direction: column;
			.boxItem {
				width:100%;height: 200rpx;background: #f3f4f6;margin-bottom: 25upx;
			}
		}
	}
	// 首页骨架屏end
	
	// 详情页骨架屏start
	.SkelttionProuctBox{
		.ProuctBanner{
			width:100vw;height: 640rpx;background: #f3f4f6;
			.ProuctNav{
				width:100%;height: 120rpx;display: flex;justify-content: space-between;align-items: center;box-sizing: border-box;padding:0px 30rpx;
				.NavItem{
					width:80rpx;height: 80rpx;background: #82848a;border-radius: 100%;opacity: 0.2;
				}
			}
		}
		.ProuctInfo{
			width:92vw;height: 100rpx;background: #f3f4f6;border-radius: 10rpx;margin-top:20rpx;
		}
		.ProuctPrice{
			width:92vw;display: flex;justify-content: space-between;align-items: center;margin-top: 20rpx;
			.PriceLeft,.PriceCenter,.PriceRight{
				width:160rpx;height: 20rpx;border-radius: 10rpx;background: #f3f4f6;
			}
		}
		.Concessions{
			width:100%;height: 100rpx;margin-top:40rpx;border-top:20rpx solid #f3f4f6;border-bottom:20rpx solid #f3f4f6;margin-top:30rpx;
		}
		.CommentBox{
			width:92vw;height: 140rpx;margin-top:30rpx;display: flex;align-items: center;
			.CommentList{
				display: flex;
				.UserLogo{
					width:100rpx;height: 100rpx;border-radius: 100%;background: #f3f4f6;margin-right:20rpx;
				}
				.UsrtInfo{
					display: flex;flex-direction: column;justify-content: center;height: 100rpx;
					.UserName{ width:160rpx;height: 20rpx;background: #f3f4f6;border-radius: 20rpx;}
					.UserComment{ width:360rpx;height: 20rpx;background: #f3f4f6;border-radius: 20rpx;margin-top:20rpx}
				}
				
			}
			
		}
	}
	
	// 详情页骨架屏end
	
	// 个人中心骨架屏 start
	.SkelttionMember{
		padding-bottom: 40upx;
		.MemberBox{width:100vw;height: 340rpx;background: #f3f4f6;display: flex;box-sizing: border-box;justify-content: center;align-items: center;
			.UserBox{height: 100rpx;display: flex;align-items: center;justify-content: space-between;
				.UserInfoBox{display: flex;flex-direction: column;align-items: center;justify-content: center;
					.UserLogo{width:120rpx;height: 120rpx;background: #c8c9cc ;opacity: 0.8;border-radius: 50%;}
					.UserName{margin-top:20rpx}
				}
				.UserSet,.UserName{width:100rpx;height: 20rpx;border-radius: 16rpx;background: #c8c9cc ;opacity: 0.8;}
			}
			
		}
		.OrderBox{
			width:92vw;height: 60rpx;background: #f3f4f6;border-radius: 10rpx;margin-top:20rpx;
		}
		.UserSetBox{
			width:92vw;height: 200rpx;background: #f3f4f6;margin-top:20rpx;border-radius: 10rpx;box-sizing: border-box;padding:20rpx;display: flex;align-items: center;justify-content: center;
		}
	}
	//个人中心骨架屏 end
	// 分类骨架屏  start
	.SkelttionClassify{
		width:100vw;height: 100vh;
		.ClassifyLeft{width:20vw;height: 100%;background: #f3f4f6;}
		.ClassifyRight{width:77vw;height: 100%;background:rgba(244,244,245,0.4) ;box-sizing: border-box;padding:40rpx 20rpx;
			.ClassifyList{margin-bottom:40rpx}
			.ClassifyListName{width:200rpx;height: 18rpx;background:rgba(200,201,204,0.6);border-radius: 10rpx;}
			.ClassifyItemBox{display: flex;flex-wrap: wrap;justify-content: space-between;}
			.ItemBox{margin-top:20rpx;width:120rpx;display: flex;flex-direction: column;justify-content: center;align-items: center;}
			.ItemLogo{width:100%;height: 120rpx;background:rgba(200,201,204,0.6);border-radius: 10rpx;margin-bottom:10rpx}
			.ItemName{width:80rpx;height: 16rpx;background: rgba(200,201,204,0.6);border-radius: 10rpx;}
		}
	}
	// 分类骨架屏  end
	
	// 邀请分享骨架屏 start
	.SkelttionJoinItem {
		width:100vw;height: 100vh;display: flex;flex-direction: column;
		.joinItemGoods{width:100%;height:216rpx;background: #f3f4f6;display: flex;padding: 23upx 32upx;box-sizing: border-box;
			.good-img{width: 172upx;height: 172upx;background-color: #ddd;}
			.good-info{flex:1;display: flex;flex-direction: column;justify-content: space-between;padding-left: 20upx;
				.good-name{width: 100%;height: 50upx;background-color: #ddd;}
				.good-price{width: 200upx;height: 20upx;background-color: #ddd;}
			}
		}
		.joint-desc{width:100%;height:405rpx;background: #f3f4f6;display: flex;flex-direction: column;justify-content: center;margin:20upx 0;align-items: center;
			.desc-1 {width: 400upx;height: 40upx;background-color: #ddd;}
			.desc-2 {width: 400upx;height: 40upx;background-color: #ddd;margin: 36upx 0 26upx 0;}
			.desc-3 {width: 200upx;height: 25upx;background-color: #ddd;}
			.desc-4 {width: 500upx;height: 80upx;background-color: #ddd;border-radius: 40upx;margin: 30upx 0 30upx 0;}
			.desc-5 {width: 520upx;height: 20upx;background-color: #ddd;}
		}
		.goods-list {width: 100%;height: 500upx;background: #f3f4f6;display: flex;justify-content: space-around;flex-wrap: wrap;padding: 40upx 0;
			.good-item{width: 208upx;height: 208upx;background: #ddd;}
		}
	}
</style>
