import Vue from 'vue'
import App from './App'
import http from './common/util.js'

Vue.prototype.$util = http
Vue.config.productionTip = false
import './static/style/iconfont/iconfont.css'
App.mpType = 'app'
import Common from './common/Common.js'

import store from './store/index.js'

// 创建事件总线
Vue.prototype.$bus = new Vue();

Vue.prototype.$common=Common

import skeleton from './components/skeleton/skeleton.vue'
Vue.component('skeleton',skeleton)

import countUp  from './components/p-countUp/countUp.vue'
Vue.component('countup',countUp)

const app = new Vue({
    ...App,
	store
})
app.$mount()
