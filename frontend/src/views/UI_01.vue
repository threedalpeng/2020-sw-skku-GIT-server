<template>
  <div class= "UI">
    <div class= "title">
      <h1>First UI</h1>
      <div class= "video">
        <img :src= "frame">
      </div>
      <figures v-bind:figures="{n_person, n_mask_off, n_mask_on, 
                                n_mask_unknown, risk, congetsion}"/>
    </div>
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
     this.socket.on('msg display', (image) => {
      this.frame= `data:image/png;base64, ${image.img}`;
      this.n_person= image.total_people;
      this.n_mask_on= (image.mask_weared* 1) + (image.mask_incorrect* 1);
      this.n_mask_off= image.n_mask_off;
      this.n_mask_unknown= image.mask_unknown;
      this.risk= image.risk;
      this.congestion= image.conjestion;
    });
  }
}
</script>

<style>
.title{
  text-align: center;
}
.video{
  width: 50%;
  height: auto;
}
</style>