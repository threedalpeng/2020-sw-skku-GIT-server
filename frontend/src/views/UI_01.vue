<template>
  <div class="UI">
    <!-- this file manages live stream camera page -->
    <div class="title">
      <!-- <div id="name"> PreVentra System </div> -->
      <v-row>
        <v-col cols="3" class="select_place_list">
          <v-select
            dense
            class="select_place_list"
            v-model="selected_list_val"
            :items="places"
            label="place"
            menu-props="auto"
            prepend-icon="mdi-home-group"
            hint="Select the place you want"
            persistent-hint
          ></v-select>
        </v-col>
        <!-- <v-btn
          right
          v-on:click="link_to_graph"
          id="b2" color="primary" dark>Analysis
          <v-icon color="white" dark right>mdi-graph</v-icon>
        </v-btn> -->
      </v-row>
      <hr align="center" />
    </div>
    <div class="video">
      <h2 id="place_name">{{ selected_list_val }}</h2>
      <img v-if="!isloading" :src="frame" align="left" />
      <img
        v-if="isloading"
        src="../assets/UI_01/loading_img.png"
        align="left"
      />
    </div>
    <figures
      v-bind:figures="{
        n_person,
        n_mask_off,
        n_mask_on,
        n_mask_unknown,
        risk,
        congestion,
        n_cluster,
        place_num,
      }"
    />
    <v-btn
      absolute
      right
      v-on:click="link_to_graph"
      id="b2"
      color="primary"
      dark
      >Analysis
      <v-icon color="white" dark right>
        {{ icons.mdiArrowRightBoldOutline }}
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mdiArrowRightBoldOutline } from "@mdi/js";
import figures from "../components/Figures";
import io from "socket.io-client";
import axios from "axios";
import mask_sound from "../assets/audio/mask_audio.mp3";
import mask_n_sd_sound from "../assets/audio/mask_and_sd.mp3";
import social_dist_sound from "../assets/audio/social_dist_audio.mp3";
const mask_audio = new Audio(mask_sound); // Announcement for wearing mask
const social_dist_audio = new Audio(social_dist_sound); // Announcemnet for social distancing
const mask_sd_audio = new Audio(mask_n_sd_sound);

export default {
  name: "UI_01",
  components: {
    figures,
  },
  data() {
    return {
      bgcolor: "",

      isCCTV: true,
      isgetframe: false,
      isloading: true,

      frame: "",
      n_person: "",
      n_mask_off: "",
      n_mask_on: "",
      socket: io.connect("http://115.145.212.100:51122"), //{ rememberTransport: false,}), //transport: ['Websocket', 'Flash Socket', 'Ajax long-polling']}),
      // socket: io.connect("http://115.145.212.100:53344"), //{ rememberTransport: false,}), //transport: ['Websocket', 'Flash Socket', 'Ajax long-polling']}),
      n_mask_unknown: "",
      n_cluster: "",
      risk: "",
      congestion: "",

      previous_camera_id: 1,
      destination_camera_id: 1,

      selected_list_val: "Lounge",
      places: ["Lounge", "카페", "co-working space"],
      place_num: 1,
      alert: "",
      // isred: false,
      n_in_frame: 0,
    };
  },
  created() {
    console.log("I am created!");
    window.addEventListener(
      "beforeunload",
      () => {
        //axios.get("http://115.145.212.100:53344/api/realtime/kill");
        this.handler();
      },
      false
    );

    this.socket.on("stream_display", (image) => {
      // console.log("socket connected!")
      this.frame = `data:image/png;base64, ${image.img}`;
      // console.log('counting');
      this.n_person = image.total_people;
      this.n_mask_on = image.mask_weared;
      this.n_mask_off = image.mask_off;
      this.n_mask_unknown = image.mask_unknown;
      this.risk = Math.round(image.risk);
      this.congestion = Math.round(image.congestion);
      this.n_cluster = image.n_cluster;
    });

    this.socket.on("alert", (alert_state) => {
      console.log("socket Alert state : ", alert_state);
      this.alert = alert_state;
    });

    // axios.get("http://115.145.212.100:53344/api/realtime/init");
    axios.get("http://115.145.212.100:51122/api/realtime/init");
    this.socket.emit("join_room", 1);
    // this.red_sign();
  },
  methods: {
    link_to_graph() {
      this.$router.push("/graph");
    },
    change_mode() {
      this.isCCTV = !this.isCCTV;
      this.isloading = true;
      this.socket.emit(
        "switch_room",
        this.previous_camera_id,
        this.destination_camera_id
      );
      console.log(this.previous_camera_id, this.destination_camera_id);
    },
    handler() {
      //when browser or tab is killed
      // axios.get("http://115.145.212.100:53344/api/realtime/kill");
      axios.get("http://115.145.212.100:51122/api/realtime/kill");
    },
  },
  watch: {
    alert: function (val) {
      console.log("alarm on");
      if (alert == 1) {
        mask_sd_audio.play();
      } else if (alert == 2) {
        social_dist_audio.play();
      } else if (alert == 3) {
        mask_audio.play();
      } // backend not finished??
    },
    // risk: function (val) {
    //   if (val > 80 && this.isred == false) {
    //     // when risk val is over 80 UI background color blinks!
    //     // this.red_sign();
    //   }
    // },
    frame: function (val) {
      //if no recieved frame
      if (val != "") {
        this.isgetframe = true;
        this.isloading = false;
      }
    },
    selected_list_val: function (val) {
      if (val == "Lounge") {
        console.log(val);
        this.place_num = 1;
        this.previous_camera_id = this.destination_camera_id;
        this.destination_camera_id = 1;
        this.change_mode();
      } else if (val == "co-working space") {
        console.log(val);
        this.place_num = 3;
        this.previous_camera_id = this.destination_camera_id;
        this.destination_camera_id = 3;
        this.change_mode();
      } else if (val == "카페") {
        console.log(val);
        this.place_num = 2;
        this.previous_camera_id = this.destination_camera_id;
        this.destination_camera_id = 2;
        this.change_mode();
      }
    },
  },
  computed: {
    icons: () => ({
      mdiArrowRightBoldOutline,
    }),
  },
};
</script>

<style scoped>
#place_name {
  margin-left: 23px;
}
.select_place_list {
  margin-left: 12px;
  padding-top: 0px;
  margin-top: 6px;
}
#b1 {
  outline: 5px;
  margin-left: 17px;
  margin-top: 15px;
  margin-bottom: 15px;
}
#b1-1 {
  outline: 5px;
  margin-left: 17px;
  margin-top: 15px;
  margin-bottom: 15px;
}
#b2 {
  outline: 5px;
  margin-right: 17px;
  margin-top: 17px;
  margin-bottom: 15px;
}
.title {
  /* 단정 심플 직관 */
  border-bottom-style: none;
  border-color: lightgray;
  border-width: medium;
  padding-bottom: 12px;
  padding-top: 15px;
}
img {
  /* 자동 크기 조절 */
  width: 900px;
  height: auto;
  border-radius: 4px;
  display: block;
  margin-left: 17px;
  margin-right: 17px;
}
hr {
  color: lightgray;
  width: 99%;
  margin-left: 10px;
  border-style: solid none none none;
  height: 1px;
}
.UI {
  padding-top: 0px;
}
</style>