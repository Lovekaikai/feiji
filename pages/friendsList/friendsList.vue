<template>
  <view class="friends-List">
		<yu-kefu position="3"></yu-kefu>
    <!-- 标题 start -->
    <view class="title-banner">    
      <view class="my-avatar" v-if="Object.keys(userInfo).length > 0">
        <image class="avatar" :src="userInfo.avatar"></image>
        <view class="name">{{userInfo.nickName}}</view>
      </view>
      <view class="dec">成功绑定的好友数量(个)</view>
      <view class="num" v-if="friendsList.length===0">{{0}}</view>
      <view class="num" v-else >{{total}}</view>
    </view>

    <!-- 标题 end -- >

    <!-- 好友列表  start -->
    <view class="item_list">
      <view class="item" v-for="(item,index) in friendsList" :key="index">
        <view class="left">         
          <image v-if="item.avatar.length==0" src="../../static/images/mine.png" mode='widthFix' class="logo"></image>
          <image v-else :src="item.avatar" mode='widthFix' class="logo"></image>
        </view>
        <view class="center">         
          <view  class="name">{{item.nickName}}</view>
          <view class="time">绑定时间:{{item.createTime}}</view>
        </view>
        <view class="right">
          <view class="new">{{item.userLevel}}</view>
        </view>
      </view>
     
      <view class="notThing" v-if="friendsList.length===0" >
				 <view class="txt">暂无绑定好友!</view>
			</view>
    </view>
    <!-- 好友列表  end -->

    <!-- 回到顶部 -->
		<view class="index-ops">		
			<view class="ops-goTop" @tap="top">
				<image src="../../static/images/goTop.png" mode="" v-if="topShow"></image>
			</view>
		</view>
  </view>
</template>

<script>
import { UserInfo } from "./friendsList.js";
import yuKefu from '@/components/yu-kefu/yu-kefu.vue'
export default {
  components: {
		yuKefu
	},
  data() {
    return {
      //好友列表明细
      friendsList: [],
      userInfo: {}, // 用户信息
      topShow: false, //回到顶部
      //分页参数
      param: {
        pageNum: 1,
        pageSize: 10
      },
      total:"",//总条数
    };
  },
  onLoad() {
    this.getfriendsList();
  },
  //页面滚动到底部的事件 上拉加载更多
  onReachBottom() {
    //判断下拉到底 没有更多数据
    // console.log(this.friendsList.length)
    if (this.total < this.param.pageNum * this.param.pageSize) {      
      return;
    }
    this.param.pageNum++;
    this.getfriendsList();
  },
  //下拉刷新
  // onPullDownRefresh() {
  //   console.log("下拉刷新了");
  //   this.param.pageNum = 1;
  //   this.friendsList = [];
  //   setTimeout(() => {
  //     this.friendsList(() => {
  //       uni.stopPullDownRefresh();
  //     });
  //   }, 1000);
  // },
  async onShow() {
    await this.getLocalInfo();
  },
  methods: {
    // 调用获取用户详情
    getUserInfo() {
      return new Promise(resolve => {
        const userInfo = this.$common.goGetUserInfo(false, false);
        console.log(userInfo);
        resolve(userInfo);
      });
    },
    // 获取本地用户信息
    getLocalInfo() {
      this.$common.goGetUserInfo(false, 3).then(userInfo => {
        this.userInfo = new UserInfo(userInfo);
      });
    },
    //拼团活动列表
    getfriendsList(callBack) {
      this.$common
        .httpGet(
          `/user/userFriend/getPages?pageNum=${this.param.pageNum}&pageSize=${
            this.param.pageSize
          }`
        )
        .then(res => {
          if (Number(res.data.code) === 100200) {
            // console.log(res);
            //把数据更新到原来数组添加
            this.friendsList = [...this.friendsList, ...res.data.data.records];
            this.total= res.data.data.total
            // console.log(this.total)
            callBack && callBack();
          } else {
            this.friendsList = [];
            this.$common.showToast(res.data.message, "none");
          }
        });
    },
    onPageScroll(e) {
      if (e.scrollTop > 400) {
        this.topShow = true;
      } else {
        this.topShow = false;
      }
    },
    // 回到顶部
    top() {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    }
  }
};
</script>

<style lang="less" scoped>
.friends-List {
  height: 100vh;


  // 标题 start
  .title-banner {
    width: 100%;
    height: 383rpx;  
    background: url("https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2020/5/20/ae65cd07-12c9-4dbc-94d3-6331f23a71f5.png");
    background-size: cover;
    font-family: PingFang SC;
    color: rgba(255, 255, 255, 1);
    .my-avatar {
      display: flex;
      flex-direction: column;
      position: relative;
      align-items: center;
      padding: 22rpx 0 43rpx 0;
      .avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        // margin-bottom: 12rpx;
      }
      .name {
        font-size: 30rpx;
        font-weight: bold;
      }
    }
    .dec {
      margin-left: 65rpx;
      font-size: 30rpx;
      font-weight: 500;
    }
    .num {
      margin-top: 15rpx;
      margin-left: 65rpx;
      font-size: 60rpx;
      font-weight: bold;
    }
  }
  //列表
  .item_list {
    padding: 0 32rpx;
    margin-top: 30rpx;
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 151rpx;
      width: 100%;
      border-bottom: 1px solid rgba(242, 242, 242, 1);
      .left {
        flex: 1;
        .logo {
          width: 99rpx;
          height: 99rpx;
          background: rgba(255, 255, 255, 1);
          border-radius: 50%;
        }
      }
      .center {
        flex: 4;
        font-family: PingFang SC;
        font-weight: 500;
        .name {
          font-size: 30rpx;
          color: rgba(51, 51, 51, 1);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .time {
          padding-top: 10rpx;
          font-size: 26rpx;
          color: rgba(128, 128, 128, 1);
          font-size: 30rpx;
        }
      }
      .right {
        flex: 1;
        .new {
          font-size: 28rpx;
          font-family: PingFang SC;
          font-weight: bold;
          color: #06B720;
        }
      }
    }
    .notThing{
        margin: 50px auto;
        .txt{
          text-align: center;
          font-size: 30rpx;
          font-family: PingFang SC;
          font-weight: bold;
        }
    }
  }
  //回到顶部
  .index-ops {
    position: fixed;
    bottom: 80rpx;
    right: 30rpx;
    .user {
      width: 100rpx;
      height: 100rpx;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .ops-goTop {
      margin-top: 14rpx;
      width: 100rpx;
      height: 100rpx;
      image {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
