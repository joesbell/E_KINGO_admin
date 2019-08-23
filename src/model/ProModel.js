import model from '@symph/joy/model'
import { callApi } from '../util/api'

@model()
export default class ProModel {
  namespace = 'pro'

  initState = {
    current: 1,
    size: 10
  }

  async fetchProData (val) {
    let { data: { data } } = await callApi('/goods/query', { ...val }, { method: 'POST' })
    this.setState({
      ...data
    })
  }
  async addPro (val) {
    await callApi('/goods/insert', { ...val }, { method: 'POST' })
  }
  // 商品分类
  async proCategory (name) {
    await callApi('/mallCommon/queryCategory', { ...name }, { method: 'POST' })
  }
}
