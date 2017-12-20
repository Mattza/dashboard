<template>
  <section class="container">
    <h1 class="title">ca$h</h1>
    <h2 v-if="updating">Uppdaterar</h2>
    <div class="text-wrapper">
      <h2 class="subtitle" v-if="cash.latest">
        Latest: {{cash.latest.amount}}
      </h2>
      <h2 class="subtitle" v-if="cash.latest">
        Prev: {{cash.prev.amount}}
      </h2>
      <h2 class="subtitle" v-if="cash.latest">
        Month: {{cash.month.amount}}
      </h2>
    </div>
    <div class="chart-wrapper">
      <div v-for="obj in chartDatas" :key="obj.header">
        <h3>{{obj.header}}</h3>
        <chart-doughnut :chart-data="obj.data" :options="options" :width="100" :height="100"></chart-doughnut>
      </div>
    </div>
    <div class="action-wrapper">
      <button @click="$store.dispatch('updateCash')" class="button">Update</button>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      options: {
        responsive: true,
        label: 'taco'
      }
    }
  },
  components: {},
  computed: {
    ...mapState([
      'cash',
      'chartDatas',
      'updating'
    ])
  },
  beforeMount: function () {
    this.$store.dispatch('getCash')
  }
}
</script>

<style>
.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: center;
}

.text-wrapper{
  font-size: 1rem;
  color: #526488;
  word-spacing: 5px;
}

.chart-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.button {
  -moz-appearance: none;
  -webkit-appearance: none;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 3px;
  -webkit-box-shadow: none;
  box-shadow: none;
  display: inline-flex;
  font-size: 1rem;
  height: 2.25em;
  line-height: 1.5;
  padding-bottom: calc(0.375em - 1px);
  padding-left: calc(0.625em - 1px);
  padding-right: calc(0.625em - 1px);
  padding-top: calc(0.375em - 1px);
  position: relative;
  vertical-align: top;
  user-select: none;
  cursor: pointer;
  justify-content: center;
  padding-left: 0.75em;
  padding-right: 0.75em;
  text-align: center;
  white-space: nowrap;
  background-color: #209cee;
  border-color: transparent;
  color: #fff;
}
</style>
