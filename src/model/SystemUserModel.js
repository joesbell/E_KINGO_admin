import model from '@symph/joy/model'
import { callApi } from '../util/api'

@model()
export default class SystemUserModel {
    namespace = 'sysUser'

    initState = {
      current: 1,
      size: 10
    }

    async fetchSystemUserData (val) {
      let { data: { data } } = await callApi('/user/query', { ...val }, { method: 'POST' })
      this.setState({
        ...data
      })
    }
    async delSupplierData (val) {
      await callApi('/suppler/delete', { id: val }, { method: 'POST' })
    }
    async getsupplierForm (val) {
      let { data: { data } } = await callApi('/suppler/get', { id: val }, { method: 'GET' })
      this.setState({
        supplierFormData: data
      })
    }

    async addUser (val) {
      await callApi('/user/insert', { ...val }, { method: 'POST' })
    }
    async updateSuplier (val) {
      await callApi('/suppler/update', { ...val }, { method: 'POST' })
    }
}
