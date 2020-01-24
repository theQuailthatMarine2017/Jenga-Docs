import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import UUID from 'vue-uuid';
import VueHtml2Canvas from 'vue-html2canvas';
 
Vue.use(VueHtml2Canvas);

Vue.use(Buefy, { defaultIconPack: 'fas' });
Vue.use(UUID);

import moment from 'moment'
Vue.prototype.moment = moment

Vue.component('footer-view', require('./components/FooterComponent.vue').default);
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
