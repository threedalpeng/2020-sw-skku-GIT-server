<script>
  //Importing Bar and mixins class from the vue-chartjs wrapper
  import {Line, mixins} from 'vue-chartjs'
  //Getting the reactiveProp mixin from the mixins module.
  const { reactiveProp } = mixins
  export default {
    extends: Line,
    mixins: [reactiveProp],
    data () {
      return {
        //Chart.js options that control the appearance of the chart
        options: {
          scales: {
            yAxes: [{
              ticks: {
                max : 100,
                beginAtZero: true,
                stepSize: 50,
                callback: function(value, index, values) {
                        return value + '%';
                }
              },
              gridLines: {
                display: true
              }
            }],
            xAxes: [ {
              ticks: {
                stepSize: 15
              },
              gridLines: {
                display: true
              }
            }]
          },
          legend: {
            display: true
            // display: false if you want the color of top to be hidden
          },
          tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
                label: function(tooltipItems, data) { 
                    return '혼잡도: ' +tooltipItems.yLabel + ' %';
                }
            }
          },
          responsive: true,
          maintainAspectRatio: false,
          elements: {
            point:{
                radius: 0
            },
            line: {
                tension: 0
            }
          },
          drawHorizontalLine: {
            lineY: [60, 60],
            //lineColor: "rgba(50, 155, 255, 0.85)",
            lineColor: "rgba(255, 0, 0, 0.4)",
            text: '60%',
            textPosition: 10,
            textFont: '18px sans-serif',
            textColor: "rgba(255, 0, 0, 0.4)"
          }
                /*
          horizontalLine: [{
            "y": 60,
            "style": "rgba(255, 0, 0, .4)",
            "text": "60%"
          }],*/
          /*
          annotation: {
            annotations: [
              {
                type: "line",
                mode: "horizontal",
                scaleID: "y-axis-0",
                borderColor: "rgba(255, 0, 0, .4)",
                value: "60",
                label: {
                  content: "",
                  enabled: true,
                  position: "top"
                }
              }
            ]
          }*/
        }
      }
    },
    mounted () {
      // this.chartData is created in the mixin and contains all the data needed to build the chart.
      this.renderChart(this.chartData, this.options)
    }
  }
</script>
