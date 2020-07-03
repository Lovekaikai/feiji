export default class util {
	static mySetStorageSync(name,value){
	
		try {
			uni.setStorageSync(name,value) //记录是否第一次授权  false:表示不是第一次授权
		} catch (e) {}
	}
	
	static myGetStorageSync(name){
		return uni.getStorageSync(name)
	}
	
	static utilSplit(str){
		if(str.indexOf("省")>0 ){
			return str.slice(0,str.indexOf("省"))
		}else if(str.indexOf("壮")>0){
			return str.slice(0,str.indexOf("壮"))
		}else if(str.indexOf("维")>0){
			return str.slice(0,str.indexOf("维"))
		}else if(str.indexOf("宁")>0){
			return str.slice(0,str.indexOf("宁"))
		}else if(str.indexOf("市")>0){
			return str.slice(0,str.indexOf("宁"))
		}else if(str.indexOf("自")>0){
			return str.slice(0,str.indexOf("自"))
		}
		else{
			return str
		}
	}
	
}