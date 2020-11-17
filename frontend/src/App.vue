<template>
  <v-app>
    <v-app-bar
      dense=true
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
        v-on:click="link_to_settings"
        target="_blank"
        text
      >
        <span class="mr-2">Settings + alarm</span>
        <v-icon>mdi-cog-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
import mask_sound from './assets/audio/mask_audio.mp3'
import social_dist_sound from './assets/audio/social_dist_audio.mp3'
const mask_audio = new Audio(mask_sound)                      // Announcement for wearing mask
const social_dist_audio = new Audio(social_dist_sound)        // Announcemnet for social distancing

export default {
  name: 'App',
  methods:{
    link_to_settings(){
      this.$router.push("/settings");
      // axios.get('http://115.145.212.100:53344/api/realtime/kill');
    },
    }
  }
</script>

<style scoped>
p{
  vertical-align: middle;
  margin-top: 15px;
}
</style>