import Vue from "vue";
import Router from "vue-router";

// Layouts
import AppMainLayout from "./layouts/AppMainLayout";

// Views
import Login from "./views/Login.vue";
import Dashboard from "./views/Dashboard";

// Content
import ContentList from "./views/Content/ContentList";
import ContentForm from "./views/Content/ContentForm";

// Publisher
import PublisherList from "./views/Publisher/PublisherList";
import PublisherForm from "./views/Publisher/PublisherForm";

// Campaign
import CampaignList from "./views/Campaign/CampaignList";
import CampaignForm from "./views/Campaign/CampaignForm";

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
          path: "campaigns",
          name: "campaign-list",
          component: CampaignList
        },
        {
          path: "campaigns/new",
          name: "campaign-add",
          component: CampaignForm
        },
        {
          path: "campaigns/:campaignId/edit",
          name: "campaign-edit",
          component: CampaignForm
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
          component: ContentForm,
          props: true
        },
        {
          path: "publishers",
          name: "publisher-list",
          component: PublisherList
        },
        {
          path: "publishers/new",
          name: "publisher-add",
          component: PublisherForm
        },
        {
          path: "publishers/:publisherId/edit",
          name: "publisher-edit",
          component: PublisherForm
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
