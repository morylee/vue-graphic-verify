import Vue from 'vue'
import gVerify from './lib/verify'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faCheckCircle, faTimesCircle} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

library.add(faCheckCircle, faTimesCircle)

const GVerifyPlugin = {
  install (VueComponent, options = {}) {
    if (Object.keys(options).length) {
      if (options.apiAddr) {
        Vue.prototype.apiAddr = options.apiAddr
      }
      if (options.webKey) {
        gVerify.props.webKey.default = options.webKey
      }
      if (options.verifyWidth) {
        gVerify.props.verifyWidth.default = options.verifyWidth
      }
      if (options.border) {
        gVerify.props.border.default = options.border
      }
      if (options.borderRadius) {
        gVerify.props.borderRadius.default = options.borderRadius
      }
      if (options.bgColor) {
        gVerify.props.bgColor.default = options.bgColor
      }
      if (options.color) {
        gVerify.props.color.default = options.color
      }
      if (options.successColor) {
        gVerify.props.successColor.default = options.successColor
      }
      if (options.failureColor) {
        gVerify.props.failureColor.default = options.failureColor
      }
      if (options.logoImgPath) {
        gVerify.props.logoImgPath.default = options.logoImgPath
      }
      if (options.sysType) {
        gVerify.props.sysType.default = options.sysType
      }
    }
    VueComponent.component(gVerify.name, gVerify)
    VueComponent.component('font-awesome-icon', FontAwesomeIcon)
  }
}

Vue.use(GVerifyPlugin, {})

export {GVerifyPlugin}
export default gVerify
