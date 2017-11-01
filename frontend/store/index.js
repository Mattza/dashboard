import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      cash: {}
    },
    mutations: {
      setCash (state, cashObj) {
        state.cash = cashObj
      }
    },
    actions: {
      async getCash ({commit, state}, year) {
        let cash = await (await fetch('http://localhost:8092/api/cash')).json()
        commit('setCash', cash)
      },
      async updateCash ({dispatch, state}, param) {
        let cash = await (await fetch('http://localhost:8092/api/cash/update')).json()
        dispatch('getCash')
      }
    }
  })
}

export default createStore
