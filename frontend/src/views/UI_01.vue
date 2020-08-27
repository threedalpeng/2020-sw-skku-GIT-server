<template>
  <div class= "UI">
    <div class= "title">
      <div id="name"> PreVentra System </div>
      <v-btn id="b1" color="primary" dark>admin's_CCTV_01_ 
        <!-- 위 코드 추후에(1계정에 카메라 추가 && 사용자 추가) 수정바란다 미래의 나야 -->
        <v-icon large color="white" dark right>mdi-video</v-icon>
      </v-btn>
    </div>
      <div class= "video">
        <br>
        <img :src= "frame" align="left">
        <hr>
      </div>
      <figures v-bind:figures="{n_person, n_mask_off, n_mask_on, 
                                n_mask_unknown, risk, congestion}"/>
    </div>
</template>

<script>
import figures from '../components/Figures'
import io from 'socket.io-client'; 

export default {
  name: 'UI_01',
  components: {
    figures,
  },
  data (){
    return {
      frame: '',
      n_person: '',
      n_mask_off: '',
      n_mask_on: '',
      socket : io.connect('http://115.145.212.100:53344'),
      n_mask_unknown: '',
      risk: '',
      congestion: '',
    };
  },
  created(){
     this.socket.on('stream_display', (image) => {
      // setTimeout(function(){ socket receive delay code
      this.frame= `data:image/png;base64, ${image.img}`;
      this.n_person= image.total_people;
      this.n_mask_on= image.mask_weared;
      this.n_mask_off= image.mask_off;
      this.n_mask_unknown= image.mask_unknown;
      this.risk= Math.round(image.risk);
      this.congestion= Math.round(image.congestion);//},50);
    });
  }
}
</script>

<style scoped>
#name{
  text-align: center;
  font-size: 35px;
  padding-left: 10px;
  padding-bottom: 10px;
  color: blue;
}
#b1{
  outline: 5px;
  margin-left: 17px;
}
.title{
  /* 단정 심플 직관 */
  border-bottom-style:ridge;
  border-color: black;
  border-width: medium;
  padding-bottom: 12px;
  padding-top: 15px;
}
img{
  /* 자동 크기 조절 */
  width: 50%;
  height: auto;
  border-radius: 4px;
  display: block;
}
hr{
  border-width:2px;
  border-radius: 500px;
  border-style:dotted;
  display:block;
  float: left;
  margin-left: 30px;
  width: 1;
  border-color: black;
  height: 500px;
}

</style>