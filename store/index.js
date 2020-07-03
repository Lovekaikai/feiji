import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		goodInfo: {},  // 购买商品详情
		lockReconnect:false, //控制websocket
		launchOrder: []   // 发起拼单信息列表
	},
    mutations: {
		setGoodInfo(state,val){
			state.goodInfo = val
		},
		//设置链接
		setlockReconnect(status,param){
			status.lockReconnect=param
		},
		
		setLaunchOrder(state,playload) {
			state.launchOrder.push(playload)
		},
		delLaunchOrder(state) {
			state.launchOrder.shift()
		}
	},
    actions: {}
})
export default store