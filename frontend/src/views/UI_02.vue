<template>
  <div class="UI_02">
    <h1>Second UI</h1>
    <v-container fluid>
      <v-row
        :align='center'
        :justify='center'
        class="grey lighten-5"
        style="height: 400px;">
        <v-col
          cols="12"
            md="2"
        >
          <v-date-picker
            v-model="picker"
            width="200"
            :landscape="landscape"
            :reactive="reactive"
            :flat="flat"
            :show-current="showCurrent"
            :type="month ? 'month' : 'date'"
            :multiple="multiple"
            :readonly="readonly"
            :disabled="disabled"
            :events="enableEvents ? functionEvents : null"
          ></v-date-picker>
        </v-col>
        <v-col>
          <h3>Congestion Chart</h3>
          <congestion-chart :items="users"/>
        </v-col>
        <v-col>
          <h3>Danger Chart</h3>
          <danger-chart :items="users"/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script>
  import CongestionChart from '@/components/CongestionChart'
  import DangerChart from '@/components/DangerChart'

  export default {
    name: 'UI_02',
    components: {
      CongestionChart,
      DangerChart,
    },
    data() {
      return {
        users: []
      }
    },
    created() {
      this.getData() //anytime the vue instance is created, call the fetchData() function.
    },
    methods: {
      getData() {
        this.$http
          .get('https://115.145.212.100:53344/api/stats')
          .then(response => {
            return response.json();
          })
          .then(data => {
            this.users = data;
         });
      }
    }
  }
</script>


<style>
</style>
