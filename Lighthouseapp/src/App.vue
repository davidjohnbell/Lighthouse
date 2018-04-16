<template>
  <v-app >
    <!-- Drawer -->
    <v-navigation-drawer
      persistent
      :mini-variant="false"
      :clipped="true"
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
    >
      <v-list>
        <v-list-tile value="true" v-for="item in actions" :key="item.title" @click="routeChanged(item.route)">
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <!-- Toolbar -->
    <v-toolbar app :clipped-left="true">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="toggleLogin()">{{loginText}}</v-btn>
    </v-toolbar>
    <!-- Router -->
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      miniVariant: false,
      right: true,
      title: 'Light Engine',
      loginText: 'Login',

      actions: [{
        icon: 'home',
        title: 'Home',
        route: '/'
      },
      {
        icon: 'lightbulb_outline',
        title: 'Light Room',
        route: 'LightRoom'
      },
      {
        icon: 'cloud_queue',
        title: 'Market',
        route: 'Market'
      },
      {
        icon: 'favorite_border',
        title: 'Favorites',
        route: 'Favorites'
      }],
      
    }
  },
  name: 'App',

  methods: {
    routeChanged(route) {
      this.$router.push(route);
    },
    toggleLogin() {
      let loggedIn = this.loginText === 'Login';
      this.loginText = loggedIn ? 'Logout' : 'Login';
      let route = loggedIn ? '/' : 'Login';
      this.$router.push(route);
    }
  }
  
}
</script>
