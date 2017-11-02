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
      async getCash ({commit, state}) {
        let cash = await (await fetch('/api/cash')).json()
        commit('setCash', cash)
      },
      async updateCash ({dispatch, state}, param) {
        await (await fetch('/api/cash/update')).json()
        dispatch('getCash')
      }
    }
  })
}

export default createStore
