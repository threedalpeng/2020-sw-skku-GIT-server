<script>
  //Importing Bar class from the vue-chartjs wrapper
  import { Bar, mixins } from 'vue-chartjs'
  //Exporting this so it can be used in other components
  export default {
    extends: Bar,
    mixins: [mixins.reactiveProp],
    props: ['items'],
    data () {
      return {
        datacollection: {
          //Data to be represented on x-axis
          labels: ['0~2 Hour', '2~4 Hour','4~6 Hour', '6~8 Hour', '8~10 Hour', '10~12 Hour', '12~14 Hour', '14~16 Hour', '16~18 Hour', '18~20 Hour', '20~22 Hour', '22~24 Hour', ],
          datasets: [
            {
              label: 'Congestion',
              backgroundColor: '#f87979',
              pointBackgroundColor: 'white',
              borderWidth: 1,
              pointBorderColor: '#249EBF',
              //Data to be represented on y-axis
              data: [this.items.hour_stats[0].congestion, this.items.hour_stats[1].congestion, this.items.hour_stats[2].congestion, this.items.hour_stats[3].congestion, this.items.hour_stats[4].congestion, this.items.hour_stats[5].congestion, this.items.hour_stats[6].congestion, this.items.hour_stats[7].congestion, this.items.hour_stats[8].congestion, this.items.hour_stats[9].congestion, this.items.hour_stats[10].congestion, this.items.hour_stats[11].congestion]
            }
          ]
        },
        //Chart.js options that controls the appearance of the chart
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: true
              }
            }],
            xAxes: [ {
              gridLines: {
                display: false
              }
            }]
          },
          legend: {
            display: true
          },
          responsive: true, // 그래프 넓이
          maintainAspectRatio: false
        }
      }
    },
    mounted () {
      //renderChart function renders the chart with the datacollection and options object.
      this.renderChart(this.datacollection, this.options)
    }
  }
</script>
