<template>
  <div class="dragVerify" :style="{width: bgWidth + 'px'}">
    <guide-bar ref="dragGuideBar" @moving-drag="movingDrag" @finish-drag="finishDrag" @start-drag="startDrag" @do-fresh="fresh" v-if="!backgroundUp"></guide-bar>
    <div class="backgroundImg" @touchmove.stop.prevent="movingDrag" @touchend.stop.prevent="finishDrag" @mousemove="movingDrag" @mouseup="finishDrag">
      <div class="imageBox">
        <div class="imageIcon" v-for="row in (series.length / cols)" :key="row">
          <img :src="'data:image/png;base64,' + background[series[cols * (row - 1) + col - 1]]" v-for="col in cols" :key="col">
        </div>
      </div>
      <div ref="guideIcon" class="guideIcon" :style="{top: iconY + 'px', left: '0px'}" @touchstart.stop.prevent="startDrag" @mousedown="startDrag">
        <div class="shelter"></div>
        <img :src="'data:image/png;base64,' + guide">
      </div>
      <div class="verifyingIcon" v-if="showVerifying">
        <font-awesome-icon icon="check-circle" class="verifyRes success" :style="{color: successColor}" v-if="success === true"></font-awesome-icon>
        <font-awesome-icon icon="times-circle" class="verifyRes failure" :style="{color: failureColor}" v-else-if="success === false"></font-awesome-icon>
        <img class="verifyRes loading" src="./images/loading.gif" v-else>
      </div>
    </div>
    <guide-bar ref="dragGuideBar" @moving-drag="movingDrag" @finish-drag="finishDrag" @start-drag="startDrag" @do-fresh="fresh" v-if="backgroundUp"></guide-bar>
 </div>
</template>

<script>
import guideBar from './shared/dragGuideBar'

export default {
  props: {
    background: {
      type: Array,
      default: function () {
        return []
      }
    },
    series: {
      type: Array,
      default: function () {
        return []
      }
    },
    cols: {
      type: Number,
      default: 1
    },
    guide: {
      type: String,
      default: null
    },
    iconY: {
      type: Number,
      default: null
    },
    times: {
      type: Number,
      default: null
    },
    bgWidth: {
      type: Number,
      default: null
    },
    backgroundUp: {
      type: Boolean,
      default: true
    },
    successColor: {
      type: String,
      default: '#1ca21c'
    },
    failureColor: {
      type: String,
      default: '#dd1010'
    }
  },
  data () {
    return {
      positions: [],
      showVerifying: false,
      isMoving: false,
      x: 0,
      success: null
    }
  },
  components: {
    guideBar
  },
  watch: {
    background: function (val) {
      this.showVerifying = false
    }
  },
  methods: {
    startDrag (event) {
      if (!this.showVerifying && !this.success) {
        this.isMoving = true
        let guideIcon = this.$refs.guideIcon
        this.x = (event.pageX || event.touches[0].pageX) - parseInt(guideIcon.style.left.replace('px', ''), 10)
      }
    },
    movingDrag (event) {
      if (this.isMoving && !this.success) {
        let height = 60
        var _x = (event.pageX || event.touches[0].pageX) - this.x
        var guideIcon = this.$refs.guideIcon
        var dragGuideBar = this.$refs.dragGuideBar
        if (_x >= 0 && _x <= (this.bgWidth - height)) {
            guideIcon.style.left = _x + 'px'
            dragGuideBar.moveDragBar(_x)
        } else if (_x > (this.bgWidth - height)) {  
          guideIcon.style.left = (this.bgWidth - height)+ 'px'
            dragGuideBar.moveDragBar(this.bgWidth - height)
        }
      }
    },
    finishDrag (event) {
      if (this.isMoving && !this.success) {
        var _x = (event.pageX || event.changedTouches[0].pageX) - this.x
        if (this.positions.length < this.times) this.positions.push([_x, this.iconY])
        if (this.positions.length === this.times) {
          this.showVerifying = true
          this.$emit('do-verify', this.positions)
          this.isMoving = false
        }
      }
    },
    fresh () {
      this.showVerifying = true
      this.$emit('do-fresh', true)
    },
    verifyCallback (success, expired) {
      this.success = success
      setTimeout(() => {
        if (this.success) {
          this.$emit('do-fresh', false)
        } else {
          this.$refs.guideIcon.style.left = '0px'
          this.$refs.dragGuideBar.moveDragBar(0)
          if (expired) {
            this.fresh()
          } else {
            this.showVerifying = false
          }
        }
        this.positions = []
        this.success = null
      }, 1000)
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './style/drag';
</style>
