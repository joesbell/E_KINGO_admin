import model from '@symph/joy/model'
import { callApi } from '../util/api'

@model()
export default class ProModel {
  namespace = 'pro'

  initState = {
    curPage: 1,
    pageSize: 10
  }

  async fetchProData (val) {
    let { data: { data } } = await callApi('/goods/query', { ...val }, { method: 'POST' })
    this.setState({
      ...data
    })
  }
}
