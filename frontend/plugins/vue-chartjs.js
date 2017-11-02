import Vue from 'vue'
import { Doughnut } from 'vue-chartjs'
console.log('Doughnut', Doughnut)
Vue.component('chart-doughnut', {
  extends: Doughnut,
  props: ['data', 'options'],
  mounted () {
    this.renderChart(this.data, this.options)
  }
})
