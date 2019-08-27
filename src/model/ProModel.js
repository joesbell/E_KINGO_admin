import model from '@symph/joy/model'
import { callApi } from '../util/api'

@model()
export default class ProModel {
  namespace = 'pro'

  initState = {
    current: 1,
    size: 10,
    proDetail: null,
    categoryList: [], // 商品分类
    fileList: []
  }

  async fetchProData (val) {
    let { data: { data } } = await callApi('/goods/query', { ...val }, { method: 'POST' })
    this.setState({
      ...data
    })
  }
  // 新增商品
  async addPro (val) {
    await callApi('/goods/insert', { ...val }, { method: 'POST' })
  }
  // 修改商品
  async updatePro (val) {
    await callApi('/goods/update', { ...val }, { method: 'POST' })
  }
  // 商品分类
  async proCategory (name) {
    let { data: { data } } = await callApi('/mallCommon/queryCategory', { ...name }, { method: 'POST' })
    this.setState({
      categoryList: data
    })
  }
  // 更改商品分类
  async changeCategory (val) {
    let newList = this.getState().categoryList
    newList.push({ name: val })

    var hash = {}
    newList = newList.reduce(function (item, next) {
      // eslint-disable-next-line no-unused-expressions
      hash[next.name] ? '' : hash[next.name] = true && item.push(next)
      return item
    }, [])

    this.setState({
      categoryList: newList
    })
  }

  // 商品上下线
  async offlinePro (pro) {
    await callApi('/goods/updateOnLineStatus', { ...pro }, { method: 'POST' })
  }
  // 商品详情
  async getProDetail (id) {
    let { data: { data } } = await callApi('/goods/get', { id: id }, { method: 'GET' })
    this.setState({
      proDetail: data
    })
  }
  // 更改商品分类
  async changeCategoryValue (val) {
    this.setState({
      categoryValue: val
    })
  }
  // 更改图片
  async setFileList (fileList) {
    this.setState({
      fileList: fileList
    })
  }
}
