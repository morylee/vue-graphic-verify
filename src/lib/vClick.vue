<template>
  <div class="clickVerify" :style="{width: bgWidth + 'px'}">
    <guide-bar :guide="guide" @do-fresh="fresh" v-if="!backgroundUp"></guide-bar>
    <div class="backgroundImg" ref="backgroundImg">
      <div class="imageBox" @click="getPosition">
        <div class="imageIcon" v-for="row in (series.length / cols)" :key="row">
          <img :src="'data:image/png;base64,' + background[series[cols * (row - 1) + col - 1]]" v-for="col in cols" :key="col">
        </div>
      </div>
      <div class="clickedIcon" :style="{left: (pos[0] - 12 )+ 'px', top: (pos[1] - 12) + 'px'}" v-for="(pos, index) in positions" :key="index">{{index + 1}}</div>
      <div class="verifyingIcon" v-if="showVerifying">
        <font-awesome-icon icon="check-circle" class="verifyRes success" :style="{color: successColor}" v-if="success === true"></font-awesome-icon>
        <font-awesome-icon icon="times-circle" class="verifyRes failure" :style="{color: failureColor}" v-else-if="success === false"></font-awesome-icon>
        <img class="verifyRes loading" src="./images/loading.gif" v-else>
      </div>
    </div>
    <guide-bar :guide="guide" @do-fresh="fresh" v-if="backgroundUp"></guide-bar>
 </div>
</template>

<script>
import guideBar from './shared/clickGuideBar'

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
      success: null
    }
  },
  components: {
    guideBar
  },
  watch: {
    background: function (val) {
      this.positions = []
      this.showVerifying = false
    }
  },
  methods: {
    getPosition (event) {
      if (this.positions.length >= this.times) return
      let e = event || window.event
      let mLeft = e.clientX
      let mTop = e.clientY
      let imgLeft = this.$refs.backgroundImg.getBoundingClientRect().left
      let imgTop = this.$refs.backgroundImg.getBoundingClientRect().top
      if (this.positions.length < this.times) this.positions.push([mLeft - imgLeft, mTop - imgTop])
      if (this.positions.length === this.times) {
        this.showVerifying = true
        this.$emit('do-verify', this.positions)
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
  @import './style/click';
</style>
