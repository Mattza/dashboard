import Vuex from 'vuex'

const baseDataset = (header, data, backgroundColor) => ({
  header,
  data: {
    datasets: [{
      label: ['Data One', 'rest'],
      backgroundColor,
      data
    }]
  }
})

const createData = (name, amount, goal) => {
  let countMount = amount
  let count = 0
  while (countMount > 0) {
    count++
    countMount -= goal
  }
  let color = ['red', 'green', 'lime', 'greenyellow']

  let amounts = count
    ? [amount - (count - 1) * goal, (count) * goal - amount]
    : [Math.abs(amount), goal - Math.abs(amount)]
  return baseDataset(name, amounts, [color[count], 'grey'])
}

const createStore = () => {
  return new Vuex.Store({
    state: {
      cash: {},
      chartDatas: [],
      updating: true
    },
    mutations: {
      setCash (state, cashObj) {
        state.cash = cashObj

        state.chartDatas = [
          createData('Prev', cashObj.prev.amount, 40000),
          createData('Month', cashObj.month.amount, 40000),
          createData('Year', cashObj.latest.amount - 5000000, 500000)
        ]
      },
      setUpdating (state, boolean) {
        state.updating = boolean
      }

    },
    actions: {
      async getCash ({ commit, state }) {
        commit('setUpdating', true)
        let cash = await (await fetch('/api/cash')).json()
        commit('setCash', cash)
        commit('setUpdating', false)
      },
      async updateCash ({ commit, dispatch, state }, param) {
        commit('setUpdating', true)
        await fetch('/api/cash/update')
        commit('setUpdating', false)
        dispatch('getCash')
      },
      socket ({ dispatch, state }, msg) {
        console.log(msg)
      }

    }
  })
}

export default createStore
