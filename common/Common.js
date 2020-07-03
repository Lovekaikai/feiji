import Vue from 'vue'
import store from '@/store/index.js'

let API_Url = 'https://mall.feijixianxian.com/'

export default class Common {

	// 登陆获取Token
	static loginGetToken(isHaveShared) {
		return new Promise((resolve, reject) => {


			// 1.wx获取登录用户code
			uni.login({
				provider: 'weixin',
				success: (res) => {
					console.log(res.code, "code")
					console.log("isHaveShared", isHaveShared)
					//把shareId拼接给后端向后台传递信息
					let param = isHaveShared ? isHaveShared : ""
					if (isHaveShared) {
						param = {
							shareId: isHaveShared
						}
					} else {
						param = false
					}
					uni.request({
						url: API_Url + 'user/wxAuth/login/' + res.code,
						data: param,
						method: 'GET',
						success: (res) => {
							// console.log(res.data)
							if (Number(res.data.code) === 100200) {
								//存token
								uni.setStorageSync("token", res.data.data.token)
								uni.setStorageSync("userInfo", res.data.data.userInfo)
								resolve(true)
							} else {
								uni.showToast({
									title: "参数异常"
								})
								reject(true)
							}
						}
					});
				},
			});
		})
	}


	//判断是否授权
	static passUserauth(shareId, type) {
		return new Promise((resolve) => {
			wx.checkSession({
				success() {
					console.log("获取用户信息")
					uni.getSetting({
						success(res) {
							if (res.authSetting['scope.userInfo']) {
								console.log('已经授权')
								// Common.goGetUserInfo(shareId, 2)
								resolve(true)
							} else {
								console.log('没有授权')
								resolve(false)
							}
						}
					})
				},
				fail() {
					// session_key 已经失效，需要重新执行登录流程
					console.log('失效')
					resolve(false)
				}
			})

		})
	}
	// 已经授权，可以直接调用 getUserInfo 获取头像昵称
	static goGetUserInfo(shareId, isAuth) {
		// 已经授权，可以直接调用 getUserInfo 获取头像昵称
		return new Promise((resolve) => {
			uni.getUserInfo({
				provider: 'weixin',
				success: (infoRes) => {
					//2.将用户登录code传递到后台置换用户SessionKey、OpenId等信息
					// 判断token是否过期
					Common.httpGet("user/userMember/past", null, false).then((res) => {
						// console.log(res)
						if (res.data.code !== 100200) {
							Common.loginGetToken(shareId).then((res) => {
								if (res) {
									if (isAuth === 1) {
										uni.navigateBack({
											delta: 1
										})
									} else if (isAuth === 2) {
										uni.reLaunch({
											url: '../profile/profile'
										})
									}
								}
								let param = {
									encryptedData: infoRes.encryptedData,
									iv: infoRes.iv,
									rawData: infoRes.rawData,
									signature: infoRes.signature
								}
								Common.httpPost("user/userMember/userInfo", param, false).then((res) => {
									const userInfo = res.data.data
									console.log(userInfo, "userInfo")
									uni.setStorageSync("userInfo", res.data.data)
									resolve(userInfo)
								})
							})

						} else {
							// Common.loginGetToken()
							//请求判断token是否过期
							if (!uni.getStorageSync("token")) {
								console.log('进来了')
								Common.loginGetToken(shareId).then((res) => {
									// console.log('进来了1')
									Common.saveUserMessage(infoRes).then(userInfo => {
										resolve(userInfo)
									})
									if (res) {
										if (isAuth === 1) {
											uni.navigateBack({
												delta: 1
											})
										} else if (isAuth === 2) {
											uni.reLaunch({
												url: '../profile/profile'
											})
										}
									}

								})
							} else {
								Common.saveUserMessage(infoRes).then(userInfo => {
									resolve(userInfo)
								})
								if (isAuth === 1) {
									uni.navigateBack({
										delta: 1
									})
								} else if (isAuth === 2) {
									uni.reLaunch({
										url: '../profile/profile'
									})
								}
							}

						}
						// if (isAuth && res.c) {
						// 	setTimeout(() => {
						// 		uni.navigateBack({
						// 			delta: 1
						// 		})
						// 	}, 2000)
						// }
					})

				}
			})
		})

	}

	static saveUserMessage(infoRes) {
		return new Promise((resolve) => {
			let param = {
				encryptedData: infoRes.encryptedData,
				iv: infoRes.iv,
				rawData: infoRes.rawData,
				signature: infoRes.signature
			}
			Common.httpPost("user/userMember/userInfo", param, false).then((res) => {
				const userInfo = res.data.data
				// console.log('userInfo',userInfo)
				uni.setStorageSync("userInfo", res.data.data)
				resolve(userInfo)
			})
		})
	}



	// get请求封装
	static httpGet(url, param, loading = true) {
		if (loading) {
			Common.loading()
		}
		// #ifdef APP-PLUS || MP-WEIXIN
		url = API_Url + url
		// #endif

		return new Promise((resolve, reject) => {
			Common.getToken().then((res) => {

				// url = API_Url + url
				uni.request({
					url: url,
					method: 'GET',
					data: param,
					header: {
						token: res
					},
					success: (res) => {
						resolve(res)
					},
					fail: (error) => {
						reject(res)
					},
					complete: () => {
						if (loading) {
							Common.hideLoading()
						}

					}
				})
			})
		})
	}

	// post请求封装
	static httpPost(url, param, loading = true) {
		if (loading) {
			Common.loading()
		}
		// #ifdef APP-PLUS || MP-WEIXIN
		url = API_Url + url
		// #endif
		return new Promise((resolve, reject) => {
			Common.getToken().then((token) => {
				// url = API_Url + url
				uni.request({
					url: url,
					method: 'POST',
					data: param,
					header: {
						token: token
					},
					success: (res) => {
						resolve(res)
					},
					fail: (error) => {
						reject(res)
					},
					complete: () => {
						if (loading) {
							Common.hideLoading()
						}

					}
				})
			})
		})
	}

	// get请求不需要token
	static getNoToken(url, param, loading = true) {
		if (loading) {
			Common.loading()
		}
		// #ifdef APP-PLUS || MP-WEIXIN
		url = API_Url + url
		// #endif
		return new Promise((resolve, reject) => {
			// url = API_Url + url
			uni.request({
				url: url,
				method: 'GET',
				data: param,
				success: (res) => {
					resolve(res)
				},
				fail: (error) => {
					reject(res)
				},
				complete: () => {
					if (loading) {
						Common.hideLoading()
					}

				}
			})
		})
	}
	// post请求(不需要token)
	static postNoToken(url, param, loading = true) {
		if (loading) {
			Common.loading()
		}
		return new Promise((resolve, reject) => {
			url = API_Url + url
			uni.request({
				url: url,
				method: 'POST',
				data: param,
				success: (res) => {
					resolve(res)
				},
				fail: (error) => {
					reject(res)
				},
				complete: () => {
					if (loading) {
						Common.hideLoading()
					}
				}
			})
		})
	}

	// 获取token
	static getToken() {
		return new Promise((resolve, reject) => {
			let token = uni.getStorageSync("token")
			resolve(token)
		})
	}
	// loading
	static loading(text = '加载数据中') {
		uni.showLoading({
			title: text,
			mask: true,
			duration: 1500
		})
	}
	static hideLoading() {
		uni.hideLoading()
	}

	// 弹窗提醒
	static showToast(text, mask = true) {
		uni.showToast({
			title: text,
			icon: 'none',
			mask: mask,
			duration: 1800
		})
	}

	// 弹窗提醒
	static showToast1(text, icon) {
		uni.showToast({
			title: text,
			icon: icon,
			duration: 3000
		})
	}

	// 跳转页面
	static navigateTo(url) {
		uni.navigateTo({
			url: url
		})
	}

	// 本地缓存: 存储
	static setStorage(key, data) {
		uni.setStorageSync(key, data)
	}
	// 本地缓存: 获取
	static getStorage(key) {
		let value = uni.getStorageSync(key)
		if (value) {
			return value
		} else {
			return false
		}
	}
	static setStoragePromise(key) {
		return new Promise((resolve, reject) => {
			resolve(uni.getStorageSync(key))
		})
	}

	// 生成海报的请求封装
	static posterHttp(url, param, loading = true) {
		if (loading) {
			Common.loading()
		}
		return new Promise((resolve, reject) => {
			uni.request({
				url: url,
				method: 'POST',
				data: param,
				success: (res) => {
					resolve(res)
				},
				fail: (error) => {
					reject(res)
				},
				complete: () => {
					if (loading) {
						Common.hideLoading()
					}
				}
			})
		})
	}
	static phoneReg(phone) {
		return /^(\+?213|0)(5|6|7)\d{8}$/.test(phone) ? true : /^(!?(\+?963)|0)?9\d{8}$/.test(phone) ? true :
			/^(!?(\+?966)|0)?5\d{8}$/.test(phone) ? true :
			/^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/.test(phone) ? true :
			/^(\+?420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/.test(phone) ? true :
			/^(\+?49[ \.\-])?([\(]{1}[0-9]{1,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/.test(phone) ?
			true :
			/^(\+?45)?(\d{8})$/.test(phone) ? true : /^(\+?30)?(69\d{8})$/.test(phone) ? true :
			/^(\+?61|0)4\d{8}$/.test(phone) ? true :
			/^(\+?44|0)7\d{9}$/.test(phone) ? true : /^(\+?852\-?)?[569]\d{3}\-?\d{4}$/.test(phone) ? true :
			/^(\+?91|0)?[789]\d{9}$/.test(phone) ? true :
			/^(\+?64|0)2\d{7,9}$/.test(phone) ? true : /^(\+?27|0)\d{9}$/.test(phone) ? true : /^(\+?26)?09[567]\d{7}$/.test(
				phone) ? true :
			/^(\+?34)?(6\d{1}|7[1234])\d{7}$/.test(phone) ? true :
			/^(\+?358|0)\s?(4(0|1|2|4|5)?|50)\s?(\d\s?){4,8}\d$/.test(phone) ? true : /^(\+?33|0)[67]\d{8}$/.test(phone) ? true :
			/^(\+972|0)([23489]|5[0248]|77)[1-9]\d{6}/.test(phone) ? true : /^(\+?36)(20|30|70)\d{7}$/.test(phone) ? true :
			/^(\+?39)?\s?3\d{2} ?\d{6,7}$/.test(phone) ? true : /^(\+?81|0)\d{1,4}[ \-]?\d{1,4}[ \-]?\d{4}$/.test(phone) ? true :
			/^(\+?6?01){1}(([145]{1}(\-|\s)?\d{7,8})|([236789]{1}(\s|\-)?\d{7}))$/.test(phone) ? true :
			/^(\+?47)?[49]\d{7}$/.test(phone) ? true :
			/^(\+?32|0)4?\d{8}$/.test(phone) ? true : /^(\+?47)?[49]\d{7}$/.test(phone) ? true :
			/^(\+?48)? ?[5-8]\d ?\d{3} ?\d{2} ?\d{2}$/.test(phone) ? true :
			/^(\+?55|0)\-?[1-9]{2}\-?[2-9]{1}\d{3,4}\-?\d{4}$/.test(phone) ? true :
			/^(\+?351)?9[1236]\d{7}$/.test(phone) ? true : /^(\+?7|8)?9\d{9}$/.test(phone) ? true :
			/^(\+3816|06)[- \d]{5,9}$/.test(phone) ? true : /^(\+?90|0)?5\d{9}$/.test(phone) ? true :
			/^(\+?84|0)?((1(2([0-9])|6([2-9])|88|99))|(9((?!5)[0-9])))([0-9]{7})$/.test(phone) ? true :
			/^(\+?0?86\-?)?1[345789]\d{9}$/.test(phone) ? true : /^(\+?886\-?|0)?9\d{8}$/.test(phone) ? true : false
	}
	// 函数节流
	static throttle(fn, time) {
		let last
		let timer
		const interval = time || 200
		return function() {
			const th = this
			const args = arguments
			const now = +new Date()
			if (last && now - last < interval) {
				clearTimeout(timer)
				timer = setTimeout(function() {
					last = now
					fn.apply(th, args)
				}, interval)
			} else {
				last = now
				fn.apply(th, args)
			}
		}
	}
	
	// 获取当前时间并格式化为(xxxx-xx-xx)
	static newDate (date) {
		let year = date.getFullYear()
		let month = date.getMonth() + 1
		let day = date.getDate()
		month = month <= 9 ? '0'+month : month
		day = day <= 9 ? '0'+day : day
		let currentdate  = year + '-' + month + '-' + day
		return currentdate
	}
}
