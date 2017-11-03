import Vuex from 'vuex'

const baseDataset = (header, data) => ({
  header,
  data: {
    datasets: [{
      label: ['Data One', 'rest'],
      backgroundColor: [data[0] > 0 ? 'green' : 'red', 'grey'],
      data
    }]
  }
})

const createStore = () => {
  return new Vuex.Store({
    state: {
      cash: {},
      chartDatas: []
    },
    mutations: {
      setCash (state, cashObj) {
        state.cash = cashObj
        state.chartDatas = [
          baseDataset('Prev', [cashObj.prev.amount, 40000 - cashObj.prev.amount]),
          baseDataset('Month', [cashObj.month.amount, 40000 - cashObj.month.amount]),
          baseDataset('Year', [cashObj.latest.amount - 5000000, 5500000 - cashObj.latest.amount])
        ]
      }
    },
    actions: {
      async getCash ({ commit, state }) {
        let cash = await (await fetch('/api/cash')).json()
        commit('setCash', cash)
      },
      async updateCash ({ dispatch, state }, param) {
        await (await fetch('/api/cash/update')).json()
        dispatch('getCash')
      }
    }
  })
}

export default createStore
