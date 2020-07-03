<template>
  <div class="total-wrap" :style="{marginTop: isMainNode?'22rpx':'6rpx'}">
    <div class="node-container">
      <div class="node-container-left">
        <div class="tag-container">
          <div class="node-tag-container">
            <div class="node-tag" :style="{'background-color': isNewest?'#06B720':'#CCCCCC'}"></div>
          </div>
        </div>
        <div class="line-container">
          <div v-if="!isFirst" class="line"></div>
        </div>
      </div>
      <div class="node-container-right" :style="{paddingTop: isMainNode?'0':'8rpx'}">
        <div v-if="isMainNode" class="node-title" :style="{color: isNewest?'#222':'#999'}">{{nodeData.statusName}}</div>
        <div class="node-time" :style="{color: '#808080', marginTop: isMainNode?'10rpx':'0'}">{{nodeData.createTime}}</div>        
        <div class="node-desc"  :style="{color: isNewest?'#CF0009':'#1D1D1D', marginTop: isMainNode?'10rpx':'0'}">
			{{acceptStationFixed}}
			<span v-if="nodeData.phone" class="node-phone">{{nodeData.phone}}</span>
		</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isNewest: {
      type: Boolean,
      default: false
    },
    isFirst: {
      type: Boolean,
      default: false
    },
    isMainNode: {
      type: Boolean,
      default: false
    },
    nodeData: {
      type: Object,
      default () {
        return {
          status: '',
          statusName: '',
          createTime: '2019-01-01 00:00:00',
          acceptStation: 'xxxxxx'
        }
      }
    }
  },
  computed: {
   
    acceptStationFixed () {
      if (!this.nodeData.acceptStation) return ''
      return this.nodeData.acceptStation.replace(/(\d{3})\d{4}(\d{4})/, '')
    }
  }
}
</script>
<style lang="scss" scoped>
.total-wrap {
  margin-top: 22rpx;
  width: 100%;
  .node-container {
    width: 100%;
    height: auto;
    display: flex;
    &-left {
      width: 44rpx;
      height: auto;
      .tag-container {
        width: 44rpx;
        height: 44rpx;
        img {
          width: 44rpx;
          height: 44rpx;
        }
        .node-tag-container {
          width: 44rpx;
          height: 44rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          .node-tag {
            width: 15rpx;
            height: 15rpx;
            background-color: #CCCCCC;
            border-radius: 50%;
          }
        }
      }
      .line-container {
        box-sizing: border-box;
        width: 44rpx;
		height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .line {
		  position: relative;
		  top: -10upx;
          width: 1rpx;
          // background-color: #dcdcdc;
		  height: 98%;
		  border-right: 2upx dashed #ccc;
        }
      }
    }
    &-right {
      flex: 1;
      box-sizing: border-box;
      padding: 0 10rpx 60upx 24rpx;
      .node-title {
        width: 100%;
        height: 40rpx;
        line-height: 44rpx;
        color: #222;
        font-size: 28rpx;
        font-family: 'PingFangSC-Medium';
      }
      .node-desc {
		display: inline-block;
        margin-top: 16rpx;
        width: 100%;
        min-height: 30rpx;
        line-height: 40rpx;
        color: #1D1D1D;
        font-size: 28rpx;
        font-family: 'PingFangSC-Regular';
        word-wrap: break-word;
        word-break: normal;
      }
      .node-phone {
		display: inline-block;
        height: 24rpx;
        line-height: 26rpx;
        color: #1655F2;
        font-size: 26rpx;
        font-family: 'Avenir-Medium';
      }
      .node-time {
        margin-bottom: 10rpx;
        width: 100%;
        height: 34rpx;
        line-height: 34rpx;
        color: #808080;
        font-size: 26rpx;
        font-family: 'PingFang-SC-Medium';
      }
    }
  }
}
</style>