<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <div>
          <p style="font-size:30px;">PreVentra</p>
        </div>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/threedalpeng/2020-sw-skku-GIT-server"
        target="_blank"
        text
      >
        <span class="mr-2">Github code</span>
        <v-icon>mdi-github</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  }
</script>

<style scoped>
</style>