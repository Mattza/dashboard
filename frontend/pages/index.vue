<template>
  <section class="container">
    <div>
     
      <h1 class="title">
        frontend
      </h1>
      <h2 class="subtitle" v-if="cash.latest">
        Latest: {{cash.latest.amount}}
        Prev: {{cash.prev.amount}}
        Month: {{cash.month.amount}}
      </h2>
      <button @click="$store.dispatch('updateCash')">Update</button>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {},
  computed: {
    ...mapState([
      'cash'
    ])
  },
  beforeMount: function () {
    this.$store.dispatch('getCash')
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
