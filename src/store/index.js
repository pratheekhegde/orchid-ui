import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import core from "./modules/core";
import config from "./modules/config";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    core,
    auth,
    config
  }
});
