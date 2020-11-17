<template>
<div>
  <v-container id="container" fluid>
    <v-row
      no-gutters
    >
      <v-col>
        <v-card
          class="ma-0"
          max-width="300"
          tile
        >
          <v-list
              dense
              nav
              two-line
          >
            <v-subheader>PLACE</v-subheader>
            <v-list-item-group v-model="item" color="primary">
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
              >
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.text"></v-list-item-title>
                  <v-list-item-subtitle v-text="item.subtext"></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col>
        <v-card
          id="setting_content"
          class="pa-4"
          min-width="700"
          min-height="350">
          <h3>알림 기준<span class="divider">|</span>{{ milestone || 'null' }}</h3>
          <span id = 'fivemin_above_description'>5분 이상 지속할 경우</span>
        <v-radio-group v-model="milestone" :mandatory="false">
          <v-radio label="심각" value="심각"></v-radio>
          <v-radio label="경계" value="경계"></v-radio>
          <v-radio label="주의" value="주의"></v-radio>
        </v-radio-group>
        <v-divider></v-divider>
        <!-- <br>
        <h3>실내 공간 넓이<span class="divider">|</span>{{ space }}<span v-if=space>m<sup>2</sup></span></h3>
        <br>
        <span>사용자 정의 실내 공간</span><span class="divider">|</span>
        <input v-model="space" type= "number" placeholder= "제곱미터"> -->

        <br><br>
        <v-btn
          absolute
          color="primary" 
          dark
          v-on:click="save_alarm"
          >SAVE
        </v-btn>
        <v-btn
          absolute
          color="primary" 
          dark
          right
          v-on:click="goBack"
          >Go Back
        </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</div>
</template>
<script>
import axios from 'axios'

export default {
  data(){
    return{
      item: 1,
      space: '',
      items: [
      { text: 'Co-working space', icon: 'mdi-pen', subtext: 'office' },
      { text: 'test-video', icon: 'mdi-flask', subtext: 'experiment' },
      ],
      mielstone: '심각',
    }
  },
  methods:{
    save_alarm(){
        // axios.post('http://115.145.212.100:53344/api/settings/save', {distance_criteria: this.radios, space: this.space})
        // .then(res =>{
        //   console.log(res.data)
        //   alert('저장했습니다.')
        // })
        alert('저장했습니다.')
    },
    goBack(){
      window.history.back();
    }
  }
}
</script>
<style scoped>
#container{
  margin:0px;
}
input{
    /* justify-content: center; */
    outline: 2px solid #0055d5;
    width: 12%;
  }
#setting_content{
  margin-left: 20px;
  margin-right: 480px;
}
.divider{
  color: lightgray;
  margin-left: 3px;
  margin-right: 7px;
}
#fivemin_above_description{
  font-size: 7px;
  color: lightgray;
  margin-left: 2px;
}
</style>