<script>
  //Importing Bar and mixins class from the vue-chartjs wrapper
  import {Bar, mixins} from 'vue-chartjs'
  //Getting the reactiveProp mixin from the mixins module.
  const { reactiveProp } = mixins
  export default {
    extends: Bar,
    mixins: [reactiveProp],
    data () {
      return {
        //Chart.js options that control the appearance of the chart
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                stepSize: 5,
                callback: function(value, index, values) {
                        return value + '명';
                }
              },
              gridLines: {
                display: false
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
            // display: false if you want the color of top to be hidden
          },
          responsive: true,
          maintainAspectRatio: false,
        }
      }
    },
    mounted () {
      // this.chartData is created in the mixin and contains all the data needed to build the chart.
      this.renderChart(this.chartData, this.options)
    }
  }
</script>
