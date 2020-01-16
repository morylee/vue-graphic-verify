<template>
  <div ref="verifyMainBody" class="verifyMainBody">
    <div class="veirfyBox" :style="verifyBoxClass" v-if="!hide">
      <v-click ref="verifyPopup" :background="background" :series="series" :cols="cols" :guide="guide" :times="times" :bgWidth="bgWidth" :backgroundUp="backgroundUp" :successColor="successColor" :failureColor="failureColor" @do-verify="validVerify" @do-fresh="initVerify" v-if="mode === 0"></v-click>
      <v-drag ref="verifyPopup" :background="background" :series="series" :cols="cols" :guide="guide" :iconY="iconY" :times="times" :bgWidth="bgWidth" :backgroundUp="backgroundUp" :successColor="successColor" :failureColor="failureColor" @do-verify="validVerify" @do-fresh="initVerify" v-if="mode === 1"></v-drag>
    </div>
    <div ref="startVerify" class="startVerify" :style="startVerifyStyle" @mousedown="initVerify(!loaded)">
      <div class="loadBtn">
        <span class="successInfo" v-if="verifyResult">验证成功</span>
        <span class="errorInfo" v-else-if="message">{{message}}</span>
        <span v-else-if="hide">点击打开验证</span>
        <span v-else>点击关闭验证</span>
        <img class="loading" src="./images/loadingIcon.gif" v-if="loading">
        <span class="success" v-else-if="verifyResult">
          <font-awesome-icon icon="check-circle"></font-awesome-icon>
        </span>
        <img class="logoImg" :src="isOutImg() ? logoImgPath : require('' + getLogoImgPath)" v-else>
      </div>
    </div>
  </div>
</template>

<script>
import vClick from './vClick'
import vDrag from './vDrag'
import {rsaPubDecrypt, rsaPubEncrypt, aesDecrypt, aesEncrypt, md5Encrypt16} from './security/security.js'
import {loadParams, initVerify, doVerify, delVerify, delVerifyToken} from './api/verify.js'

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
    },
    border: {
      type: String,
      default: '1px solid rgba(51, 51, 51, 0.25)'
    },
    borderRadius: {
      type: String,
      default: '4px'
    },
    bgColor: {
      type: String,
      default: 'rgba(255, 255, 255, 0.9)'
    },
    color: {
      type: String,
      default: '#333333'
    },
    successColor: {
      type: String,
      default: '#1ca21c'
    },
    failureColor: {
      type: String,
      default: '#dd1010'
    },
    logoImgPath: {
      type: String,
      default: null
    },
    sysType: {
      type: Number,
      default: 0
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
  computed: {
    startVerifyStyle: function () {
      let verifyWidth = null
      if (typeof this.verifyWidth === 'string') {
        verifyWidth = this.verifyWidth
        if (verifyWidth.indexOf('px') > -1) {
          verifyWidth = verifyWidth.substring(0, verifyWidth.indexOf('px'))
        } else if (isNaN(verifyWidth)) {
          verifyWidth = null
        }
      } else if (typeof this.verifyWidth === 'number') {
        verifyWidth = this.verifyWidth
      }
      let color = this.color
      if (this.verifyResult) {
        color = this.successColor
      } else if (this.message) {
        color = this.failureColor
      }
      return {
        width: (verifyWidth ? verifyWidth : this.bgWidth) + 'px',
        border: this.border,
        borderRadius: this.borderRadius,
        backgroundColor: this.bgColor,
        color: color
      }
    },
    getLogoImgPath: function () {
      switch (this.sysType) {
        case 1:
          return './images/secInLogo.png'
        case 2:
          return './images/adLogo.png'
        default:
          return './images/logo.png'
      }
    }
  },
  created () {
    this.verifyParams()
  },
  mounted () {
    window.addEventListener('scroll', this.adjustVerifyBox)
    window.addEventListener('resize', this.adjustVerifyBox)
    window.addEventListener('beforeunload', e => this.beforeunloadFn(e))
  },
  destroyed () {
    window.removeEventListener('scroll', this.adjustVerifyBox)
    window.removeEventListener('resize', this.adjustVerifyBox)
    window.removeEventListener('beforeunload', e => this.beforeunloadFn(e))
    this.beforeunloadFn(null)
  },
  methods: {
    clickOutside (event) {
      if(!this.$el.contains(event.target)){
        this.hide = true
      }
    },
    isOutImg () {
      if (this.logoImgPath === null || this.logoImgPath === undefined) return false
      return this.logoImgPath.indexOf('http://') === 0 || this.logoImgPath.indexOf('https://') === 0
    },
//  getLogoImgPath () {
//    if (this.sysType === 1) {
//      return './images/secInLogo.png'
//    } else {
//      return './images/logo.png'
//    }
//  },
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
    beforeunloadFn (e) {
      this.delVerify(this.key)
      this.delVerifyToken(this.verifyResult)
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
      let currKey = this.key
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
        this.delVerify(currKey)
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
    async delVerify (key) {
      if (key) {
        await delVerify(this.webKey, key)
      }
    },
    async delVerifyToken (token) {
      if (token) {
        await delVerifyToken(this.webKey, token)
      }
    },
    reset () {
      let token = this.verifyResult
      this.loaded = false
      this.verifyResult = null
      this.delVerifyToken(token)
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
