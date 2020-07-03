<script>
import Vue from 'vue';

var SocketTask = null;
// 心跳检测
var heartCheck = {
	timeOut: 60000,
	timeOutTimer: null,
	serverTimeOutTimer: null,
	start() {
		console.log('heartCheck-start')
		this.timeOutTimer && clearTimeout(this.timeOutTimer)
		this.serverTimeOutTimer && clearTimeout(this.serverTimeOutTimer)
		this.timeOutTimer = setTimeout(() => {
			// 发送一个心跳 onmessage 拿到返回的心跳则说明连接正常
			SocketTask.send({data:"testLink"})
			this.serverTimeOutTimer = setTimeout(() => {
				SocketTask.close()
			},this.timeOut)
		},this.timeOut)
	}
}

export default {
	data() {
		return {
			socketUrl: 'wss://upmall.cntracechain.com/order/websocket/',  // 连接地址
			// socketUrl: 'wss://upmall.cntracechain.com/order/websocket/',  // 连接地址
			is_open_socket: false,  //确保websocket是打开状态
			timer: null,
			lockReconnect: false,
			reconnectTimer: null,
			shareId: null
		}
	},
	onLaunch: function() {
		console.log('App Launch');
		// #ifdef MP-WEIXIN
			this.autoUpdate();
			wx.showShareMenu({
				withShareTicket: true
			});
		// #endif
		
	},
	methods: {
		// 检测小程序更新
		autoUpdate() {
			console.log(new Date());
			var self = this;
			// 获取小程序更新机制兼容
			if (uni.canIUse('getUpdateManager')) {
				const updateManager = uni.getUpdateManager();

				//1. 检查小程序是否有新版本发布
				updateManager.onCheckForUpdate(res => {
					// 请求完新版本信息的回调

					if (res.hasUpdate) {
						//2. 小程序有新版本，则静默下载新版本，做好更新准备
						updateManager.onUpdateReady(function() {
							console.log(new Date());
							uni.showModal({
								title: '更新提示',
								content: '新版本已经准备好，是否重启应用？',
								success: function(res) {
									if (res.confirm) {
										//3. 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
										updateManager.applyUpdate();
									} else if (res.cancel) {
										//如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
										uni.showModal({
											title: '温馨提示~',
											content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
											success: function(res) {
												self.autoUpdate();
												return;
												//第二次提示后，强制更新
												if (res.confirm) {
													// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
													updateManager.applyUpdate();
												} else if (res.cancel) {
													//重新回到版本更新提示
													self.autoUpdate();
												}
											}
										});
									}
								}
							});
						});
						updateManager.onUpdateFailed(function() {
							// 新的版本下载失败
							uni.showModal({
								title: '已经有新版本了哟~',
								content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
							});
						});
					}
				});
			} else {
				// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
				uni.showModal({
					title: '提示',
					content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
				});
			}
		},

		createWebSocket() {
			try {
				SocketTask = uni.connectSocket({
					url: this.socketUrl + this.shareId,
					success() {
						console.log('socket success')
					}
				});
				this.init();
			} catch (e) {
				console.log('catch' + e);
				this.reconnect(wsUrl);
			}
		},
		
		init() {
			// 监听连接打开事件
			SocketTask.onOpen(() => {
				console.log('onOpen - 连接成功')
				// 心跳检测
				heartCheck.start()
			})
			// 监听连接关闭事件
			SocketTask.onClose(() => {
				console.log('onClose - 连接关闭')
				this.reconnect(this.socketUrl)
			})
			// 监听 WebSocket 错误事件
			SocketTask.onError(() => {
				console.log('onError - 异常')
				this.reconnect(this.socketUrl)
			})
			// 监听 WebSocket 接受到服务器的消息事件
			SocketTask.onMessage(res => {
				console.log('收到服务器内容：' + res.data);
				if(res.data === 'testLink') return
				let msgData = JSON.parse(res.data)
				this.$store.commit('setLaunchOrder',msgData)
				console.log(this.$store.state.launchOrder)
				heartCheck.start()
			})
		},
		
		// 重新连接
		reconnect(url) {
			if (this.lockReconnect) {
				return;
			};
			this.lockReconnect = true 
			// 没连接上会一直重连 设置延迟避免请求过多
			this.reconnectTimer && clearTimeout(this.reconnectTimer)
			this.reconnectTimer = setTimeout(() => {
				this.createWebSocket(url)
				this.lockReconnect = false 
			},40000)
			
		},
		
		// 检测链接,如果断开就重连
		checkConnectSocket() {
			// console.log(this.socket.readyState,"this.socket.readyState")
			if([2,3].includes(this.socket.readyState)) {
				this.socket.close()
				this.socket = null 
				this.connectSocketInit()
			}
		}
	},
	onShow() {
		uni.hideShareMenu({
			// #ifdef MP-WEIXIN
			
			// #endif
		})
		let userInfo = uni.getStorageSync('userInfo')
		this.shareId = userInfo.shareId
		console.log(this.shareId,"shareId")
		this.createWebSocket();
		// this.connectSocketInit();
		//  this.timer = setInterval(() => {
		// 	 this.checkConnectSocket()
		//  },60000)
		//  heartCheck.start()
	},

	onLoad: function() {},
	onHide() {
		uni.onSocketClose(() => {
			console.log('socket已被关闭')
		})
		uni.closeSocket({
			success() {
				console.log('WebSocket 已关闭！')
			}
		})
		// clearInterval(this.timer)
	}
};
</script>

<style lang="less">

/*每个页面公共css */
/* @import "uni.scss"; */
/* 	@import "colorui/main.css";
	@import "colorui/icon.css"; */
</style>
