// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import MarketCard from './components/MarketCard'
import LightListTile from '@/components/LightListTile'

Vue.use(Vuetify)
Vue.component('market-card', MarketCard)
Vue.component('light-list-tile', LightListTile)

Vue.config.productionTip = false

// router.beforeEach((to, from, next) => {
//   console.log(to);
//   let accepted = ['/', '/Login'];
//   if(!accepted.includes(to.path)) {
//     if ((Date.now() - localStorage.expiry) > 1000*60*60*24) {
//       route.push('Login');
//     }
//   }
// });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
