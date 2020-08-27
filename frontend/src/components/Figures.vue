<template>
  <div class ="Figures">
        <div class = "title_n_person">
            <h2>인원 수</h2>
        </div><hr>
        <div class= "n_person">
          <h2>
            <!-- <img src="../assets/img_n_person.png">  -->
            {{ figures.n_person }} 
            </h2> 
        </div><br>

        <div class = "title_n_mask_off">
            <h2>마스크 OFF</h2>
        </div><br>
        <div :style="{ color: OffColor}" class = "n_mask_off">
            <img src="../assets/img_n_mask_off.png">
            <h2> :{{ figures.n_mask_off }}</h2> 
        </div><br>

        <div class = "title_n_mask_on">
            <h2>마스크 ON</h2>
        </div><br>
        <div :style="{ color: OnColor}" class = "n_mask_on">
            <h2><img src="../assets/img_n_mask_on.png">:{{ figures.n_mask_on }}</h2> 
        </div><br>

        <div class = "title_n_mask_unknown">
            <h2>마스크 UNKNOWN</h2>
        </div><br>
        <div :style="{ color: UnknownColor}" class= "n_mask_unknown">
            <h2><img src="../assets/img_n_mask_unknown.png">:{{ figures.n_mask_unknown }}</h2> 
        </div><br>

        <div class = "title_risk">
            <!-- <h2>감염 위험</h2> -->
        </div>
        <div :style="{ color: RiskColor}" class= "risk">
            <h2>감염 위험={{ figures.risk }}</h2> 
        </div><br>
        <div class = "title_risk">
            <!-- <h2>혼잡도</h2> -->
        </div>
        <div :style="{ color: CongestionColor}" class= "congestion">
            <h2>혼잡도={{ figures.congestion }}</h2> 
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
.title_n_person{
  margin-left : 300px;
}
.Figures{
  float: left;
  margin-left : 30px;
}
hr{
  float: right;
  border-color: black;
  border-style: dotted;
}
</style>
