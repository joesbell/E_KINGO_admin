import model from '@symph/joy/model'
import { callApi } from '../util/api'

@model()
export default class SupplierModel {
    namespace = 'sup'

    initState = {
      current: 1,
      size: 10,
      AllSupplier: null,
      supplierFormData: null
    }

    async fetchSupplierData (val) {
      let { data: { data } } = await callApi('/suppler/query', { ...val }, { method: 'POST' })
      this.setState({
        ...data,
        AllSupplier: data.records
      })
    }
    async fetchAllSupplier (val) {
      let { data: { data } } = await callApi('/mallCommon/querySuppler', { ...val }, { method: 'POST' })
      this.setState({
        AllSupplier: data
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

    async addSuplier (val) {
      await callApi('/suppler/insert', { ...val }, { method: 'POST' })
    }
    async updateSuplier (val) {
      await callApi('/suppler/update', { ...val }, { method: 'POST' })
    }
}
