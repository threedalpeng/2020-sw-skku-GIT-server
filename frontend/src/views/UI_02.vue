<template>
  <div class="UI_02">
    <h1>Second UI</h1>
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="2" class="my-2 px-1">
          <v-date-picker v-model="picker" @click='getData()' ></v-date-picker>
        </v-col>
        <v-col cols="12" sm="4" class="my-2 px-1">
          <h3>Congestion Chart</h3>
          <congestion-chart :items="result"/>
        </v-col>
        <v-col cols="12" sm="4" class="my-2 px-1">
          <h3>Danger Chart</h3>
          <danger-chart :items="result"/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script>
  import CongestionChart from '@/components/CongestionChart'
  import DangerChart from '@/components/DangerChart'
  import axios from 'axios'

  export default {
    name: 'UI_02',
    components: {
      CongestionChart,
      DangerChart,
    },
    data() {
      return {
        result: '',
        today: new Date(),
        year: this.today.getFullYear(),
        month: this.today.getMonth(),
        date: this.today.getDate(),
        picker: this.year + '-' + this.month + '-' + this.date,
      }
    },
    created() {
      this.getData() //anytime the vue instance is created, call the fetchData() function.
    },
    methods: {
      formatDate(date) {
            if (!date) return null
            ;[this.year, this.month, this.date] = date.split('-')
            if(this.month < 10) this.month = this.month % 10
            if(this.date < 10) this.date = this.date % 10
            return `${this.year}/${this.month}/${this.day}`
      },
      getData() {
        this.date = this.formatDate(this.picker)
        axios.get('https://115.145.212.100:53344/api/stats/'+ this.date)
          .then(res => {
            this.result = res.data
            console.log(res.data)
          })
      },
    }
  }
</script>

<style>
</style>
