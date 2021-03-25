import Vue from 'vue';
import App from './App.vue';
import Formula from '../src/index';
import VueRouter from 'vue-router';

Vue.use(VueRouter);
Vue.use(Formula);
Vue.config.productionTip = false;

const routes = [
  { path: '', component: () => import('./comp-example/i-formula.vue') },
];

const router = new VueRouter({
  routes
});

new Vue({
  render: h => h(App),
  router
}).$mount('#app');
