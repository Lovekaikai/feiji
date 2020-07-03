<template>
	<view class="groupGoodsDetails">
		<yu-kefu position="3"></yu-kefu>
		<uni-nav-bar :status-bar="true" background-color="#FFFFFF" color="#000000" left-icon="arrowleft" title="详情" shadow="false"
		 fixed="true" @click-left="back" />
		<!-- 商品banner -->
		<view class="groupGoodsDetails-banner">

			<view class="" v-if="bannerVideos.length > 0 && !productImgShow">
				<view class="" v-for="(video, vidx) in bannerVideos" :key="vidx">
					<video id="myVideo" :src="video.image" style="width: 100%;height: 750rpx;" loop autoplay></video>
				</view>
			</view>

			<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" v-else>
				<swiper-item v-for="(bImg, bgIdx) in bannerImages" :key="bgIdx">
					<view class="swiper-item">
						<image :src="bImg.image" mode=""></image>
					</view>
				</swiper-item>
			</swiper>

			<view class="productImgShow" @tap="productImgShow = !productImgShow" v-if="bannerVideos.length > 0">{{ productImgShow ? '视频' : '图片' }}</view>

			<!-- 引入走马灯模块 -->
			<horse-lamp class="horse-lamp" :msgObj="msgObj" :msgOpacity="msgOpacity"></horse-lamp>
		</view>

		<!-- 商品名称、价格、拼团的详情 -->
		<view class="groupGoodsDetails-con1">
			<!-- 商品名称及价格显示栏 -->
			<view class="groupGoodsDetails-con1-top">
				<view class="goodName">
					<text class="discount">{{breakNum}}折</text>
					<text class="gname" style="margin-left: 8rpx;">{{spuName}}</text>
				</view>
				<view class="price">
					<view class="price-1">
						<text style="font-size: 24rpx;">￥</text>
						<text style="font-size: 38rpx;">{{specDetail.price}}</text>

					</view>
					<view class="price-2">
						<text style="font-size: 24rpx;">￥</text>
						<text style="font-size: 30rpx;">{{primaryPrice}}</text>
					</view>
				</view>
			</view>
			<!-- 拼团的详情 -->
			<view class="groupGoodsDetails-con1-bottom">
				<!-- <view class="groupName">
					<view class="imgs">
						<view class="colonelImg">
							<view class="title">团长</view>
						</view>
						<view class="img"></view>
						<view class=""></view>
					</view>
					<view class="">对方正在输入...的拼团</view>
					<view class=""><progress-bar></progress-bar></view>
				</view> -->
				<view class="groupGoodsDetails-con1-bottom-1" @tap="$refs.isDescribe.open()">
					<view class="explain">
						<view class="explain-icon">说明</view>
						<view class="explain-title">{{explain}}</view>
					</view>
					<view class="" v-if="explainShow">
						<uni-icons type="arrowright" size="14" color="#BB9267"></uni-icons>
					</view>

				</view>
			</view>
		</view>

		<!-- 可参与的拼团 -->
		<view class="groupGoodsDetails-con2" v-if="SpellGroupList.length > 0">
			<view class="groupGoodsDetails-con2-title">
				<view class="left-title">可参与的拼团</view>
				<view class="right-more" v-if="SpellGroupList.length > 3" @click="isPopupList=true">查看更多<uni-icons type="arrowright"
					 size="14" color="#BB9267"></uni-icons>
				</view>
			</view>
			<view class="groupGoodsDetails-con2-groupbuylist">
				<view class="groupbuylist-item" v-for="(spgItem, spgIdx) in SpellGroupList" :key='spgIdx' v-if="spgIdx < 3">
					<view class="item-left">
						<view class="imgs" @tap='getGrouponList(spgItem.grouponId, spgItem.headName, spgItem.images[0])'>
							<view v-for="(img, imgIdx) in spgItem.images" :key="imgIdx" :class="imgIdx === 0 ? 'colonelImg' : 'img'" v-if="imgIdx < 3">
								<image :src="img" mode=""></image>
								<view class="title" v-if="imgIdx === 0">团长</view>
							</view>
							<!-- <view class="img"></view>
							<view class=""></view> -->
						</view>
						<view class="group-name">{{spgItem.headName}}的拼团</view>
					</view>
					<view class="item-right">
						<progress-bar :sold="spgItem.progress" :width="146" class="progress"></progress-bar>
						<my-button @tap="handleJoin(spgItem.grouponId, spgItem.images[0])"></my-button>
					</view>
				</view>
			</view>
		</view>

		<!-- 最热拼团好物与拼团历史 -->
		<view class="groupGoodsDetails-con3">
			<view class="groupGoodsDetails-con3-tab">
				<view class="" v-for="(tabItem, tabIdx) in tabList" :key='tabIdx' :class="tabActive === tabItem.id ? 'tabActive' : ''"
				 @tap='tabActived(tabItem.id)'>
					{{tabItem.name}}
				</view>
				<!-- <view class="tabActive">最热拼团好物</view>
				<view class="">拼团历史</view> -->
			</view>
			<spell-good v-if="tabActive === 1" :speGoodList='spellGoodList'></spell-good>
			<spell-historical v-else :historyList='historyList' :date="historyDate" :total='total' @changeHistoryDate='changeHistoryDate'
			 @changePage='changePage'></spell-historical>
		</view>

		<!-- 商品详情 -->
		<view class="groupGoodsDetails-particulars">
			<view class="groupGoodsDetails-particulars-title">商品详情</view>
			<view class="product-rich" v-if="spuExtraInfo.introduction">
				<rich-text :nodes="richtext"></rich-text>
			</view>

			<image class="groupGoodsDetails-particulars-img" v-for="(detailItem, didx) in detailImages" :key="didx" v-else :src="detailItem.image"
			 style="width: 100%;" mode="widthFix"></image>

		</view>

		<!-- 底部 -->
		<view class="groupGoodsDetails-bottom">
			<view class="groupGoodsDetails-bottom-left">
				<view class="iconImg" @click="goIndex">
					<view class="iconfont icon-yemian-copy-copy" style="font-size: 48rpx; color: #06B720;"></view>
				</view>
				<view class="iconImg2" @click="goUserInfo">
					<view class="iconfont icon-mine-gray" style="font-size: 48rpx; color: #06B720;"></view>
				</view>
			</view>

			<view class="groupGoodsDetails-bottom-right">
				<view class="price">
					<text style="font-size: 24rpx;">￥</text>
					<text style="36rpx">{{specDetail.price}}</text>
				</view>
				<view class="ops" @tap='bottomOps'>{{shareId&&grouponDetailShow===true ? '立即参团':'立即开团'}}</view>
			</view>
		</view>

		<!-- 选择规格  弹窗 -->
		<spec-popu :isPopup="isSpecPopup" @close="closeSpecPopup">
			<template #body>
				<view class="spec">
					<view class="groupName" v-if="grouponDetailShow">{{grouponDetail.headName}}的拼团</view>
					<!-- sku商品信息 图片 -->
					<view class="spe-good-img">
						<image :src="specDetail.image" mode="aspectFit"></image>
						<view class="spe-good-right">
							<view class="spec-price">
								¥{{specDetail.price}}
							</view>
							<view class="spec-stock">
								<text>库存：</text>
								<text>{{specDetail.stock}}</text>
							</view>
						</view>

					</view>
					<!-- 规格 -->
					<view class="attr-list" v-for="(snaItem, snaIdx) in specNames" :key='snaIdx'>
						<text class="specname">{{snaItem.name}}：</text>
						<view class="specvalues">
							<text v-for="(spvItem, spvIdx) in specValues[snaIdx]" :key='spvIdx' :class="{ selected: spvItem.selected }" @tap="selectSpec(snaIdx, spvItem.specValueId)">
								{{spvItem.specValue}}
							</text>
						</view>
					</view>
					<view class="con_count ">
						<view class="title">购买数量：</view>
						<view class="count">
							<uni-number-box :min="1" @change="bindChange" :max="grouponDetailShow ? grouponDetail.actorCount : groupCount"
							 :value="productCount"></uni-number-box>
						</view>
					</view>

					<view class="spec-bottom">
						<view class="spec-bottom-btn" @tap="goConfirmOreder" v-if="specDetail.stock > 0">
							确认
						</view>
						<view class="btn1" v-if="specDetail.stock === 0" @click="isSpecPopup = false">暂无库存请重新选择</view>
					</view>
				</view>
			</template>

		</spec-popu>

		<!-- 拼团列表 弹窗 -->
		<popup :isPopup="isPopupList" @close="isPopupList=false" title="拼团列表">
			<template #body>
				<scroll-view scroll-y class="body-list">
					<view class="item" v-for="(item,index) in SpellGroupList" :key="index">
						<view class="image-wrap" @tap='getGrouponList(item.grouponId, item.headName, item.images[0])'>
							<image class="avatar" :src="item.images[0]"></image>
						</view>
						<text class="commander">{{item.headName}}的拼团</text>
						<view class="progress-wrap">
							<progress-bar :sold="item.progress" :width="150"></progress-bar>
							<view class="desc">还差<text class="num">{{item.residueCount}}</text>人成团</view>
						</view>
						<my-button desc="去参团" style="margin-left: auto;" @tap="handleJoin(item.grouponId, item.images[0])"></my-button>
					</view>
				</scroll-view>
			</template>
		</popup>

		<!-- 拼团中  弹窗 -->
		<popup :isPopup="isPopupJoin" @close="closeisPopupJoin" class="popup-join">
			<template #body>
				<view class="body">
					<view class="title">拼团中，快来参与拼团</view>
					<view class="join-wrap">
						<text class="name">{{grouponDetail.headName}}</text>
						的拼团,还差<text class="num">{{grouponDetail.actorCount}}人</text>拼团成功
						<view class="avatar-wrap">
							<view class="leader">
								<image class="leader-avatar" :src="commander"></image>
								<text class="leader-tag">团长</text>
							</view>
							<view class="point-wrap">
								<view class="point" v-for="index in 6" :key="index"></view>
							</view>
							<view class="member">
								<text>?</text>
							</view>
						</view>
					</view>
					<my-button desc="参与拼团" :height="80" :size="28" :btnStyle="195" @tap='participationGroup'></my-button>
				</view>
			</template>
		</popup>

		<!-- 参团列表  弹窗 -->
		<popup :isPopup="isPopUpJoinList" title="参团列表" @close="isPopUpJoinList=false" class="popup-joinList">
			<template #body>
				<scroll-view scroll-y class="body">
					<view class="header-wrap">
						<view class="leader">
							<image class="leader-avatar" :src="joindetail.imgUrl"></image>
							<text class="leader-tag">团长</text>
						</view>
						<view class="leader-info">
							<view class="leader-name">团长: <text>{{joindetail.headName}}</text></view>
							<view class="good-desc">团名: <text>{{joinList[0].grouponName}}</text></view>
						</view>
					</view>
					<view class="body-wrap">
						<view class="title-wrap">
							<view class="title-item" v-for="(item,index) in ['买家','成交时间','数量']" :key="index">{{item}}</view>
						</view>
						<view class="list-wrap">
							<view class="list-item" v-for="(item,index) in joinList" :key="index">
								<view class="buyer">{{item.nickName}}</view>
								<view class="time">{{item.payTime}}</view>
								<view class="num">{{item.goodsCount}}</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</template>
		</popup>

		<!-- 说明过长时展示的弹窗 -->
		<uni-popup type="bottom" ref='isDescribe' animation="ture">
			<view class="isDescribe">
				<view v-html="" class="isDescribe-title">
					<view v-for="(item,index) in explain" :key="index">{{item}}</view>
				</view>
				<view class="isDescribe-button" @tap="$refs.isDescribe.close()">我知道了</view>
			</view>
		</uni-popup>
		<!-- <spec-popu :isPopup="isDescribe" @close="isDescribe = false">
			<template #body>
				
			</template>
			
		</spec-popu> -->
	</view>
</template>

<script>
	import uniNavBar from '../../components/uni-nav-bar/uni-nav-bar.vue'
	import uniIcons from '../../components/uni-icons/uni-icons.vue'
	import progressBar from '../../components/progress-bar/ProgressBar.vue'
	import myButton from '../../components/my-button/MyButton.vue'
	import spellGood from '../../components/spellGood/spellGood.vue'
	import spellHistorical from '../../components/spellHistorical/spellHistorical.vue'
	import Popup from '@/components/Popup/Popup.vue'
	import specPopu from '@/components/specPopu/specPopu.vue'
	import uniNumberBox from '../../components/uni-number-box/uni-number-box.vue'
	import uniPopup from '../../components/uni-popup/uni-popup.vue'

	import throttle from '../../common/throttle.js';
	import HorseLamp from '@//components/horse-lamp/HorseLamp.vue'
	import {
		displaySocketMsg
	} from '@/common/minxins/mixins.js'

	// 客服组件
	import yuKefu from '@/components/yu-kefu/yu-kefu.vue'
	export default {
		components: {
			uniNavBar,
			uniIcons,
			progressBar,
			myButton,
			spellGood,
			spellHistorical,
			Popup,
			specPopu,
			uniNavBar,
			HorseLamp,
			uniPopup,
			yuKefu
		},
		mixins: [displaySocketMsg],
		computed: {
			breakNum: {
				get: function() {
					let _breakNum = 0
					_breakNum = (this.specDetail.price / this.primaryPrice) * 10
					return _breakNum.toFixed(2)
				}
			}
		},
		data() {
			return {
				spuId: '',
				shareId: '',
				activeId: 1, // 活动id
				freight: 0, // 运费
				spuName: '', // 商品名字
				primaryPrice: '', // 原价
				price: '', // 拼团价
				bannerImages: [], // 轮播图
				bannerVideos: [], // 轮播视频
				detailImages: [], // 详情图
				specNames: [], // 规格名称列表
				specValues: [], // 规格值列表
				specSelected: [], // 选中的规格
				shadow: false,
				tabActive: 1,
				SpellGroupList: [], // 正在拼团的列表
				tabList: [{
						id: 1,
						name: '最热拼团好物'
					},
					{
						id: 2,
						name: '拼团历史'
					}
				],
				historyDate: '', // 拼团历史事件
				pageNum: 1,
				total: 0,
				spellGoodList: [], // 拼团好物列表
				historyList: {}, // 拼团历史列表
				isPopupList: false, // 控制拼团列表弹窗
				groupList: [],
				isPopupJoin: false, // 控制弹出参团界面弹窗
				isPopUpJoinList: false, // 控制弹出参团列表弹窗
				isSpecPopup: false,
				joindetail: {},
				joinList: [],
				specDetail: {}, // sku规格商品信息
				grouponDetail: {}, // 团队详情
				grouponDetailShow: false,
				productCount: 1,
				commander: '', // 团长头像
				productImgShow: true,
				explain: '', // 拼团说明
				isDescribe: true,
				explainShow: false,
				groupCount: 0,
				richtext: '',
				spuExtraInfo: {} // 商品附加信息
			}
		},
		watch: {
			// tabActive
			historyDate: function(val, newVal) {
				this.getGoodAndHistory()
			}
		},
		onLoad(option) {
			console.log(option)
			this.historyDate = this.$common.newDate(new Date)
			this.spuId = option.spuId
			this.getGrouponInfo(option.spuId)
			this.getProductDetail(option.spuId)

			if (option.shareId) {
				this.shareId = option.shareId
				if (option.grouponDetailShow === true) {
					this.grouponDetailShow = option.grouponDetailShow
				}
				if (option.grouponId) {
					this.getGrouponPage(option.grouponId)
				}

				// this.isSpecPopup = true

			}

			// this.getSpellGroupList()
			this.getGoodAndHistory()
		},
		onShow() {
			const token = uni.getStorageSync('token');
			console.log(token, 'token');
			// 有token的情况下 再获取方法
			if (!token) {
				this.$common.loginGetToken(this.shareId)
			}
		},
		onReady() {
			this.videoContext = uni.createVideoContext('myVideo');
			this.videoContext.play()
		},
		onHide() {
			console.log('onHide')
			// 清除定时器
			this.videoContext.pause()
		},
		methods: {
			// 自定义导航栏返回事件
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 根据商品spuId获取商品拼团信息
			getGrouponInfo(spuId) {
				this.$common.httpGet('common-goods/upMall/groupon/spu/' + spuId).then(res => {
					if (res.data.code === 200200) {
						this.activeId = res.data.data.activityId
						let explain = res.data.data.describe
						if(explain) {
							let arr = explain.replace(/\n/g, "|").split("|")
							this.explain = arr.filter(v => v.toString().trim())
						}
						
						// this.explain = res.data.data.describe
						this.groupCount = res.data.data.groupCount
						console.log(res.data.data.groupCount)
						if (this.explain.length > 20) {
							this.explainShow = true
						}
						this.getSpellGroupList(res.data.data.activityId)
					}
				})
			},
			// 获取商品信息
			getProductDetail(spuId) {
				this.$common.httpGet('common-goods/common/spuDetail', {
					spuId: spuId,
					system: 'UPMALL'
				}).then(res => {
					if (res.data.code === 200200) {
						console.log(res.data.data, "ProductDetail")
						this.spuName = res.data.data.spuName
						this.primaryPrice = res.data.data.primaryPrice
						this.bannerImages = this.returnProductRoll(res.data.data.rollImage, 1)
						this.bannerVideos = this.returnProductRoll(res.data.data.rollImage, 2)
						this.detailImages = res.data.data.detailImage
						this.specNames = this.returnSpec(res.data.data.spec, 1)
						this.specValues = this.returnSpec(res.data.data.spec, 2)
						this.specSelected = this.returnSpecSelected()
						this.getStandardInfo()
						this.getSpuExtraInfo()
						if (this.bannerVideos.length > 0) {
							this.productImgShow = false
						}
					}
				})
			},
			// 获取商品背后的故事
			getSpuExtraInfo() {
				this.$common.getNoToken('common-goods/upMall/uncalibrated/spuExtraInfo/' + this.spuId).then(res => {
					if (res.data.code === 200200) {
						this.spuExtraInfo = res.data.data;
						// let explain = res.data.data.recommendReason
						// let arr = explain.replace(/\n/g, "|").split("|")
						// this.explain = arr.filter(v => v.toString().trim())
						let richtext = res.data.data.introduction
						if (richtext) {
							const regex = new RegExp('<img', 'gi');
							richtext = richtext.replace(regex, `<img style="width: 100%;display: block"`)
						}
						this.richtext = richtext
					}
				});
			},
			// 规格值的选择
			selectSpec(index, pid) {
				this.productCount = 1
				// let list = this.specValues
				this.specSelected[index] = pid
				console.log(this.specSelected)

				this.specValues[index].forEach(sonItem => {
					if (sonItem.specValueId === pid) {
						// sonItem.selected = true
						this.$set(sonItem, 'selected', true)
					} else {
						this.$set(sonItem, 'selected', false)
						// sonItem.selected = false
					}
				})
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
			// 选择规格后的商品信息
			getStandardInfo() {
				// let specId = [];
				// for (let i = 0; i < this.specSelected.length; i++) {
				// 	specId.push(this.specSelected[i].specValueId);
				// }
				let specId = this.specSelected;
				this.$common.httpGet('common-goods/common/skuSpec', {
					spuId: this.spuId,
					specValueIdList: String(specId),
					system: 'UPMALL'
				}, false).then(res => {
					if (res.data.code === 200200) {
						this.specDetail = res.data.data;
						// this.optionInfo.skuId = this.specDetail.skuId;
						this.getPrice(res.data.data.skuId);
						// this.$common.httpGet('common-goods/upMall/userPrice/sku/'+this.specDetail.skuid).then(res => {

						// })
					} else {
						this.$common.showToast(res.data.desc, 'none');
					}
				});
			},
			// 获取拼团的价格
			getPrice(skuId) {
				this.$common.httpGet('common-goods/upMall/groupon/skuPrice/' + skuId, false, false).then(res => {
					if (res.data.code === 200200) {
						this.specDetail.price = res.data.data
					}
				})
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
				this.specValues.forEach((item, idx) => {
					item.forEach((sonItem, sonIdx) => {
						if (sonIdx === 0) {
							sonItem.selected = true
							specSelected.push(sonItem.specValueId)
							// this.spcValues.push(sonItem.specValue)
						}
					})
				})
				return specSelected;
			},
			// 获取正在拼团的列表
			getSpellGroupList(activityId) {
				this.$common.httpGet('common-goods/upMall/groupon/spuGroupon/' + activityId).then(res => {
					if (res.data.code === 200200) {
						this.SpellGroupList = res.data.data
					}
				})
			},
			// 获取正在拼团中的参团列表
			getGrouponList(groupId, headName, img) {
				this.joindetail = {
					headName: headName,
					imgUrl: img
				}
				this.$common.httpGet('order/groupon/list', {
					grouponOrderId: groupId
				}).then(res => {
					this.isPopupList = false
					this.joinList = res.data.data.records
					this.isPopUpJoinList = true
				})
			},
			// 最热拼团好物与拼团历史切换
			tabActived(id) {
				if (id !== this.tabActive) {
					this.tabActive = id
				}
				this.pageNum = 1
				this.getGoodAndHistory()
			},
			// 获取拼团好物与拼团历史
			getGoodAndHistory() {
				if (this.tabActive === 1) {
					this.$common.httpGet('common-goods/upMall/groupon/recommend/6').then(res => {
						if (res.data.code === 200200) {
							this.spellGoodList = res.data.data
						}
					})
				} else {
					this.$common.httpGet('common-goods/upMall/groupon/history', {
						times: this.historyDate,
						pageNum: this.pageNum,
						pageSize: 10
					}).then(res => {
						if (res.data.code === 200200) {
							this.historyList = res.data.data.list
							this.total = res.data.data.total
							console.log(this.historyList, "historyList")
						}
					})
				}
			},
			// 拼团历史选择时间(组件里选择)
			changeHistoryDate(date) {
				this.historyDate = date
			},
			// 拼团历史的分页
			changePage(pageNum) {
				this.pageNum += pageNum
				this.$common.httpGet('common-goods/upMall/groupon/history', {
					times: this.historyDate,
					pageNum: this.pageNum,
					pageSize: 10
				}).then(res => {
					if (res.data.code === 200200) {
						this.historyList = this.historyList.concat(res.data.data.list)
						console.log(this.historyList, "historyList")
					}
				})
			},
			// 点击参团按钮
			handleJoin(grouponId, img) {
				this.isPopupList = false
				this.commander = img
				this.$common.httpGet('common-goods/upMall/groupon/grouponPage/' + grouponId).then(res => {
					if (res.data.code === 200200) {
						this.grouponDetail = res.data.data
						this.isPopupJoin = true
						this.grouponDetailShow = true
					}
				})
			},
			// 底部的立即开团或是立即参团
			bottomOps() {
				if (this.shareId) {

				} else {
					this.grouponDetailShow = false
					this.productCount = 1
				}
				this.isSpecPopup = true
			},
			// 从分享的页面过来的 （获取团队的详情接口）
			getGrouponPage(grouponId) {
				this.$common.httpGet('common-goods/upMall/groupon/grouponPage/' + grouponId).then(res => {
					if (res.data.code === 200200) {
						this.grouponDetail = res.data.data
						this.grouponDetailShow = true
						this.isSpecPopup = true
					}
				})
			},
			// 拼团弹窗中的参与拼团 按钮事件
			participationGroup() {
				this.isPopupJoin = false
				this.isSpecPopup = true
			},
			bindChange(val) {
				if (val) {
					this.productCount = val
				} else {
					this.productCount = val
				}
			},
			// 规格弹窗隐藏
			closeSpecPopup() {
				this.isSpecPopup = false
				this.grouponDetailShow = false
			},
			closeisPopupJoin() {
				this.isPopupJoin = false
				this.grouponDetailShow = false
			},
			// 规格弹窗确认 (跳转到下订单的页面)
			goConfirmOreder() {
				let _goodInfo = {}
				if (this.grouponDetailShow) {
					_goodInfo = {
						shareId: this.shareId ? this.shareId : '',
						productId: this.specDetail.skuId,
						productCount: this.productCount,
						freight: this.freight,
						grouponActivityId: this.activeId,
						joinGroupId: this.grouponDetail.grouponId,
						image: this.grouponDetail.cover,
						goodsName: this.spuName,
						price: this.specDetail.price,
						groupCount: this.groupCount
					}
					uni.setStorageSync('pintuanInfo', _goodInfo)
				} else {
					_goodInfo = {
						shareId: this.shareId ? this.shareId : '',
						productId: this.specDetail.skuId,
						productCount: this.productCount,
						freight: this.freight,
						grouponActivityId: this.activeId,
						joinGroupId: 0,
						image: this.specDetail.image,
						goodsName: this.spuName,
						price: this.specDetail.price,
						groupCount: this.groupCount
					}
					uni.setStorageSync('pintuanInfo', _goodInfo)
				}

				uni.navigateTo({
					url: '../confirmOreder/confirmOreder'
				})
			},

			// 回到首页
			goIndex() {
				uni.switchTab({
					url: '../index/index'
				});
			},
			// 跳转用户中心
			goUserInfo: throttle.throttleFunc(function() {
				let shareId = this.shareId ? this.shareId : '';
				this.$common.passUserauth(shareId).then(res => {
					console.log(res);
					if (res) {
						uni.switchTab({
							url: '../profile/profile'
						})
					} else {
						this.$common.navigateTo('../auth/auth?share=' + shareId + '&isAuth=2');
					}
				});
			}, 1500),
		},
		onShareAppMessage(res) {
			let userInfo = this.$common.getStorage('userInfo')
			if (res.from === 'buttom') {
				console.log('按钮分享')
			}

			return {
				title: '￥' + this.specDetail.price + this.spuName,
				imageUrl: this.bannerImages[0].image,
				path: 'pages/groupGoodsDetails/groupGoodsDetails?spuId=' + this.spuId + '&shareId=' + userInfo.shareId +
					'&grouponDetailShow=false'
			}
		}
	}
</script>

<style lang="less" scoped>
	page {}

	.groupGoodsDetails {
		background: #f8f6f9;

		.groupGoodsDetails-banner {
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

			.horse-lamp {
				position: absolute;
				top: 170upx;
				left: 32upx;
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

			.joint-list {
				position: absolute;
				top: 158upx;
				left: 32upx;

				.joint-item {
					display: flex;
					background-color: rgba(0, 0, 0, .7);
					align-items: center;
					height: 60upx;
					padding: 0 20upx 0 10upx;
					border-radius: 30upx;

					.avatar {
						width: 48upx;
						height: 48upx;
						border-radius: 50%;
						margin-right: 8upx;
					}

					.desc {
						font-size: 26upx;
						color: #fff;
					}
				}
			}
		}

		.groupGoodsDetails-con1 {
			.groupGoodsDetails-con1-top {
				display: flex;
				background: #06B720;

				.goodName {
					flex: 1;
					background: #06B720;
					color: rgba(255, 255, 255, 1);
					// font-weight: bold;
					// font-size: 20rpx;
					padding: 10rpx 20rpx;
					word-break: break-all;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;

					.discount {
						display: inline-block;
						background: rgba(164, 196, 245, 1);
						min-width: 80rpx;
						padding: 0 10rpx;
						height: 40rpx;
						line-height: 40rpx;
						text-align: center;
						border-radius: 20rpx;
						// color: rgba(255, 255, 255, 1);
						font-size: 20rpx;
						font-weight: 500;
					}

					.gname {
						font-size: 28rpx;
						font-weight: bold;


					}
				}

				.price::after {
					content: '';
					width: 0;
					height: 2rpx;
					border: 10rpx solid;
					// border-bottom: 20rpx solid;
					position: absolute;
					top: 50%;
					left: -16rpx;
					border-color: transparent rgba(255, 231, 204, 1) transparent transparent;
					transform: translate(0, -50%);
				}

				.price {
					width: 228rpx;
					// height: 116rpx;
					position: relative;
					background: rgba(255, 231, 204, 1);
					text-align: center;

					.price-1 {
						color: rgba(231, 2, 2, 1);
						font-weight: bold;
					}

					.price-2 {
						margin-top: 8rpx;
						color: rgba(153, 153, 153, 1);
						text-decoration: line-through;
						font-weight: 500;
					}
				}
			}

			.groupGoodsDetails-con1-bottom {
				background-color: rgba(255, 255, 255, 1);

				.groupName {
					display: flex;
					align-items: center;

					.imgs {
						display: flex;
						align-items: center;

						.colonelImg {
							overflow: hidden;
							width: 52rpx;
							height: 52rpx;
							border: 2rpx solid rgba(231, 2, 2, 1);
							border-radius: 50%;
							position: relative;

							.title {
								width: 100%;
								text-align: center;
								position: absolute;
								bottom: 0;
								left: 0;
								background: rgba(231, 2, 2, 1);
								font-size: 16rpx;
								color: rgba(255, 255, 255, 1);
								font-weight: 500;
							}
						}

						.img {
							transform: translateX(-12rpx);
							width: 48rpx;
							height: 48rpx;
							border-radius: 50%;
							background-color: #4CD964;
						}
					}
				}

				.groupGoodsDetails-con1-bottom-1 {
					display: flex;
					align-items: center;
					justify-content: space-between;
				}

				.explain {
					width: 80%;
					padding: 36rpx 20rpx;
					display: flex;
					align-items: center;

					.explain-icon {
						width: 80rpx;
						height: 40rpx;
						line-height: 40rpx;
						background: rgba(164, 196, 245, 1);
						border-radius: 20px;
						text-align: center;
						color: rgba(255, 255, 255, 1);
						font-size: 20rpx;
					}

					.explain-title {
						// flex: 1;
						width: 400rpx;
						margin-left: 18rpx;
						color: rgba(51, 51, 51, 1);
						font-size: 26rpx;
						font-weight: 500;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
			}
		}

		.groupGoodsDetails-con2 {
			margin-top: 20rpx;
			background-color: rgba(255, 255, 255, 1);
			padding: 0 20rpx;

			.groupGoodsDetails-con2-title {
				height: 80rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.left-title {
					color: rgba(51, 51, 51, 1);
					font-size: 28rpx;
					font-weight: 500;
				}

				.right-more {
					color: rgba(128, 128, 128, 1);
					font-size: 24rpx;
				}
			}

			.groupGoodsDetails-con2-groupbuylist {
				.groupbuylist-item {
					height: 106rpx;
					display: flex;
					align-items: center;
					border-top: 2rpx solid rgba(242, 242, 242, 1);

					.item-left {
						width: 55%;
						display: flex;
						align-items: center;

						.imgs {
							display: flex;
							align-items: center;

							.colonelImg {
								overflow: hidden;
								width: 52rpx;
								height: 52rpx;
								border: 2rpx solid rgba(231, 2, 2, 1);
								border-radius: 50%;
								position: relative;
								z-index: 2;

								.title {
									width: 100%;
									text-align: center;
									position: absolute;
									bottom: 0;
									left: 0;
									background: rgba(231, 2, 2, 1);
									font-size: 16rpx;
									color: rgba(255, 255, 255, 1);
									font-weight: 500;
								}
							}

							.img {
								transform: translateX(-12rpx);
								width: 48rpx;
								height: 48rpx;
								border-radius: 50%;
								overflow: hidden;
								background-color: #4CD964;
							}

							image {
								width: 100%;
								height: 100%;
							}
						}

						.group-name {
							flex: 1;
							margin-left: 16rpx;
							color: rgba(51, 51, 51, 1);
							font-size: 26rpx;
							font-weight: 500;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;

						}
					}

					.item-right {
						flex: 1;
						display: flex;
						align-items: center;
						justify-content: space-between;
					}
				}
			}
		}

		.groupGoodsDetails-con3 {
			margin-top: 20rpx;
			background-color: rgba(255, 255, 255, 1);
			padding: 10rpx 14rpx 20rpx 16rpx;

			.groupGoodsDetails-con3-tab {
				display: flex;
				justify-content: space-around;
				height: 68rpx;
				font-size: 28rpx;
				color: rgba(128, 128, 128, 1);
				font-size: 500;

				view {
					padding: 0 10rpx;
					line-height: 68rpx;
				}

				.tabActive {
					color: rgba(51, 51, 51, 1);
					font-size: 28rpx;
					font-weight: bold;
					border-bottom: 4rpx solid #06B720;
				}
			}
		}

		.groupGoodsDetails-particulars {
			margin-top: 20rpx;
			background: #ffffff;
			margin-bottom: 104rpx;

			.groupGoodsDetails-particulars-title {
				line-height: 88rpx;
				text-align: center;
				color: rgba(0, 0, 0, 1);
				font-size: 24rpx;
			}

			.groupGoodsDetails-particulars-img {
				width: 100%;
				display: block;

				image {
					width: 100%;
				}
			}
		}

		.groupGoodsDetails-bottom {
			width: calc(100vw - 20px);
			height: 98rpx;
			background: rgba(247, 247, 247, 1);
			box-shadow: 0px 0px 4px 0px rgba(217, 217, 217, 1);
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 3;
			display: flex;
			align-items: center;
			padding: 0 20rpx;
			justify-content: space-between;

			.groupGoodsDetails-bottom-left {
				display: flex;

				.iconImg {
					margin-left: 42rpx;
				}

				.iconImg2 {
					margin-left: 56rpx;
				}
			}

			.groupGoodsDetails-bottom-right {
				background: #06B720;
				width: 436rpx;
				// flex: 1;
				height: 72rpx;
				border-radius: 36rpx;
				display: flex;
				align-items: center;
				justify-content: space-around;

				.price {
					font-weight: bold;
					color: rgba(255, 255, 255, 1);
				}

				.ops {
					font-size: 28rpx;
					font-weight: bold;
					color: rgba(255, 255, 255, 1);
				}
			}
		}
	}

	.btn1 {
		width: 500rpx;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		border-radius: 40rpx;
		background: rgba(128, 128, 128, 1);
		font-size: 28rpx;
		color: #fff;
		margin: 30upx auto 20upx;
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
			padding: 22upx;
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
		.body {
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
			max-height: 600upx;
			overflow: auto;

			.header-wrap {
				display: flex;

				.leader-info {
					padding-left: 50upx;
					display: flex;
					flex-direction: column;
					justify-content: space-around;

					.leader-name,
					.good-desc {
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
						padding: 20upx 0;
						border-bottom: 1px solid #F7F7F7;

						.buyer,
						.num,
						.time {
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

	.spec {
		padding-left: 32rpx;

		.groupName {
			line-height: 94rpx;
			color: #06B720;
			font-weight: bold;
			padding-left: 26rpx;
			border-bottom: 2rpx solid rgba(242, 242, 242, 1);
		}

		.spe-good-img {
			padding-left: 26rpx;
			padding-top: 32rpx;
			padding-bottom: 48rpx;
			display: flex;
			align-items: flex-end;

			// justify-content: space-between;
			image {
				width: 200rpx;
				height: 200rpx;
			}

			.spe-good-right {
				flex: 1;
				display: flex;
				justify-content: space-between;
			}

			.spec-price {
				margin-left: 60rpx;
				font-size: 28rpx;
				color: rgba(205, 0, 0, 1);
			}

			.spec-stock {
				font-size: 28rpx;
				color: rgba(128, 128, 128, 1);
				margin-right: 40rpx;
			}
		}

		.attr-list {
			font-size: 26rpx;

			.specname {
				color: rgba(51, 51, 51, 1);
				font-weight: 500;
			}

			.specvalues {
				display: flex;
				flex-wrap: wrap;
				margin-top: 30rpx;
				border-bottom: 2rpx solid rgba(242, 242, 242, 1);

				text {
					display: flex;
					align-items: center;
					justify-content: center;
					background: #eee;
					margin-right: 20upx;
					margin-bottom: 30upx;
					border-radius: 100upx;
					min-width: 96upx;
					height: 60upx;
					padding: 0 20upx;
					font-size: 26rpx;
					font-weight: 500;
				}

				.selected {
					background: #06B720;
					color: rgba(255, 255, 255, 1);
				}
			}
		}

		.con_count {
			border-bottom: 2rpx solid rgba(242, 242, 242, 1);

			.title {
				margin-top: 32rpx;
				color: rgba(51, 51, 51, 1);
				font-size: 26rpx;
				font-weight: 500;
			}

			.count {
				margin-top: 30rpx;
				margin-bottom: 26rpx;
			}
		}

		.spec-bottom {
			margin-top: 44rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			.spec-bottom-btn {
				width: 500rpx;
				height: 80rpx;
				text-align: center;
				line-height: 80rpx;
				background: #06B720;
				border-radius: 40rpx;
				color: rgba(255, 255, 255, 1);
				font-size: 28rpx;
				font-weight: bold;
			}
		}
	}

	.isDescribe {
		background-color: rgba(255, 255, 255, 1);
	}

	.isDescribe-title {
		padding: 40rpx 30rpx;
		// line-height: 40rpx;
		font-size: 26rpx;
		color: #333333;
	}

	.isDescribe-button {
		background: #06B720;
		color: rgba(255, 255, 255, 1);
		font-weight: 300;
		text-align: center;
		line-height: 90rpx;
		font-size: 28rpx;
	}
</style>
