<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      clipped
      fixed
      app
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in sideMenuItems"
          :key="i"
          @click="$router.push({name: item.routeName})"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed dark clipped-left color="blue darken-3">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Application XYZ</v-toolbar-title>
    </v-toolbar>
    <v-content>
        <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: true,
    sideMenuItems: [
      {
        title: "Dashboard",
        icon: "dashboard",
        routeName: "dashboard"
      },
      {
        title: "Campaigns",
        icon: "today",
        routeName: "campaign-list"
      },
      {
        title: "Contents",
        icon: "message",
        routeName: "content-list"
      },
      {
        title: "Publishers",
        icon: "publish",
        routeName: "publisher-list"
      },
      {
        title: "User management",
        icon: "people",
        routeName: "publisher-list"
      },
      {
        title: "About",
        icon: "info",
        routeName: "about"
      }
    ]
  }),
  props: {
    source: String
  }
};
</script>
