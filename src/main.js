import Vue from 'vue'
import Verify from './index.vue'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faCheckCircle, faTimesCircle} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

library.add(faCheckCircle, faTimesCircle)

Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
  el: '#app',
  render: h => h(Verify)
})
