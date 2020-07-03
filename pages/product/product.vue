<template>
	<view class="product">
		<yu-kefu position="3"></yu-kefu>
		<!-- <uni-nav-bar :status-bar="true" background-color="#FFFFFF" color="#000000" left-icon="arrowleft" title="详情"
		 :shadow="false" fixed="true" @click-left="back" /> -->
		<!-- 商品轮播图 -->
		<view class="product-banner">
			<view class="" v-if="!productImgShow && productVideo.length > 0">
				<view class="" v-for="(video, vidx) in productVideo" :key="vidx">
					<video id="myVideo" :src="video.image" style="width: 100%;height: 750rpx;" loop></video>
				</view>
			</view>

			<swiper class="swiper" :indicator-dots="true" indicator-color="#000000" indicator-active-color="#06B720" interval="2000"
			 duration="500" v-else>
				<swiper-item v-for="(proimg, pgIdx) in productImgs" :key="pgIdx">
					<view class="swiper-item">
						<image :src="proimg.image" mode="aspectFit"></image>
					</view>
				</swiper-item>
			</swiper>

			<view class="productImgShow" @tap="productImgShow = !productImgShow" v-if="productVideo.length > 0">{{ productImgShow ? '视频' : '图片' }}</view>
		</view>
		<view class="product-con">
			<!-- 商品价格 -->
			<view class="product-con-price">
				<view class="price-show">
					<text class="price-tip">¥</text>
					<text class="price" style="margin-left: 8rpx;">{{ discountsInfo.minBuyPrice >= 0 ? discountsInfo.minBuyPrice : primaryPrice }}</text>
				</view>
				<view class="price-decortion" v-if="discountsInfo.minBuyPrice != primaryPrice">
					<text class="price-tip">¥</text>
					<text class="price" style="margin-left: 8rpx;">{{ primaryPrice }}</text>
				</view>
			</view>
			<view class="product-upgrade" v-if="userInfo && userInfo.userLevel != 6">
				<view class="product-upgrade-title">升级更高头衔可享受更大折扣，只需</view>
				<view class="product-upgrade-num">
					<text style="font-size: 24rpx;">￥</text>
					<text style="font-size: 30rpx;">{{ discountsInfo.maxDiscountsPrice || 0.0 }}</text>
				</view>
				<view class="product-upgrade-button" @tap="goMemberShip">立即升级</view>
			</view>
			<!-- 商品名称及销量、库存 -->
			<view class="product-goodName">
				<view class="title">{{ spuName }}</view>
				<view class="product-goodName-right">
					<view class="item item1">
						<view class="num">{{ sales > 100000 ? '10万+' : sales }}</view>
						<view class="title" style="text-align: center;">累计销量</view>
					</view>
					<view class="" style="height: 100%;background-color: rgba(128, 128, 128, 1);width: 1px;"></view>
					<view class="item">
						<view class="num">{{ stock }}</view>
						<view class="title1">库存</view>
					</view>
				</view>
			</view>
			<view class="product-story" @tap="$refs.story.open()">
				<view class="" style="margin-left: 8px;">查看商品背后的故事</view>
				<view class="">
					<uni-icons type="arrowright" size="14" color="#BB9267"></uni-icons>
					<!-- <icon type="arrowthinright" size="14"></icon> -->
				</view>
			</view>
			<!-- 推荐理由 -->
			<view class="product-recommend" v-if="explain.length > 0">
				<view class="product-recommend-1">
					<view class="recommend-img">
						<image src="../../static/images/recommend.png" mode=""></image>
					</view>
					<view class="recommend-title">推荐理由</view>
				</view>
				<view class="product-recommend-2">
					<view class="title" v-for="(exItem,exIdx) in explain" :key='exIdx'>{{ exItem }}</view>
					<!-- <view class="title">② 安全无害，老幼适宜</view>
					<view class="title">② 杀菌消毒，效果显著</view> -->
				</view>
			</view>

			<!-- 分享 -->
			<view class="product-share" @tap="open">
				<view class="iconfont icon-fenxiang1" style="font-size: 50rpx;margin-left: 16rpx;"></view>
				<!-- <image src="../../static/images/share.png" mode=""></image> -->
			</view>
		</view>

		<!-- 选择规格及服务说明 -->
		<view class="product-Specification">
			<view class="item specification" @tap="tapSpec">
				<view class="">
					<text class="">规格：</text>
					
					<text class="selected-text" v-for="(sItem, sIndex) in specList" :key="sIndex">{{ sItem.name }}:{{spcValues[sIndex]}}<text v-if="sIndex <specList.length-1">;</text></text>
				</view>
				<view class="">
					<uni-icons type="arrowright" size="14" color="#BB9267"></uni-icons>
				</view>
			</view>
			<view class="item specification" v-if="spuExtraInfo.deliveryCommitment">
				<view class="">
					<text class="">发货时间：</text>
					<text class="">{{ spuExtraInfo.deliveryCommitment }}</text>
				</view>
			</view>
			<view class="item">
				<view class="">
					<text class="">服务说明：</text>
					<text class="">{{ spuExtraInfo.serviceNote }}</text>
				</view>
			</view>
		</view>

		<!-- 商品详情图片 -->
		<view class="product-particulars">
			<view class="product-particulars-title">商品详情</view>
			<view class="product-rich" v-if="spuExtraInfo.introduction">
				<rich-text :nodes="richtext"></rich-text>
			</view>
			<view class="product-particulars-img" v-for="(detailItem, didx) in detailImage" :key="didx" v-else>
				<image :src="detailItem.image" mode="widthFix"></image>
			</view>
			
		</view>

		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image :src="specDetail.image"></image>
					<view class="right">
						<text class="price">¥ {{ specDetail.price }}</text>
						<text class="stock">库存：{{ specDetail.stock }}件</text>
						<view class="selected">
							<text>已选：</text>
							<text v-for="(specItem, sepcIdx) in specList" :key='specItem'>
								<text v-for="(sonItem1, sonIdx1) in specChildList[sepcIdx]" :key='sonIdx1' v-if="sonItem1.selected">{{sonItem1.specValue}};</text>
							</text>
							<!-- <text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">{{ sItem.specValue }}</text> -->
						</view>
					</view>
				</view>
				<view class="con_count ">
					<view class="item">购买数量</view>
					<view class="item">
						<uni-number-box disabled="false" :min="1" @change="bindChange" :max="specDetail.stock" :value="num" v-if="Number(spuId) === 270 || Number(spuId) === 292"></uni-number-box>
						<uni-number-box  :min="1" @change="bindChange" :max="specDetail.stock" :value="num" v-else></uni-number-box>
					</view>
				</view>

				<view v-for="(item, index) in specList" :key="index" class="attr-list">
					<text>{{ item.name }}</text>
					<view class="item-list">
						<text v-for="(childItem, childIndex) in specChildList[index]" :key="childIndex" class="tit" :class="{ selected: childItem.selected }"
						 @click="selectSpec(childIndex, index, childItem.specValueId, childItem.specValue)">
							{{ childItem.specValue }}
						</text>
					</view>
				</view>
				<view class="attr-content-ops" v-if="specDetail.stock > 0 && bottomShow === false">
					<view class="shoppingCart" @tap="attrOps(1)">加入购物车</view>
					<view class="purchase" @tap="attrOps(2)">立即购买</view>
				</view>
				<button class="btn" v-if="specDetail.stock > 0 && bottomShow === true" @click="attrConfirm">完成</button>
				<button class="btn1" v-if="specDetail.stock === 0" disabled="true" @click="toggleSpec">暂无库存请重新选择</button>
			</view>
		</view>

		<!-- 底部：加入购物车、去往首页等 -->
		<view class="product-bottom">
			<view class="" style="display: flex;">
				<view class="iconImg" @click="goUserInfo">
					<view class="iconfont icon-mine-gray" style="font-size: 48rpx; color: #06B720;"></view>
				</view>
				<view class="iconImg" style="margin-left: 40rpx;" @click="goIndex">
					<view class="iconfont icon-yemian-copy-copy" style="font-size: 48rpx; color: #06B720;"></view>
				</view>
			</view>

			<view class="iconImg" style="margin-left: 40rpx;" @tap="goshoppingCart">
				<view class="iconfont icon-gouwuche" style="font-size: 48rpx; color: #06B720;"></view>
			</view>
			<view class="cart" @tap="bottomOps(0)">加入购物车</view>
			<view class="purchase" @tap="bottomOps(1)">立即购买</view>
		</view>

		<!-- 回到顶部 -->
		<view class="index-ops">
			<view class="ops-goTop" @tap="top">
				<image src="../../static/images/goTop.png" mode="" v-if="topShow"></image>
			</view>
		</view>

		<!-- 上传的海报弹窗 -->
		<uni-popup type="center" animation="ture" ref="posterPopup">
			<view class="poster">
				<image :src="posterImg" mode="widthFix"></image>
				<view class="poster-ops">
					<!-- <button open-type="share">分享</button> -->
					<button type="default" @tap="savePoster">保存图片</button>
				</view>
			</view>
		</uni-popup>

		<!-- 底部分享弹窗 -->
		<uni-popup ref="popup" animation="ture" type="bottom">
			<view class="uni-share">
				<view class="uni-share-title">分享好产品给好友吧</view>
				<view class="uni-share-content">
					<button open-type="share" class="uni-share-content-box">
						<view class="uni-share-content-image">
							<view class="iconfont icon-weixin" style="color: #0CCE15;font-size: 54rpx;"></view>
						</view>
						<view class="uni-share-content-text">分享给好友</view>
					</button>
					<view class="uni-share-content-box" style="line-height: 2.55555556;" @tap="shareFriend(2)">
						<view class="uni-share-content-image">
							<view class="iconfont icon-pengyouquan" style="color: #0CCE15;font-size: 54rpx;"></view>
						</view>
						<view class="uni-share-content-text">生成分享海报</view>
					</view>
					<!-- <view v-for="(item, index) in bottomData" :key="index" class="uni-share-content-box" @tap='shareFriend(index)'>
						<view class="uni-share-content-image">
							<view class="iconfont" :class="item.icon" style="color: #0CCE15;font-size: 54rpx;"></view>
						</view>
						<view class="uni-share-content-text">{{ item.text }}</view>
					</view> -->
				</view>
				<view class="uni-share-btn" @click="close">取消分享</view>
			</view>
		</uni-popup>

		<!-- 商品背后的故事弹窗 -->
		<uni-popup type="bottom" animation="ture" ref="story">
			<view class="story">
				<view class="title">商品背后的故事</view>
				<scroll-view class="story-content" scroll-y="true" scroll-top="0">
					<view class="">
						<view class="theme">
							<!-- <text>故事主题：</text> -->
							{{ spuExtraInfo.storyTheme }}
						</view>
						<view class="developer">
							<text>商品开发者：</text>
							<text>{{ spuExtraInfo.goodsDeveloper }}</text>
						</view>

						<view class="con">
							<!-- <text>故事内容：</text> -->
							<text>{{ spuExtraInfo.storyContent || '该商品暂无故事内容' }}</text>
						</view>
						<view class="finish">END</view>
						<view class="bottom">
							<view class="">
								<text>作者：</text>
								<text>{{ spuExtraInfo.storyAuthor }}</text>
							</view>
							<view class="signature">
								<!-- <text>作者个性签名：</text> -->
								<text>{{ spuExtraInfo.authorSignature }}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	import uniPopup from '../../components/uni-popup/uni-popup.vue';
	import uniIcons from '../../components/uni-icons/uni-icons.vue';
	import uniNavBar from '../../components/uni-nav-bar/uni-nav-bar.vue';
	import uniNumberBox from '../../components/uni-number-box/uni-number-box.vue';
	// 函数节流
	import throttle from '../../common/throttle.js';
	import ProgressBar from '@/components/progress-bar/ProgressBar.vue'
	import MyButton from '@/components/my-button/MyButton.vue'
	// 客服组件
	import yuKefu from '@/components/yu-kefu/yu-kefu.vue'
	export default {
		components: {
			uniIcons,
			uniPopup,
			uniNavBar,
			uniNumberBox,
			ProgressBar,
			MyButton,
			yuKefu
		},
		data() {
			return {
				options: {},
				optionInfo: {},
				userInfo: {},
				spuId: '',
				sales: 0, // 销量
				stock: 0, // 库存
				primaryPrice: 0, // 原始售价
				spuName: '', // 商品名称
				spuExtraInfo: {}, // spu附加信息
				discountsInfo: {}, // 故事及服务说明
				num: 1,
				topShow: false,
				productImgShow: true,
				specClass: 'none',
				specDetail: {},
				productImgs: [{
						imgUrl: 'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/3/31/c8babdc0-dcdc-4719-9b54-de63612b19e1.png'
					},
					{
						imgUrl: 'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/3/31/c5f82ec0-ee9d-4942-80c8-d89e568821ab.png'
					}
				], // 商品图片合集
				productVideo: [], // 商品视频合集
				detailImage: [], // 详情图合集
				specList: [], // 规格的名称
				specChildList: [], // 规格名称的值
				selected: [],
				freight: 0, // 运费
				specSelected: [], // 选择了的规格值
				bottomData: [{
						text: '分享给好友',
						img: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-2.png',
						name: 'wx',
						icon: 'icon-weixin'
					},
					{
						text: '生成分享海报',
						img: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-8.png',
						name: 'wx',
						icon: 'icon-pengyouquan'
					}
				], // 底部分享图标及名称
				posterImg: '', // 海报图片地址
				videoContext: "",
				spcValues: [],
				richtext: '',
				explain: '',
				bottomType: 0,
				bottomShow: false,
				skuId:''
			};
		},
		onLoad(option) {
			console.log(option);
			this.optionInfo = option;
			
		},

		onReady() {
			this.videoContext = uni.createVideoContext('myVideo');
			this.videoContext.play()
		},

		onHide() {
			console.log('onHide')
			this.videoContext.pause()
		},
		onShow() {
			uni.onSocketMessage(function (res) {
			  console.log('收到服务器内容：' + res.data);
			});
			// 先判断是否有token
			const token = uni.getStorageSync('token');

			if (token) {
				// 有token时，直接获取数据
				if (this.optionInfo.scene && decodeURIComponent(this.optionInfo.scene)) {
					this.options = {
						spu: this.getSearchString('spu', decodeURIComponent(this.optionInfo.scene)),
						sku: this.getSearchString('sku', decodeURIComponent(this.optionInfo.scene)),
						share: this.getSearchString('share', decodeURIComponent(this.optionInfo.scene))
					};
					console.log(this.options)
					this.spuId = this.options.spu;
					this.skuId = this.options.sku;
					this.userInfo = this.$common.getStorage('userInfo');
					this.getProductDetail(this.options.spu);
				} else if (this.optionInfo.share) {
					console.log("在有token的情况下还有shareId")
					// 判断是否从首页过来的
					this.$common.loginGetToken(this.optionInfo.share).then(res => {
						this.userInfo = this.$common.getStorage('userInfo');
						// this.userInfo = res.data.userInfo
						this.options = this.optionInfo;
						this.spuId = this.optionInfo.spu;
						this.skuId = this.optionInfo.skuId;
						this.getProductDetail(this.optionInfo.spu);
					});
				} else {
					this.options = this.optionInfo;
					this.spuId = this.optionInfo.spu;
					this.skuId = this.optionInfo.sku;
					this.userInfo = this.$common.getStorage('userInfo');
					this.getProductDetail(this.optionInfo.spu);
				}
			} else {
				// 没有token时，先去获取token数据
				// 判断是否打开的是别人分享的页面
				if (this.optionInfo.scene && decodeURIComponent(this.optionInfo.scene)) {
					this.options = {
						spu: this.getSearchString('spu', decodeURIComponent(this.optionInfo.scene)),
						sku: this.getSearchString('sku', decodeURIComponent(this.optionInfo.scene)),
						share: this.getSearchString('share', decodeURIComponent(this.optionInfo.scene))
					};
					console.log('this.options', this.options);
					this.$common.loginGetToken(this.options.share).then(res => {
						// this.userInfo = res.data.userInfo
						this.userInfo = this.$common.getStorage('userInfo');
						this.optionInfo = this.options;
						this.spuId = this.optionInfo.spu;
						this.skuId = this.optionInfo.skuId;
						this.getProductDetail(this.optionInfo.spu);
					});
				} else if (this.optionInfo.share) {
					console.log("没有token情况下，拥有shareId")
					// 判断是否从首页过来的
					this.$common.loginGetToken(this.optionInfo.share).then(res => {
						this.userInfo = this.$common.getStorage('userInfo');
						// this.userInfo = res.data.userInfo
						this.options = this.optionInfo;
						this.spuId = this.optionInfo.spu;
						this.skuId = this.optionInfo.skuId;
						this.getProductDetail(this.optionInfo.spu);
					});
				} else {
					// 正常的情况
					this.$common.loginGetToken().then(res => {
						this.userInfo = this.$common.getStorage('userInfo');
						// this.userInfo = res.data.userInfo
						console.log("22")
						this.options = this.optionInfo;
						this.spuId = this.optionInfo.spu;
						this.skuId = this.optionInfo.skuId;
						this.getProductDetail(this.optionInfo.spu);
					});
				}
			}
			console.log('skuId',this.spuId)
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
			// 返回上一页
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 获取商品信息
			getProductDetail(spId) {
				this.$common
					.httpGet('common-goods/common/spuDetail', {
						spuId: spId,
						system: 'UPMALL'
					},false)
					.then(res => {
						console.log(res)
						if (res.data.code === 200200) {
							this.stock = res.data.data.stock;
							this.sales = res.data.data.sales;
							this.spuName = res.data.data.spuName;
							this.freight = res.data.data.freight;
							this.primaryPrice = res.data.data.primaryPrice;
							this.productImgs = this.returnProductRoll(res.data.data.rollImage, 1);
							console.log(this.productImgs);
							this.productVideo = this.returnProductRoll(res.data.data.rollImage, 2);
							this.detailImage = res.data.data.detailImage;
							// 规格名称
							this.specList = this.returnSpec(res.data.data.spec, 1);
							// 规格值
							this.specChildList = this.returnSpec(res.data.data.spec, 2);
							// 选择的规格值
							this.specSelected = this.returnSpecSelected();
							this.getStandardInfo();
							this.getDiscounts(spId);
							this.getSpuExtraInfo();
							if (this.productVideo.length > 0) {
								this.productImgShow = false;
							}
							// this.specChildList = res.data.data.vale
						} else {}
					});
			},
			// 把商品视频和图片分开
			returnProductRoll(rollList, type) {
				let imgList = [];
				let videoList = [];
				rollList.forEach(item => {
					if (item.shows === 1) {
						videoList.push(item);
					} else {
						imgList.push(item);
					}
				});
				if (type === 1) {
					return imgList;
				} else {
					return videoList;
				}
			},
			// 获取优惠价格
			getDiscounts(spId) {
				this.$common.httpGet('common-goods/upMall/userPrice/spu/' + spId).then(res => {
					if (res.data.code === 200200) {
						this.discountsInfo = res.data.data;
					} else {
						this.discountsInfo = {
							minBuyPrice: 0,
							maxDiscountsPrice: 0
						};
					}
				});
			},
			// 把规格拆分出来
			returnSpec(speList, type) {
				let specList = [];
				let specChildList = [];
				if (type === 1) {
					speList.forEach(item => {
						specList.push({
							id: item.specId,
							name: item.specName
						});
					});
					return specList;
				} else {
					speList.forEach(speitem => {
						let _specChildList = []
						speitem.value.forEach(childItem => {
							_specChildList.push({
								specValueId: childItem.specValueId,
								specValue: childItem.specValue
							});
						});
						specChildList.push(_specChildList)
						// for (let childItem of speitem) {
						// 	specChildList.push({
						// 		specValueId: childItem.specValueId,
						// 		specValue: childItem.specValue
						// 	})
						// }
					});
					return specChildList;
				}
			},
			// 规格默认第一条
			returnSpecSelected() {
				let specSelected = []
				this.specChildList.forEach((item, idx) => {
					item.forEach((sonItem, sonIdx) => {
						if (sonIdx === 0) {
							sonItem.selected = true
							specSelected.push(sonItem.specValueId)
							this.spcValues.push(sonItem.specValue)
						}
					})
				})
				
				// specSelected.push(this.specChildList[0]);
				// specSelected[0][0].selected = true;
				return specSelected;
			},
			// 选择规格后的商品信息
			getStandardInfo() {
				console.log(this.specSelected)
				let specId = this.specSelected;
				// for (let i = 0; i < this.specSelected.length; i++) {
				// 	specId.push(this.specSelected[i].specValueId);
				// }

				this.$common
					.httpGet('common-goods/common/skuSpec', {
						spuId: this.spuId,
						specValueIdList: String(specId),
						system: 'UPMALL'
					},false)
					.then(res => {
						if (res.data.code === 200200) {
							this.specDetail = res.data.data;
							this.optionInfo.skuId = this.specDetail.skuId;
							this.getSkuPrice(res.data.data.skuId);
							// this.$common.httpGet('common-goods/upMall/userPrice/sku/'+this.specDetail.skuid).then(res => {

							// })
						} else {
							this.$common.showToast(res.data.desc, 'none');
						}
					});
			},
			// SKU用户售价
			getSkuPrice(skuid) {
				this.$common.httpGet('common-goods/upMall/userPrice/sku/' + skuid,false,false).then(res => {
					if (res.data.code === 200200) {
						this.specDetail.price = res.data.data;
					}
				});
			},
			// 回到顶部
			top() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},
			// 底部产品分享弹窗弹出
			open() {
				let shareId = this.options.share ? this.options.share : '';
				console.log(shareId);
				this.$common.passUserauth(shareId).then(res => {
					console.log(res)
					if (res) {
						this.$refs.popup.open();
					} else {
						this.$common.navigateTo('../auth/auth?share=' + shareId + '&isAuth=1');
					}
				});
			},
			close() {
				this.$refs.popup.close();
			},
			// 保存海报图片
			saveImg() {
				let _this = this;
				uni.downloadFile({
					url: this.posterImg,
					success: res => {
						if (res.statusCode === 200) {
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: () => {
									this.$refs.posterPopup.close();
									this.posterImg = ""
									uni.showToast({
										title: '保存成功',
										icon: 'none'
									});
								},
								fail: () => {
									uni.showToast({
										title: '保存失败，请稍后重试',
										icon: 'none'
									});
									
								}
							});
						}
					}
				});
			},
			// 保存海报
			savePoster:throttle.throttleFunc(function() {
				console.log('保存海报');
				let self = this;
				//相册授权
				uni.getSetting({
					success(res) {
						// 进行授权检测 , 为授权则进行弹层授权
						if (!res.authSetting['scope.writePhotosAlbum']) {
							uni.authorize({
								scope: 'scope.writePhotosAlbum',
								success() {
									// 成功则调用存储图片
									self.saveImg();
								},
								// 拒绝授权时，则进入手机设置页面，可进行授权设置
								fail: () => {
									uni.showModal({
										content:'检测到您没打开保存相册权限，是否去设置打开？',
										confirmText: "确认",
										cancelText:'取消',
										success: (res) => {
											if(res.confirm){
												uni.openSetting({
													success: (res) => {
														console.log(res);
													}
												})
											}else{
												console.log('取消');
											}
										}
									})
								}
							});
						} else {
							// 已授权则直接进行保存图片
							self.saveImg();
						}
					}
				});
			},500),
			// 分享
			shareFriend(type) {
				let userInfo = this.$common.getStorage('userInfo');
				console.log(userInfo)
				console.log(' this.skuId', this.skuId);
				let qrCodeImg = '';
				if (type === 0) {} else {
					// 请求小程序码图片
					this.$common
						.httpPost('user/userMember/getUnlimited', {
							spu: this.spuId,
							sku: this.skuId,
							page: 'pages/product/product'
						})
						.then(res => {
							console.log(res);
							if (res.data.code === 100200) {
								qrCodeImg = res.data.data; // 生成产品分享海报
								this.$common
									.posterHttp('https://mall.cntracechain.com/shareQrImage/share/up/product', {
										backUrl: this.productImgs[0].image,
										headImg: userInfo.avatar,
										qrCodeImg: qrCodeImg,
										nickName: userInfo.nickName,
										shareText: '给你推荐了一个好东西',
										price: '￥' + this.primaryPrice,
										productDesc: this.spuName,
										shareId: userInfo.shareId
									})
									.then(res => {
										this.posterImg = res.data.data;
										this.close();
										this.$refs.posterPopup.open();
									});
							}
						});
				}
			},
			// 选择规格
			tapSpec() {
				this.bottomShow = false
				this.toggleSpec()
			},
			//规格弹窗开关
			toggleSpec() {
				if (this.specClass === 'show') {
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				} else if (this.specClass === 'none') {
					this.specClass = 'show';
				}
			},
			//选择规格
			selectSpec(sonIdx, index, pid, name) {
				this.num = 1;
				this.specSelected[index] = pid
				this.spcValues[index] = name
				console.log(this.specSelected)
				
				this.specChildList[index].forEach(sonItem => {
					if (sonItem.specValueId === pid) {
						// sonItem.selected = true
						this.$set(sonItem, 'selected', true)
					} else {
						this.$set(sonItem, 'selected', false)
						// sonItem.selected = false
					}
				})
				
				// let list = this.specChildList;
				// list.forEach(item => {
				// 	if (item.pid === pid) {
				// 		this.$set(item, 'selected', false);
				// 	}
				// });

				// this.$set(list[index], 'selected', true);
				// //存储已选择
				// /**
				//  * 修复选择规格存储错误
				//  * 将这几行代码替换即可
				//  * 选择的规格存放在specSelected中
				//  */
				// this.specSelected = [];
				// list.forEach(item => {
				// 	if (item.selected === true) {
				// 		this.specSelected.push(item);
				// 	}
				// });
				this.getStandardInfo();
			},
			bindChange(val) {
				console.log('数量', val);
				if (val) {
					this.num = val;
				} else {
					this.num = 1;
				}
			},
			stopPrevent() {},
			// 产品分享海报
			shareProduct() {},
			// 获取商品背后的故事
			getSpuExtraInfo() {
				this.$common.getNoToken('common-goods/upMall/uncalibrated/spuExtraInfo/' + this.spuId).then(res => {
					if (res.data.code === 200200) {
						this.spuExtraInfo = res.data.data;
						let explain = res.data.data.recommendReason
						let arr = explain.replace(/\n/g, "|").split("|")
						this.explain = arr.filter(v => v.toString().trim())
						let richtext = res.data.data.introduction
						if (richtext) {
							const regex = new RegExp('<img', 'gi');
							richtext= richtext.replace(regex, `<img style="width: 100%;display: block"`)
						}
						this.richtext = richtext
					}
				});
			},
			// 点击底部的加入购物车或是立即购买
			bottomOps(type) {
				// type为0就是点击了加入购物车
				this.bottomType = type
				this.bottomShow = true
				this.toggleSpec()
			},
			// 点击购买跳转到下订单的页面
			purchase() {
				// this.stopVideo()
				let shareId = this.options.share ? this.options.share : '';
				if (this.specDetail) {
					// this.$common.passUserauth(this.options.share).then(res => {
					// 	// console.log(res)
					// 	if (res) {
							// this.$refs.popup.open()
							if (this.specDetail.stock > 0) {
								let _specValue = []
								
								this.specSelected.forEach(seItem => {
									this.specChildList.forEach(item => {
										item.forEach(sonItem => {
											if(sonItem.specValueId === seItem) {
												_specValue.push(sonItem.specValue)
											}
										})
									})
									
								})
								let _goodInfo = {
									totalAmount: Number(this.specDetail.price * this.num),
									comboLeavel: '',
									share: shareId,
									freightPrice: this.freight,
									pagesInfo: 1,
									productSpuId: Number(this.spuId),
									goodlist: [{
										productId: this.specDetail.skuId,
										image: this.specDetail.image,
										goodsName: this.spuName,
										price: this.specDetail.price,
										count: this.num,
										specValue: String(_specValue)
									}]
								}
								uni.setStorageSync('goodInfo', _goodInfo);
								uni.navigateTo({
									url: '../orderSettlement/orderSettlement'
								});
							} else {
								this.$common.showToast('您购买的商品暂无库存');
							}
					// 	} else {
					// 		this.$common.navigateTo('../auth/auth?share=' + shareId);
					// 	}
					// });
				} else {
					this.$common.showToast('商品信息不全');
				}
			},
			// 加入购物车
			addShoppingCart: throttle.throttleFunc(function() {
				let shareId = this.options.share ? this.options.share : '';
				// this.$common.passUserauth(shareId).then(res => {
				// 	if (res) {
						// setTimeout(() => {
							this.$common.httpGet('common-goods/common/shoppingCart/addition', {
								skuId: this.specDetail.skuId,
								increase: true,
								count: this.num,
								system: 'UPMALL'
							}, false).then(data => {
								// this.$common.showToast(res.data.desc);
								if (data.data.code === 200200) {
									this.$common.showToast(data.data.desc)
									// let timeid=	setTimeout(()=>{
										// this.$common.hideLoading()
										// clearTimeout(timeid)
										// },1000)
									}
							})
						// }, 1000)
						
				// 	} else {
				// 		this.$common.navigateTo('../auth/auth?share=' + shareId)
				// 	}
				// })
			}, 1800),
			// 规格弹窗中的加入购物车与立即购买
			attrOps(type) {
				if (type === 1) {
					this.addShoppingCart();
				} else {
					this.purchase();
				}
				this.toggleSpec();
			},
			// 规格弹窗的确定按钮事件
			attrConfirm() {
				if (this.bottomType === 1) {
					this.purchase();
				} else {
					this.addShoppingCart()
				}
				this.toggleSpec()
			},
			// 回到首页
			goIndex() {
				uni.switchTab({
					url: '../index/index'
				});
			},
			// 跳转用户中心
			goUserInfo: throttle.throttleFunc(function() {
				let shareId = this.options.share ? this.options.share : '';
				this.$common.passUserauth(shareId).then(res => {
					console.log(res);
					if (res) {
						uni.switchTab({
							url: '../profile/profile'
						})
						this.posterImg = ""
						// this.$common.navigateTo('../profile/profile');
					} else {
						this.$common.navigateTo('../auth/auth?share=' + shareId + '&isAuth=2');
					}
				});
			}, 1500),
			// 跳转到购物车
			goshoppingCart() {
				// this.$common.navigateTo('../shoppingCart/shoppingCart')
				let shareId = this.options.share ? this.options.share : '';
				uni.switchTab({
					url: '../shoppingCart/shoppingCart?share=' + shareId
				})
				// this.stopVideo();
				// this.$common.passUserauth(shareId).then(res => {
				// 	if (res) {
						// uni.navigateTo({
						// 	url: '../shoppingCart/shoppingCart?share=' + shareId
						// });
				// 	} else {
				// 		this.$common.navigateTo('../auth/auth?share=' + shareId);
				// 	}
				// });
			},
			// 停止视频播放
			stopVideo() {
				const videoContext = uni.createVideoContext('myVideo');
				videoContext.pause();
			},
			// 立即升级
			goMemberShip() {

				let userInfo = this.$common.getStorage('userInfo');
				console.log(userInfo);
				let _userInfo = {
					nickName: userInfo.nickName,
					avatar: userInfo.avatar,
					userLevel: userInfo.userLevel,
					shareId: userInfo.shareId
				};
				if (userInfo.userLevel >= 0 && userInfo.userLevel <= 3) {
					console.log('是新人或是会员');
					_userInfo.type = 0; // 0是会员
				} else if (userInfo.userLevel >= 4 && userInfo.userLevel <= 6) {
					console.log('是代理商');
					// this.inviteCode.show = true;
					_userInfo.type = 1; // 1 是代理商
				}
				let shareId = this.options.share ? this.options.share : '';
				this.$common.passUserauth().then(res => {
					console.log(res);
					if (res) {
						this.$common.navigateTo('../memberShip/memberShip?userInfo=' + encodeURIComponent(JSON.stringify(_userInfo)));
					} else {
						this.$common.navigateTo('../auth/auth?share=' + shareId);
					}
				});
			}
		},
		// 分享
		onShareAppMessage(res) {
			let userInfo = this.$common.getStorage('userInfo');
			if (res.from === 'button') {
				// this.$refs.posterPopup.close();
				this.$refs.popup.close();
				console.log(1111)
			}
			return {
				title: this.spuName,
				imageUrl: this.productImgs[0].image,
				path: 'pages/product/product?spu=' + this.spuId + '&sku=' + this.specDetail.skuId + '&share=' + userInfo.shareId
			};
		},
		onPageScroll(e) {
			if (e.scrollTop > 100) {
				this.topShow = true;
				uni.setNavigationBarTitle({
					title: '商品详情'
				});
			} else {
				this.topShow = false;
			}
		}
	};
</script>

<style lang="scss" scoped>
	page {}

	.poster {
		position: relative;
		top: 80rpx;
		image {
			// width: 100%;
			// height: 100%;
			border-radius: 10px 10px 0 0;
		}

		.poster-ops {
			display: flex;
			margin: 20rpx 0;
			justify-content: space-around;

			button {
				// width: 98%;
				width: 290upx;
				height: 68upx;
				background: #d0bb8b;
				font-size: 26upx;
				line-height: 68upx;
				color: #fff;
				border-radius: 29upx;
				// margin-top: 20upx;
				border-color: #d0bb8b;
			}
		}
	}

	/* 规格选择弹窗 */
	.attr-content {
		padding: 10upx 30upx;

		.a-t {
			display: flex;

			image {
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;
			}

			.right {
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;

				.price {
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}

				.selected-text {
					margin-right: 10upx;
				}
			}
		}

		.attr-list {
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
		}

		.item-list {
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;

			text {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}

			.selected {
				background: #fbebee;
				color: $uni-color-primary;
			}
		}

		.attr-content-ops {
			// width: ;
			display: flex;
			margin: 30upx auto 20upx;

			.shoppingCart {
				// align-self: center;
				text-align: center;
				width: 50%;
				height: 72upx;
				line-height: 72upx;
				border-radius: 100upx 0 0 100upx;
				background: rgba(221, 232, 247, 1);
				font-size: $font-base + 2upx;
				color: #06B720;
			}

			.purchase {
				text-align: center;
				width: 50%;
				height: 72upx;
				line-height: 72upx;
				border-radius: 0 100upx 100upx 0;
				background: #06B720;
				font-size: $font-base + 2upx;
				color: #fff;
				// margin: 30upx auto 20upx;
			}
		}
	}

	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 92%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;

			.btn {
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: $uni-color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}

			.btn1 {
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: rgba(0, 0, 0, 0.2);
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}
	}

	.product {
		background: #f8f6f9;

		.product-banner {
			position: relative;

			.swiper {
				width: calc(100vw);
				// height: 480rpx;
				height: 750rpx;

				.swiper-item {
					display: block;

					// height: 750rpx;
					// line-height: 100%;
					// text-align: center;
					image {
						width: 100%;
						height: 750rpx;
					}
				}
			}

			.productImgShow {
				width: 100rpx;
				text-align: center;
				line-height: 60rpx;
				background-color: #ffffff;
				opacity: 0.5;
				// color: #DCDFE6;
				font-size: 26rpx;
				border-radius: 6rpx;
				position: absolute;
				left: 50%;
				bottom: 24rpx;
				transform: translate(-50%, 0);
			}
		}

		.product-con {
			position: relative;
			padding: 0 32rpx 14rpx;
			background: #ffffff;

			.product-con-price {
				display: flex;
				align-items: baseline;
				height: 94rpx;
				// padding: 10upx 0;
				line-height: 94rpx;

				.price-show {
					color: #06B720;
				}

				.price-decortion {
					margin-left: 12rpx;
					color: rgba(128, 128, 128, 1);
					text-decoration: line-through;

					.price {
						font-size: 30rpx;
					}
				}

				.price-tip {
					font-size: 24rpx;
				}

				.price {
					font-size: 36rpx;
					font-weight: bold;
				}
			}

			.product-upgrade {
				display: flex;
				height: 88rpx;
				background: rgba(255, 231, 204, 1);
				border-radius: 2rpx;
				line-height: 88rpx;
				align-items: center;

				.product-upgrade-title {
					font-size: 24rpx;
					margin-left: 20rpx;
					color: rgba(57, 51, 49, 1);
				}

				.product-upgrade-num {
					margin-left: 10rpx;
					color: rgba(233, 51, 51, 1);
				}

				.product-upgrade-button {
					margin-left: 18rpx;
					width: 124rpx;
					height: 46rpx;
					text-align: center;
					line-height: 46rpx;
					background: rgba(55, 46, 25, 1);
					border-radius: 2rpx;
					color: rgba(247, 247, 247, 1);
					font-weight: 500;
					font-size: 22rpx;
				}
			}

			.product-goodName {
				margin-top: 36rpx;
				display: flex;
				justify-content: space-between;

				.title {
					// flex: 0.6;
					// width: 438rpx;
					width: 60%;
					color: rgba(29, 28, 28, 1);
					font-size: 28rpx;
					font-weight: bold;
				}

				.product-goodName-right {
					flex: 1;
					display: flex;

					.item1 {}

					.item {
						width: 80px;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: space-between;

						.num {
							color: rgba(233, 51, 51, 1);
							font-size: 30rpx;
							font-weight: bold;
						}

						.title {
							color: rgba(128, 128, 128, 1);
							font-size: 20rpx;
							font-weight: 500;
						}

						.title1 {
							color: rgba(128, 128, 128, 1);
							font-size: 20rpx;
							font-weight: 500;
						}
					}
				}
			}

			.product-story {
				margin-top: 30rpx;
				width: 352rpx;
				height: 60rpx;
				background: rgba(255, 255, 255, 1);
				border: 1px solid rgba(187, 146, 103, 1);
				border-radius: 30rpx;
				color: rgba(187, 146, 103, 1);
				font-size: 28rpx;
				display: flex;
				justify-content: space-around;
				align-items: center;
			}

			.product-recommend {
				.product-recommend-1 {
					display: flex;
					align-items: center;
					height: 50rpx;
					margin-top: 18rpx;

					.recommend-img {
						width: 30rpx;
						height: 30rpx;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.recommend-title {
						margin-left: 10rpx;
						font-size: 24rpx;
						color: rgba(51, 51, 51, 1);
						font-weight: 500;
					}
				}

				.product-recommend-2::after {
					content: '';
					width: 0;
					height: 2rpx;
					border: 20rpx solid;
					// border-bottom: 20rpx solid;
					position: absolute;
					top: -39rpx;
					left: 40rpx;
					border-color: transparent transparent rgba(236, 236, 236, 1) transparent;
				}

				// .product-recommend-2::before {
				// 	content: '';
				// 	width: 0;
				// 	height: 0;
				// 	border: 10rpx solid;
				// 	position: absolute;
				// 	top: -40rpx;
				// 	left: 60rpx;
				// 	// border-width: 40rpx 20rpx;
				// 	// border-style: solid;
				// 	border-color: transparent transparent rgba(236, 236, 236, 1)  transparent;
				// }
				.product-recommend-2 {
					margin-top: 30rpx;
					margin-bottom: 12rpx;
					padding-bottom: 20rpx;
					// width: 200rpx;
					// height: 100rpx;
					border: 2rpx solid rgba(236, 236, 236, 1);
					border-radius: 7rpx;
					/*圆角弧度为7px*/
					position: relative;
					background: rgba(236, 236, 236, 1);

					.title {
						color: rgba(51, 51, 51, 1);
						font-size: 24rpx;
						font-weight: 500;
						margin-left: 12rpx;
						margin-top: 20rpx;
						margin-right: 10rpx;
					}
				}
			}

			.product-share {
				position: absolute;
				right: 0;
				top: 38rpx;
				width: 88rpx;
				height: 68rpx;
				line-height: 68rpx;
				border-radius: 50% 0 0 50%;
				background-color: #8f9297;
				opacity: 0.5;
				color: #fff;
				// font-size: 50rpx;
				// image {
				// 	width: 100%;
				// 	height: 100%;
				// }
			}
		}

		.product-Specification {
			margin-top: 20rpx;
			background-color: #ffffff;
			// display: flex;

			padding: 0 32rpx;

			.item {
				display: flex;
				align-items: center;
				height: 88rpx;
				justify-content: space-between;
				color: rgba(0, 0, 0, 1);
				font-size: 24rpx;
				font-weight: 500;
			}

			.specification {
				border-bottom: 4rpx solid rgba(242, 242, 242, 1);
			}
		}

		.product-particulars {
			margin-top: 20rpx;
			background: #ffffff;
			margin-bottom: 98rpx;

			.product-particulars-title {
				line-height: 88rpx;
				text-align: center;
				color: rgba(0, 0, 0, 1);
				font-size: 24rpx;
			}
			
			.product-rich {
				// img {
				// 	display: block;
				// }
			}
			// img {
			// 	width: 100%;
			// }
			
			.product-particulars-img {
				width: 100%;

				image {
					width: 100%;
				}
			}
		}

		.product-bottom {
			width: calc(100% - 32px);
			padding: 0 32rpx;
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			height: 98rpx;
			align-items: center;
			justify-content: space-between;
			background: rgba(247, 247, 247, 1);
			box-shadow: 0px 0px 4px 0px rgba(217, 217, 217, 1);

			.iconImg {
				width: 48rpx;
				height: 48rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.cart {
				margin-left: 24rpx;
				width: 200rpx;
				height: 72rpx;
				background: rgba(221, 232, 247, 1);
				border-radius: 36rpx;
				color: #06B720;
				text-align: center;
				line-height: 72rpx;
				font-size: 28upx;
			}

			.purchase {
				margin-left: 20rpx;
				width: 200rpx;
				height: 72rpx;
				background: #06B720;
				border-radius: 36rpx;
				color: rgba(255, 255, 255, 1);
				text-align: center;
				line-height: 72rpx;
				font-size: 28rpx;
			}
		}

		.index-ops {
			position: fixed;
			bottom: 110rpx;
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

		.uni-share {
			background: #ffffff;

			button {
				margin: 0 !important;
				padding: 0 !important;
				background-color: #ffffff !important;

				&::after {
					border: none !important;
				}
			}

			.uni-share-title {
				line-height: 60upx;
				font-size: 24upx;
				padding: 15upx 0;
				text-align: center;
			}

			.uni-share-content {
				display: flex;
				flex-wrap: wrap;
				padding: 15px;
				// align-items: center;
				justify-content: center;

				.uni-share-content-box {
					display: flex;
					flex-direction: column;
					align-items: center;
					width: 25%;
					box-sizing: border-box;
				}

				.uni-share-content-image {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 60upx;
					height: 60upx;
					overflow: hidden;
					border-radius: 10upx;

					.image {
						width: 100%;
						height: 100%;
					}
				}

				.uni-share-content-text {
					font-size: 26upx;
					color: #333;
					padding-top: 5px;
					padding-bottom: 10px;
				}
			}

			.uni-share-btn {
				height: 90upx;
				line-height: 90upx;
				border-top: 1px #f5f5f5 solid;
				text-align: center;
				color: #666;
				font-size: 26rpx;
			}
		}
	}

	.story {
		// position: relative;
		background-color: #ffffff;
		// height: 600rpx;
		height: calc(100vh - 180px);
		border-radius: 16rpx 16rpx 0 0;

		.title {
			position: fixed;
			line-height: 80rpx;
			top: 0;
			width: 100%;
			text-align: center;
			font-size: 36rpx;
			color: rgba(187, 146, 103, 1);
			font-weight: bold;
			border-bottom: 2rpx solid #cccccc;
		}
	}

	.story-content {
		// height: 90%;
		// height: 600rpx;
		height: calc(100% - 40px);
		// overflow-y: scroll;
		position: absolute;
		top: 80rpx;
		z-index: 11;
		// font-size: 26rpx;
		padding: 10rpx 20rpx 10rpx 40rpx;
		width: calc(100% - 30px);

		// padding-bottom: 40rpx;
		view {}

		.theme {
			// line-height: 80rpx;
			// text-align: center;
			margin-top: 8rpx;
			font-size: 36rpx;
			// color: rgba(187, 146, 103, 1);
			// font-weight: bold;
		}

		.developer {
			margin-top: 30rpx;
			margin-bottom: 30rpx;
			font-size: 28rpx;
			color: #666666;
		}

		.con {
			font-size: 30rpx;
			font-weight: 300;
		}

		.finish {
			margin-top: 30rpx;
			text-align: center;
			color: rgba(187, 146, 103, 1);
		}

		.bottom {
			margin-top: 18rpx;
			border-top: 4rpx solid #f7f7f7;
			border-bottom: 4rpx solid #f7f7f7;
			padding: 30rpx 20rpx;
			margin-bottom: 40rpx;

			.author {
				font-weight: bold;
				color: #000000;
				font-size: 30rpx;
			}

			.signature {
				margin-top: 16rpx;
				color: #666666;
				font-size: 26rpx;
			}
		}
	}

	.con_count {
		align-items: center;
		justify-content: space-between;
		margin: 10px 0 0 0;
		display: flex !important;
		font-size: 30upx;
		color: #909399;
		padding: 10upx 5upx;

		.item:first-child {
			margin-right: 40upx;
			text-align: center;
		}

		.item:last-child {
			text-align: right;
		}
	}
</style>



<!-- 弹窗样式 -->
<style lang="less" scoped>
.leader {
	width: 100upx;
	height: 100upx;
	position: relative;
	.leader-avatar {
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
		border: 1px solid #06B720;
	}
	.leader-tag {
		position: absolute;
		bottom: -4upx;
		right: 0;
		background: #06B720;
		color: #fff;
		font-size: 20upx;
		padding: 0 10upx;
		border-radius: 13upx;
	}
}
.body-list {
	padding-top: 30upx;
	min-height: 300upx;
	max-height: 544upx;
	overflow: auto;
	.item {
		display: flex;
		background: #F2F7FF;
		align-items: center;
		padding: 22upx ;
		margin-bottom: 20upx;
		.avatar {
			width: 64upx;
			height: 64upx;
			border-radius: 50%;
		}
		
		.commander {
			flex: 1;
			font-size: 26upx;
			color: #333;
			padding: 0 30upx 0 20upx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;		
		}
		.progress-wrap {
			text-align: center;
			margin-right: 30upx;
			.desc {
				font-size: 20upx;
				color: #808080;
				margin-top: 10upx;
				letter-spacing: 1px;
				>text {
					color: #06B720;
				}
			}
		}
	}
}
.popup-join {
	.body{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-top: 10upx;
		.title {
			font-size: 36upx;
			color: #06B720;
			font-weight: bold;
			letter-spacing: 1px;
		}
		.join-wrap {
			font-size: 26upx;
			color: #808080;
			margin-top: 28upx;
			.name {
				margin-right: 10upx;
			}
			.num {
				color: #06B720;
			}
		}
		.avatar-wrap {
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 38upx 0 62upx 0;
			.point-wrap {
				display: flex;
				margin: 0 32upx;
				.point {
					width: 6upx;
					height: 6upx;
					border-radius: 50%;
					background: #CCC;
					&:not(:last-child) {
						margin-right: 12upx;
					}
				}
			}
			.member {
				width: 98upx;
				height: 98upx;
				border: 1px dashed #ccc;
				border-radius: 50%;
				font-size: 45upx;
				text-align: center;
				line-height: 100upx;
				color: #ccc;
			}
		}
	}
}

.popup-joinList {
	.body {
		padding-top: 34upx;
		min-height: 300upx;
		max-height: 800upx;
		overflow: auto;
		.header-wrap {
			display: flex;
			.leader-info {
				padding-left: 50upx;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				.leader-name, .good-desc {
					font-size: 26upx;
					color: #333;
					>text {
						margin-left: 10upx;
					}
				}
			}
		}
		
		.body-wrap {
			margin-top: 40upx;
			.title-wrap {
				display: flex;
				justify-content: space-around;
				text-align: center;
				font-size: 26upx;
				padding: 20upx 0;
				border-bottom: 1px solid #F7F7F7;
				.title-item {
					flex: 1;
					&:not(:last-child) {
						border-right: 1px solid #06B720;
					}
					&:nth-child(2) {
						flex: 1.5;
					}
					&:nth-child(3) {
						flex: 0.7;
					}
				}
			}
			.list-wrap {
				.list-item {
					display: flex;
					font-size: 26upx;
					color: #808080;
					padding:20upx 0;
					border-bottom: 1px solid #F7F7F7;
					.buyer,.num, .time {
						flex: 1;
						text-align: center;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						padding: 0 10upx;
					}
					.num {
						flex: 0.7;
					}
					.time {
						flex: 1.5;
					}
				}
			}
		}
	}
}
</style>