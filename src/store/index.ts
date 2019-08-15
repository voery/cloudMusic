import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from "./mutations"
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

function getModules () {
  const contexts = require.context(`./modules/`, true, /[a-zA-Z]?\.ts$/, 'lazy')
  console.log(contexts.keys())
  let modules: any = {}
  contexts.keys().forEach((item: any) => {
    const match = /([a-zA-Z]+)/g.exec(item)
    if(!match || !match.length) return
    modules[match[0]] = require(`./modules/${match[0]}.ts`).default
  })
  return modules
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: getModules()
})