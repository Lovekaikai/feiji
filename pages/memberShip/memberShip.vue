<template>
	<view class="member-ship">
		<yu-kefu position="3"></yu-kefu>
		
		<!-- 卡牌等级 -->
		<level-cards :user-info="userInfo" :level="level" @changeCurrent='changeCurrent'></level-cards>

		<!-- 我的特权 -->
		<my-authority :user-info="userInfo" :current='current'></my-authority>

		<!-- 如何升级 -->
		<update-way :user-info="userInfo" v-if="showUpdateWay"></update-way>
	</view>
</template>

<script>
import LevelCards from '../../components/memberShip/LevelCards.vue';
import MyAuthority from '../../components/memberShip/MyAuthority.vue';
import UpdateWay from '../../components/memberShip/UpdateWay.vue';
import yuKefu from '@/components/yu-kefu/yu-kefu.vue'

export default {
	components: {
		LevelCards,
		MyAuthority,
		UpdateWay,
		yuKefu
	},
	data() {
		return {
			userInfo: {},  //用户基本信息
			level: [
				{
					userLevel: 4,  // 事业伙伴
					image: 'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/4/1/bc5bfc6b-5342-421a-96ea-cc5d73d22292.png',
					desc : '购买2999元套餐即可升级'
				},
				{
					userLevel: 5,  // 经销商
					image: 'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/4/1/b4798fd4-f708-4a7a-b42a-465fe97157d7.png',
					desc : '购买2999元套餐即可升级'
				},
				{
					userLevel: 6,  //官方代理
					image: 'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/4/1/5369f336-dc58-42a4-9cc1-3ccd73293b2b.png',
					desc : '购买4999元套餐即可升级'
				}
			],
			showUpdateWay : true,
			current: ''
		};
	},
	onLoad(option) {
		this.userInfo = JSON.parse(decodeURIComponent(option.userInfo))
		console.log(this.userInfo,"userInfo")
		
		const {type , userLevel } = this.userInfo
		// 先判断是会员还是代理
		if(type === 0) {
			//  当前是新人或会员
			this.level.unshift({
				userLevel: 0,
				image: 'https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/4/1/ae898c81-7acf-46a3-a3d1-2a24e6f840dc.png',
				desc : '距离升级还差邀请一位新人购买'
			})
			this.$set(this.level[1],"userLevel",1)
			this.$set(this.level[2],"userLevel",2)
			this.$set(this.level[3],"userLevel",3)
			this.current = userLevel
			switch(userLevel) {
				case 0:   // 新人
				this.userInfo.score = 0  //星星
				this.$set(this.level[0],"desc","距离升级还差邀请一位新人购买")
				this.$set(this.level[1],"desc","距离升级还差邀请一位新人购买")
				this.$set(this.level[2],"desc","距离升级还差邀请两位新人购买")
				this.$set(this.level[3],"desc","距离升级还差邀请三位新人购买")
				break
				case 1:  // 铜牌会员
				this.userInfo.score = 1
				this.$set(this.level[0],"desc","你已超越该等级")
				this.$set(this.level[1],"desc","距离升级还差邀请一位新人购买")
				this.$set(this.level[2],"desc","距离升级还差邀请一位新人购买")
				this.$set(this.level[3],"desc","距离升级还差邀请两位新人购买")
				break
				case 2:  // 银牌会员
				this.userInfo.score = 2
				this.$set(this.level[0],"desc","你已超越该等级")
				this.$set(this.level[1],"desc","你已超越该等级")
				this.$set(this.level[2],"desc","距离升级还差邀请一位新人购买")
				this.$set(this.level[3],"desc","距离升级还差邀请一位新人购买")
				break
				case 3:  //金牌会员
				this.userInfo.score = 3
				this.$set(this.level[0],"desc","你已超越该等级")
				this.$set(this.level[1],"desc","你已超越该等级")
				this.$set(this.level[2],"desc","你已超越该等级")
				this.$set(this.level[3],"desc","您已到达会员最大级别")
				// this.showUpdateWay = false  // 不显示升级
				break
			}
		}
		
		if(type === 1) {
			
			// 当前是代理商
			switch(userLevel) {
				case 4:  // 事业伙伴
				this.$set(this.level[0],"desc","购买2999元套餐即可升级")
				this.$set(this.level[1],"desc","购买2999元套餐即可升级")
				this.$set(this.level[2],"desc","购买4999元套餐即可升级")
				break
				case 5:   // 经销商
				this.$set(this.level[0],"desc","你已超越该等级")
				this.$set(this.level[1],"desc","购买4999元套餐即可升级")
				this.$set(this.level[2],"desc","购买4999元套餐即可升级")
				break
				case 6:  // 官方代理
				this.$set(this.level[0],"desc","你已超越该等级")
				this.$set(this.level[1],"desc","你已超越该等级")
				this.$set(this.level[2],"desc","您已达到代理商级别最大等级")
				console.log('进来了')
				this.showUpdateWay = false  //不显示升级
				break
			}
		}
		
		console.log(this.level,"level")
	},
	methods: {
		changeCurrent(num) {
			this.current = num
		}
	}
};
</script>

<style lang="less" scoped>
.member-ship {
	font-size: 26upx;
	color: #1d1c1c;
	background-color: #f8f6f7;
	padding-bottom: 117upx;
	min-height: 100vh;
}
</style>
