import model from '@symph/joy/model'
import { callApi } from '../util/api'

@model()
export default class SupplierModel {
  namespace = 'sup'

  initState = {
    curPage: 1,
    pageSize: 10,
    AllSupplier: null
  }

  async fetchSupplierData (val) {
    let { data: { data } } = await callApi('/suppler/query', { ...val }, { method: 'POST' })
    this.setState({
      ...data
    })
  }
  async fetchAllSupplier () {
    let { data: { data } } = await callApi('/mallCommon/querySuppler', {}, { method: 'POST' })
    this.setState({
      ...data
    })
  }
}
