<template>
<div class= "Figures">
    <div class= "person_container">
        <img src="../assets/UI_01/img_n_person.png">
        <div class= "value">인원 수: {{ figures.n_person }}</div>
    </div>

    <br><div class= "contatiner_hr"><hr></div><br>

    <div class= "mask_container_title">
    <div :style="{ color: OffColor }" class= "n_mask_off">마스크OFF</div>
    <div :style="{ color: OnColor }" class= "n_mask_on">마스크ON</div>
    <div :style="{ color: UnknownColor }" class= "n_mask_unknown"> 마스크??</div>
    </div>

  <div class= "mask_container_img">
    <img class= "figure_img" src="../assets/UI_01/img_n_mask_off.png">
    <img class= "figure_img" src="../assets/UI_01/img_n_mask_on.png">
    <img class= "figure_img" src="../assets/UI_01/img_n_mask_unknown.png">
  </div>

  <div class= "mask_container_val">
    <div :style="{ color: OffColor }" class= "n_mask_off">
        {{ figures.n_mask_off }}
    </div>
    <div :style="{ color: OnColor }" class= "n_mask_on">
        {{ figures.n_mask_on }}
    </div>
    <div :style="{ color: UnknownColor }" class= "n_mask_unknown">
        {{ figures.n_mask_unknown }}
    </div>
  </div>
    
  <br><div class= "contatiner_hr"><hr></div><br>
    
  <div class= "literal_container_title">
    <div :style="{ color: RiskColor}" class= "risk">위험도</div>
    <div :style="{ color: CongestionColor}" class= "congestion">혼잡도</div>
  </div>

   <div class= "literal_container_val">
    <div :style="{ color: RiskColor}" class= "risk">{{ figures.risk }}</div>
    <div :style="{ color: CongestionColor}" class= "congestion">{{ figures.congestion }}</div>
  </div>
</div>
</template>

<script>

  export default {
    name: 'Figure',
    props: {
      figures: {type: Object},
    },
    data(){
      return{
        congestion: figure.congestion,
        risk: figure.risk,
        OffColor: 'red',
        OnColor: 'black',
        UnknownColor: 'black',
        RiskColor: 'black',
        CongestionColor: 'black',
      };
    },
    watch: {
      figures: function(new_val){
        if(new_val.risk <= 100)
          this.RiskColor= 'blue';
        else if(new_val.risk <= 200)
          this.RiskColor= 'green';
        else if(new_val.risk <= 300)
          this.RiskColor= 'yellow';
        else if(new_val.risk <= 400)
          this.RiskColor= 'orange';
        else
          this.RiskColor= 'red';

        if(new_val.congestion <= 100)
          this.CongestionColor= 'blue';
        else if(new_val.congestion <= 200)
          this.CongestionColor= 'green';
        else if(new_val.congestion <= 300)
          this.CongestionColor= 'yellow';
        else if(new_val.congestion <= 400)
          this.CongestionColor= 'orange';
        else
          this.CongestionColor= 'red';
      }
    }
  }
</script>

<style scoped>
.person_container{
  font-weight:bold;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mask_container_img{
  display: flex;
  flex-flow: row wrap;    
  justify-content: space-around;
  align-items: center;
  margin-right: 3px;
}
.mask_container_title{
  display: flex;
  font-weight: bold;
  font-size: 20px;
  flex-flow: row wrap;
  justify-content: space-around;
  align-items: center;
}
.mask_container_val{
  font-size: 25px;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  align-items: center;
}
.literal_container_title{
  font-size: 25px;
  display: flex;
  font-weight: bold;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;
}
.literal_container_val{
  font-size: 35px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;
}
hr{
  height: 2px;
  width: 50%;
  text-align: right;
  margin-right: 0;
  border-color: black;
}
</style>
