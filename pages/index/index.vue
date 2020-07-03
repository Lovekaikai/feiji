<template>
	<view class="index">
		<yu-kefu position="3"></yu-kefu>
		<view v-show="IsSkelttion">
			<skeleton :SkelttionType="SkelttionType"></skeleton>
		</view>
		<view class="content" v-show="!IsSkelttion">
			<!-- 搜索组件 -->
			<seach-input></seach-input>

			<!-- 商品banner -->
			<view class="index-banner" v-if="carousels.length > 0">
				<swiper class="swiper" indicator-dots="true" indicator-color="#000000" indicator-active-color="#06B720" interval="2000"
				 duration="500" autoplay circular>
					<swiper-item v-for="(CarItem, carIdx) in carousels" :key="carIdx">
						<view class="swiper-item">
							<image :src="CarItem.image" mode="aspectFit" @tap="bannerGoProduct(carIdx)"></image>
						</view>
					</swiper-item>
				</swiper>

				<!-- 引入走马灯模块 -->
				<horse-lamp class="horse-lamp" :msgObj="msgObj" :msgOpacity="msgOpacity"></horse-lamp>
			</view>

			<!-- 服务栏 -->
			<!-- <service-bar></service-bar> -->

			<!-- 拼团福利 模块 -->
			<!-- <shopping-joint :activity-list="activityList" v-if="activityList.length > 0"></shopping-joint> -->

			<!-- 热推商品 -->
			

			<!-- 猜你喜欢 -->
			<!-- <guess-like :guess-likse-list="guessLikseList" @itemClick="handleitemClick" v-if="guessLikseList.length>0"></guess-like> -->

			<!-- 底部分类 -->
			<menu-nav :classify-title="classifyTitle" :list="classifyGoods" :current-index="currentIndex" @change="changeTitle"
			 :classify-empty="classifyEmpty"></menu-nav>

			<!-- 用户与回到顶部 -->
			<view class="index-ops">
				<!-- <view class="user"><image src="../../static/images/user.png" mode="" @tap="goUserInfo"></image></view> -->
				<view class="ops-goTop" @tap="top">
					<image src="../../static/images/goTop.png" mode="" v-if="topShow"></image>
				</view>
			</view>


			<!-- 版权 -->
			<copy-right :version="SDKVersion"></copy-right>
		</view>
	</view>
</template>

<script>
	import SeachInput from '@/components/index/SearchInput.vue'
	import HorseLamp from '@//components/horse-lamp/HorseLamp.vue'
	import ServiceBar from '@/components/index/ServiceBar.vue'
	import ShoppingJoint from '@/components/index/ShoppingJoint.vue'
	import GuessLike from '@/components/index/GuessLike.vue'
	import MenuNav from '@//components/index/MenuNav.vue'
	import CopyRight from '@/components/index/CopyRight.vue'
	import backTop from '@/components/back-top/back-top.vue';
	import throttle from '@/common/throttle.js';

	// 客服组件
	import yuKefu from '@/components/yu-kefu/yu-kefu.vue'

	import {
		displaySocketMsg
	} from '@/common/minxins/mixins.js'

	export default {
		components: {
			SeachInput,
			HorseLamp,
			ServiceBar,
			ShoppingJoint,
			GuessLike,
			MenuNav,
			CopyRight,
			backTop,
			yuKefu
		},
		mixins: [displaySocketMsg],
		data() {
			return {
				SkelttionType: 'index', // 骨架屏类型
				IsSkelttion: true,
				carousels: [], // 轮播图列表
				hotproducts: [], // 热推商品列表
				background: ['color1', 'color2', 'color3'],
				// indicatorDots: true,
				// autoplay: true,
				// interval: 2000,
				// duration: 500,
				topShow: false,
				pageLoading: 0,
				optionInfo: {
					share: ''
				},
				options: {},
				activityList: [], // 拼团活动列表
				guessLikseList: [], // 猜你喜欢
				classifyTitle: [], // 分类标题
				SDKVersion: "", // 小程序版本
				categoryRequest: {
					topCategoryId: "", // 顶级分类id
					pageNum: 1,
					pageSize: 10
				},
				total: 0, // 分类商品总数
				classifyGoods: [], // 分类商品列表
				currentIndex: 0, // 分类标题当前索引
				classifyEmpty: false // 控制是否分类内容为空
			};
		},
		onLoad(option) {
			this.options = option
			if (option.scene) {
				this.optionInfo = {
					share: this.getSearchString('share', decodeURIComponent(option.scene))
				};
			}

			this.getCarousel();
			this.getHotProduct();
			this.getClassifyTitle(); // 获取分类标题
			// 获取版本号
			const {
				SDKVersion
			} = uni.getSystemInfoSync()
			this.SDKVersion = SDKVersion
		},
		onShow() {
			this.pageLoading = !1
			if (this.options.scene) {
				this.options = {
					share: this.getSearchString('share', decodeURIComponent(this.options.scene))
				};
			}
			uni.setStorageSync('shareId', this.options.share)
			this.$common.loginGetToken(this.options.share).then()
			this.getActivityList(); // 获取拼团活动列表
			this.getGuessListList(); // 获取猜你喜欢里列表
			// this.getCarousel();
			// this.getHotProduct();
			// this.getClassifyTitle();  // 获取分类标题
		},
		methods: {
			getSearchString(key, Url) {
				// 获取URL中?之后的字符
				let str = Url;
				str = str.substring(0, str.length);
				// 以&分隔字符串，获得类似name=xiaoli这样的元素数组
				let arr = str.split('&');
				let obj = new Object();
				// 将每一个数组元素以=分隔并赋给obj对象
				for (let i = 0; i < arr.length; i++) {
					let tmp_arr = arr[i].split('=');
					obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
				}
				return obj[key];
			},
			// 跳转用户中心的事件
			goUserInfo: throttle.throttleFunc(function() {
				// console.log(1);
				let shareId = this.optionInfo.share;
				// this.$common.navigateTo('../profile/profile');
				this.$common.passUserauth(shareId).then(res => {
					// console.log(res);
					if (res) {
						this.$common.navigateTo('../profile/profile');
					} else {
						this.$common.navigateTo('../auth/auth?share=' + shareId + '&isAuth=2');
					}
				});
			}, 1500),
			// 回到顶部
			top() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},
			// 获取banner图
			getCarousel() {
				this.$common.getNoToken('common-goods/upMall/uncalibrated/carousel').then(res => {
					if (res.data.code === 200200) {
						let textList = res.data.data
						for (let i = 0; i < textList.length - 1; i++) {
							console.log("i=" + textList[i])
							for (let j = 0; j < textList.length - i - 1; j++) {
								console.log("j=" + textList[j]);
								console.log("j+1=" + textList[j + 1]);
								if (textList[j].index > textList[j + 1].index) {
									//把大的数字放到后面
									let swap = textList[j];
									textList[j] = textList[j + 1];
									textList[j + 1] = swap;
								}
							}
						}
						this.carousels = textList.reverse()
						// console.log(this.carousels)
						// 隐藏骨架屏
						this.IsSkelttion = false
					} else {
						this.carousels = [];
					}
				});
			},
			// 获取商品数据
			getHotProduct() {
				this.$common.getNoToken('common-goods/upMall/uncalibrated/hotPush').then(res => {
					if (res.data.code === 200200) {
						this.hotproducts = res.data.data;
					} else {
						this.hotproducts = [];
					}
				});
			},
			// 跳转到商品详情页
			goProduct(idx) {
				this.$common.navigateTo('../product/product?spu=' + this.hotproducts[idx].spuId + '&sku=' + this.hotproducts[idx].skuId);
			},
			// banner图跳转到商品详情页
			bannerGoProduct(idx) {
				this.$common.navigateTo('../product/product?spu=' + this.carousels[idx].spuId);
			},

			// 获取活动列表数据
			getActivityList() {
				this.$common.httpGet('common-goods/upMall/groupon/listView/1').then(res => {
					// console.log(res)
					const {
						code,
						data
					} = res.data
					if (code === 200200) this.activityList = data.slice(0, 3)
				})
			},

			// 获取猜你喜欢列表数据 -- 目前先显示8个
			getGuessListList() {
				this.$common.httpGet('common-goods/upMall/uncalibrated/related/8').then(res => {
					// console.log(res)
					const {
						code,
						data
					} = res.data
					if (code === 200200) this.guessLikseList = data
				})
			},

			// 获取分类标题
			getClassifyTitle() {
				this.$common.httpGet('common-goods/upMall/category/top').then(res => {
					const {
						code,
						data
					} = res.data
					if (code === 200200) this.classifyTitle = data
					this.changeTitle(0) // 初始化默认选中第一个分类title
				})
			},

			// 切换分类标题触发
			changeTitle(index) {
				this.classifyGoods = [] // 每次点击要初始化classifyGoods列表值
				this.categoryRequest.pageNum = 1 // 每次点击要初始化当前页为1
				this.currentIndex = index
				this.categoryRequest.topCategoryId = this.classifyTitle[index].categoryId
				this.getClassifyGoods() // 每次点击获取对应的分类商品列表
			},

			// 获取分类商品
			getClassifyGoods() {
				this.$common.httpGet('common-goods/upMall/category/includeGoods', this.categoryRequest).then(res => {
					let {
						code,
						data
					} = res.data
					if (code === 200200) {
						this.classifyEmpty = data.list.length > 0 ? false : true // 有数据则隐藏空 无则显示空
						this.total = data.total // 分类商品的总数
						// 旧数据
						let oldclassifyGoods = this.classifyGoods;
						//新数据
						const newclassifyGoods = data.list;
						// 新旧数据合并
						this.classifyGoods = [...oldclassifyGoods, ...newclassifyGoods]
					}
				})
			}
		},
		onPageScroll(e) {
			if (e.scrollTop > 400) {
				this.topShow = true;
			} else {
				this.topShow = false;
			}
		},
		onReachBottom() {
			// 检查是否有还有下一页
			const totalPageNum = Math.ceil(this.total / this.categoryRequest.pageSize);
			if (this.categoryRequest.pageNum < totalPageNum) {
				this.categoryRequest.pageNum++;
				this.getClassifyGoods();
			}
		}
	};
</script>

<style lang="less" scoped>
	.index {
		background: #f2f2f2;
		width: 100vw;

		.index-banner {
			position: relative;

			.swiper {
				width: calc(100vw);
				height: 480rpx;
				background: #fff;

				.swiper-item {
					display: block;

					// height: 750rpx;
					// line-height: 100%;
					// text-align: center;
					image {
						width: 100%;
						height: 480rpx;
					}
				}
			}

			.horse-lamp {
				position: absolute;
				top: 40upx;
				left: 32upx;
			}
		}

		.index-hot {
			margin-top: 47upx;

			.index-hot-title {
				color: #333;
				font-size: 32rpx;
				font-weight: bold;
				padding-left: 32rpx;
				margin-bottom: 26upx;
			}

			.index-hot-commodity {
				.product {
					background: #fff;
					padding: 20upx;

					&:not(:last-child) {
						border-bottom: 1px solid #eee;
					}

					.product-img {
						width: 100%;
						height: 750rpx;

						// padding-top: 10rpx;
						image {
							width: 100%;
							height: 100%;
						}
					}

					.product-desc {
						padding: 22upx 32upx 40upx;
						background-color: #fff;

						.product-name {
							color: #000000;
							font-size: 28rpx;
							font-weight: bold;
						}

						.product-describe {
							color: #808080;
							font-size: 24rpx;
							margin: 20upx 0 36upx 0;
						}

						.product-ops {
							display: flex;
							justify-content: space-between;
							align-items: center;
							font-size: 24upx;

							.price {
								color: #06B720;

								>text {
									font-size: 32upx;
									font-weight: bold;
									margin-left: 6upx;
								}
							}

							.purchase {
								width: 89upx;
								height: 48upx;
								line-height: 48upx;
								border-radius: 6upx;
								color: #06B720;
								border: 1px solid #06B720;
								text-align: center;
							}
						}
					}
				}
			}
		}

		.index-ops {
			position: fixed;
			bottom: 80rpx;
			right: 30rpx;

			.user {
				width: 100rpx;
				height: 100rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.ops-goTop {
				margin-top: 14rpx;
				width: 100rpx;
				height: 100rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>
