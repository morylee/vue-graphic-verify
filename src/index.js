import Vue from 'vue'
import gVerify from './lib/verify'

const Plugin = {
  install (VueComponent, options = {}) {
    if (Object.keys(options).length) {
      if (options.apiAddr) {
        Vue.prototype.apiAddr = options.apiAddr
      }
      if (typeof options.webKey === 'string') {
        gVerify.props.webKey.default = options.webKey
      }
      if (typeof options.verifyWidth === 'string' || typeof options.verifyWidth === 'number') {
        gVerify.props.verifyWidth.default = options.verifyWidth
      }
    }
    VueComponent.component(gVerify.name, gVerify)
  }
}

export {gVerify}
export default Plugin
