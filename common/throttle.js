function throttleFunc(func, marginTime) {
	if (marginTime == undefined || marginTime == null) {
		marginTime = 1700
	}
	let lastTime = null
	return function () {
		let currentTime = + new Date()
		if (currentTime - lastTime > marginTime || !lastTime) {
			func.apply(this, arguments)
			lastTime = currentTime
		}
	}
}

export default {
	throttleFunc
}