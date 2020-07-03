// 保留朗威小数
export const toFiexedTwo = {
	filters: {
		//保留两位小数
		keepTowPoint(value) {
			return value.toFixed(2)
		}
	}
}

// 控制显示拼团推送消息
export const displaySocketMsg = {
	data() {
		return {
			msgObj: {},  // 信息对象
			msgIndex: 0,  // 信息的索引
			msgOpacity: 0,  // 控制信息的显现
			msgIntervalTimer: null,  // 控制setInterval的定时
			msgTimeOutTimer: null  // 控制setTimeOut  定时
		}
	},
	
	onShow() {
		// 调用获取信息的方法
		this.msgIntervalTimer = setInterval(() => {
			this.handleOnMsg()
		},8000)
	},
	
	computed: {
		groupMessage() {
				return this.$store.state.launchOrder.filter(v => !v.doWhat)
		}
	},
	
	methods: {
		// 获取拼团推送消息
		handleOnMsg() {
			// 有信息时
			console.log(this.groupMessage)
			if(this.groupMessage.length > 0) {
				this.msgObj = this.groupMessage[this.msgIndex]
				this.msgOpacity = 1
				
			  this.msgTimeOutTimer = setTimeout(() => {
					this.msgOpacity = 0
					// this.msgIndex = this.msgIndex + 1
					console.log(this.msgObj)
					this.$store.commit('delLaunchOrder')
					// 说明没有数据了 返回第一个  -- 循环
					// if(this.msgIndex >= this.groupMessage.length) {
					// 	console.log('推送完了')
					// 	// clearInterval(this.msgIntervalTimer)
					// }
			  },3000)
			}
		}
	},
	beforeDestroy() {
		console.log('beforeDestroy')
		clearTimeout(this.msgTimeOutTimer)
		clearInterval(this.msgIntervalTimer)
	},
	onHide() {
		console.log('onHide')
		// 清除定时器
		clearTimeout(this.msgTimeOutTimer)
		clearInterval(this.msgIntervalTimer)
	}
}