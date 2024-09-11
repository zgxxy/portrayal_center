// import { findSupplierStatisticsByid,subscribe } from '@/api/service'
const state = {
  list: [],
  statistics: [],
  radar: {},
  flag: false
}
const mutations = {
  
}
const actions = {
  // 根据id查询各个供应商radar数据
  async supplierStatistics({ commit, state }, v) {
    return new Promise((resolve, reject) => {
      const arr = []
      let flagIndex = 0
      state.list.map(async(item, index) => {
        const res = await findSupplierStatisticsByid(item.id)
        if (res[0].duration !== undefined && res[0].hit !== undefined) {
          arr.push({ ...res[0], name: state.list[index].name })
        }
        flagIndex++
        if (flagIndex === state.list.length) {
          commit('setSupplierList', arr)
          console.log(arr)
          resolve()
        }
      })
    })
  },
  //     email: that.formData.contactEmail,
      //     contactPerson: that.formData.contacts,
      //     subscriptionTime: that.formData.serviceDateStart,
      //     subscriptionEndTime: that.formData.serviceDateEnd,
      //     modelId: this.dialogFormData.id,
      //     modelName: this.dialogFormData.modelName,
  subscribe({commit},userInfo) {
    debugger
    const { contactEmail, contacts,serviceDateStart,serviceDateEnd,modelId,modelName } = userInfo
    return new Promise((resolve, reject) => {
      subscribe({ email: contactEmail, contactPerson: contacts,subscriptionTime:serviceDateStart,subscriptionEndTime:serviceDateEnd,modelId:modelId,modelName:modelName }).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
