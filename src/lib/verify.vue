<template>
  <div ref="verifyMainBody" class="verifyMainBody">
    <div class="veirfyBox" :style="verifyBoxClass" v-if="!hide">
      <v-click ref="verifyPopup" :background="background" :series="series" :cols="cols" :guide="guide" :times="times" :bgWidth="bgWidth" :backgroundUp="backgroundUp" @do-verify="validVerify" @do-fresh="initVerify" v-if="mode === 0"></v-click>
      <v-drag ref="verifyPopup" :background="background" :series="series" :cols="cols" :guide="guide" :iconY="iconY" :times="times" :bgWidth="bgWidth" :backgroundUp="backgroundUp" @do-verify="validVerify" @do-fresh="initVerify" v-if="mode === 1"></v-drag>
    </div>
    <div ref="startVerify" class="startVerify" :style="{width: (verifyWidth ? verifyWidth : bgWidth) + 'px'}" @mousedown="initVerify(!loaded)">
      <div class="loadBtn">
        <span class="successInfo" v-if="verifyResult">验证成功</span>
        <span class="errorInfo" v-else-if="message">{{message}}</span>
        <span v-else>点击打开验证</span>
        <img class="logoImg" src="./images/loadingIcon.gif" v-if="loading">
        <img class="logoImg" src="./images/right.png" v-else-if="verifyResult">
        <img class="logoImg" src="./images/logo.png" v-else>
      </div>
    </div>
  </div>
</template>

<script>
import vClick from './vClick'
import vDrag from './vDrag'
import {rsaPubDecrypt, rsaPubEncrypt, aesDecrypt, aesEncrypt, md5Encrypt16} from './security/security.js'
import {loadParams, initVerify, doVerify} from './api/verify.js'

export default {
  name: 'GraphicVerify',
  props: {
    verifyWidth: {
      type: [Number, String],
      default: null
    },
    webKey: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      paramLoaded: false,
      loaded: false,
      hide: true,
      mode: null,
      key: null,
      aesKey: null,
      rsaPubKey: null,
      bgWidth: null,
      bgHeight: null,
      background: [],
      series: [],
      cols: 1,
      guide: null,
      iconY: null,
      times: null,
      loading: false,
      verifyBoxClass: {},
      backgroundUp: true,
      verifyResult: null,
      message: null
    }
  },
  components: {
    vClick,
    vDrag
  },
  watch: {
    hide: function (val) {
      if (val) {
        document.removeEventListener('click',this.clickOutside, true)
      } else {
        document.addEventListener('click',this.clickOutside, true)
      }
    }
  },
  created () {
    this.verifyParams()
  },
  mounted () {
    window.addEventListener('scroll', this.adjustVerifyBox)
    window.addEventListener('resize', this.adjustVerifyBox)
  },
  destroyed () {
    window.removeEventListener('scroll', this.adjustVerifyBox)
    window.removeEventListener('resize', this.adjustVerifyBox)
  },
  methods: {
    clickOutside (event) {
      if(!this.$el.contains(event.target)){
        this.hide = true
      }
    },
    adjustVerifyBox () {
      let mainToTop = this.$refs.verifyMainBody.getBoundingClientRect().top
      let mainRightToLeft = this.$refs.verifyMainBody.getBoundingClientRect().right
      let mainToRight = document.body.clientWidth - mainRightToLeft
      let mainToLeft = this.$refs.verifyMainBody.getBoundingClientRect().left

      let verifyBoxLeft = (mainRightToLeft - mainToLeft) / 2 - this.bgWidth / 2
      if (mainToLeft + verifyBoxLeft < 0) {
        this.verifyBoxClass = {left: (0 - mainToLeft) + 'px'}
      } else if (mainToRight + verifyBoxLeft < 0) {
        this.verifyBoxClass = {right: (0 - mainToRight) + 'px'}
      } else {
        this.verifyBoxClass = {left: verifyBoxLeft + 'px'}
      }

      let startVerifyHeight = this.$refs.startVerify.offsetHeight + 10
      if (mainToTop >= this.bgHeight + 40) {
        this.verifyBoxClass.bottom = startVerifyHeight + 'px'
        this.backgroundUp = true
      } else {
        this.verifyBoxClass.top = startVerifyHeight + 'px'
        this.backgroundUp = false
      }
    },
    async verifyParams () {
      let res = await loadParams(this.webKey)
      if (res.httpCode === 200) {
        this.message = null
        this.bgWidth = res.width
        this.bgHeight = res.height
        this.paramLoaded = true
      } else {
        this.message = res.msg
      }
    },
    async initVerify (load) {
      if (!this.paramLoaded) {
        return
      }
      if (!load) {
        if (this.verifyResult) {
          this.hide = true
        } else {
          this.hide = !this.hide
        }
        return
      }
      this.loading = true
      let res = await initVerify(this.webKey)
      if (res.httpCode === 200 && res.success) {
        this.loaded = true
        this.hide = false
        this.message = null
        this.series = []
        this.mode = res.md
        this.key = res.k
        this.aesKey = md5Encrypt16(this.key)
        this.rsaPubKey = aesDecrypt(res.rpk, this.aesKey)
        this.background = res.bg
        let series = res.srs
        for (let i = 0; i < series.length; i++) {
          this.series.push(parseInt(rsaPubDecrypt(series[i], this.rsaPubKey)))
        }
        this.cols = parseInt(rsaPubDecrypt(res.cls, this.rsaPubKey))
        this.guide = rsaPubDecrypt(res.gd, this.rsaPubKey)
        this.iconY = parseInt(rsaPubDecrypt(res.ih, this.rsaPubKey))
        this.times = res.n
        this.adjustVerifyBox()
      } else {
        this.message = res.msg
      }
      this.loading = false
    },
    async validVerify (positions) {
      let encryptPositions = []
      for (let i = 0; i < positions.length; i++) {
        let position = positions[i]
        let rsaPosX = rsaPubEncrypt("" + position[0], this.rsaPubKey)
        let rsaPosY = rsaPubEncrypt("" + position[1], this.rsaPubKey)
        let aesPosX = aesEncrypt(rsaPosX, this.aesKey)
        let aesPosY = aesEncrypt(rsaPosY, this.aesKey)
        encryptPositions.push([aesPosX, aesPosY])
      }
      let res = await doVerify(this.key, encryptPositions)
      if (res.httpCode === 200) {
        this.$refs.verifyPopup.verifyCallback(res.success, res.expired)
        this.verifyResult = res.result
        this.$emit('verify-callback', res.result)
      } else {
        this.$refs.verifyPopup.verifyCallback(null, true)
      }
    },
    reset () {
      this.loaded = false
      this.verifyResult = null
    }
  }
};
</script>

<style lang="scss">
  @import './style/main';
</style>

<style lang="scss" scoped>
  @import './style/verify';
</style>
