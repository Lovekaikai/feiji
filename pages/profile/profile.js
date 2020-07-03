


// 用户基本信息
export class UserInfo {
	constructor(info) {
	    this.nickName = info.nickName  // 昵称
		this.avatar = info.avatar  //头像
		this.userLevel = info.userLevel  //等级
		this.shareId = info.shareId  //shareId
	}
}


export const formatLevel = (level) => {
	switch(level) {
		case 0:
		return '新人';
		break;
		case 1:
		return '铜牌会员';
		break;
		case 2:
		return '银牌会员';
		break;
		case 3:
		return '金牌会员';
		break;
		case 4:
		return '事业伙伴';
		break;
		case 5:
		return '经销商';
		break;
		case 6:
		return '官方代理';
		break
	}
}