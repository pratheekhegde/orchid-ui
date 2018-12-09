import Vue from "vue";
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  VTooltip,
  VCard,
  VForm,
  VTextField,
  VDivider,
  VDataTable,
  VDialog,
  VTabs,
  transitions
} from "vuetify";
import "vuetify/src/stylus/app.styl";

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VTooltip,
    VCard,
    VForm,
    VTextField,
    VDivider,
    VDataTable,
    VDialog,
    VTabs,
    transitions
  }
});
