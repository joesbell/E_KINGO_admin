import model from '@symph/joy/model'
import { callApi } from '../util/api'

@model()
export default class OrderModel {
    namespace = 'ord'

    initState = {
      current: 1,
      size: 10,
      OrderDetail: null,
      orderProDetailList: null
      // categoryValue: null, // 商品分类
      // fileList: []
    }

    async fetchOrderData (val) {
      let { data: { data } } = await callApi('/order/query', { ...val }, { method: 'POST' })
      this.setState({
        ...data
      })
    }
    // 批量删除
    async allDelOrder (val) {
      await callApi('/order/batchDelete', { ...val }, { method: 'POST' })
    }
    // 批量确认收货
    async allSure (val) {
      await callApi('/order/batchConfirm', { ...val }, { method: 'POST' })
    }
    // 确认收货
    async sure (val) {
      await callApi('/order/confirm', { ...val }, { method: 'POST' })
    }
    // 删除
    async delOrder (val) {
      await callApi('/order/delete', { ...val }, { method: 'POST' })
    }
    async fetchOrderDetail (id) {
      let { data: { data } } = await callApi('/order/get', { id: id }, { method: 'GET' })
      this.setState({
        orderDetail: data
      })
    }
    async fetchOrderProDetail (id) {
      let { data: { data } } = await callApi('/order/goodsDetail', { id: id }, { method: 'GET' })
      this.setState({
        orderProDetailList: data
      })
    }
}
