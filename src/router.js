import Vue from "vue";
import Router from "vue-router";

// Layouts
import AppMainLayout from "./layouts/AppMainLayout";

// Views
import Login from "./views/Login.vue";
import Dashboard from "./views/Dashboard";
import PublisherList from "./views/Publisher/PublisherList";
import CampaignList from "./views/Campaign/CampaignList";
import ContentList from "./views/Content/ContentList";
import ContentForm from "./views/Content/ContentForm";
import NotFoundView from "./views/NotFoundView";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/",
      component: AppMainLayout,
      children: [
        {
          path: "dashboard",
          name: "dashboard",
          component: Dashboard
        },
        {
          path: "publishers",
          name: "publisher-list",
          component: PublisherList
        },
        {
          path: "campaigns",
          name: "campaign-list",
          component: CampaignList
        },
        {
          path: "contents",
          name: "content-list",
          component: ContentList
        },
        {
          path: "contents/new",
          name: "content-add",
          component: ContentForm
        },
        {
          path: "contents/:contentId/edit",
          name: "content-edit",
          component: ContentForm
        }
      ]
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      // not found handler
      path: "*",
      component: NotFoundView
    }
  ]
});
