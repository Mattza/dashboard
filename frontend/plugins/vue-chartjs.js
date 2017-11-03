import Vue from 'vue'
import { Doughnut, mixins } from 'vue-chartjs'

Vue.component('chart-doughnut', {
  extends: Doughnut,
  mixins: [mixins.reactiveProp],
  props: ['chartData', 'options'],
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
})
