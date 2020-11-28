import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import store from "./store";
import VueRouter from "vue-router";
import Planner from "./components/Planner";
import Schedule from "./components/Schedule";
import Home from "./components/Home";
import Main from "./components/Main";
import Grade from "./components/Grade";

const routes = [
  {
    path: "/",
    component: Main,
  },
  {
    path: "/planner",
    component: Planner,
  },
  {
    path: "/schedule",
    component: Schedule,
  },
  {
    path: "/home",
    component: Home,
  },
  {
    path: "/grades",
    component: Grade,
  },
];

Vue.config.productionTip = false;

const router = new VueRouter({ routes });

Vue.use(VueRouter);

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
