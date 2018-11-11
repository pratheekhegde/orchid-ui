import "@babel/polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import VeeValidate from "vee-validate";
import { format, distanceInWordsToNow } from "date-fns";

Vue.config.productionTip = false;
Vue.use(VeeValidate);

Vue.filter("fromNow", function(value) {
  if (value) {
    return distanceInWordsToNow(value);
  }
});

Vue.filter("format", function(value) {
  if (value) {
    return format(value, "MM/DD/YYYY");
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
