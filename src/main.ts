import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

(function() {
  function resizeBaseFontSize() {
    const rootHtml = document.documentElement;
    let deviceWidth = rootHtml.clientWidth;
    if (deviceWidth > 640) {
      deviceWidth = 640;
    }
    rootHtml.style.fontSize = deviceWidth / 10 + 'px';
  }
  resizeBaseFontSize();
  window.addEventListener('resize', resizeBaseFontSize, false);
  window.addEventListener('orientationchange', resizeBaseFontSize, false);
})();
