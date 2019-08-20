import model from '@symph/joy/model'
import { callApi } from '../util/api'
import { message } from 'antd'

@model()
export default class UserModel {
  namespace = 'user'

  initState = {
    user: null
  }

  async fetchCurrentUser ({ sst }) {
    let { data: { data } } = await callApi('/manual/getLoginUser', { sst }, { method: 'GET' })
    this.setState({
      user: data
    })
  }

  async login ({ loginUrl }) {
    window.location.href = loginUrl
  }

  async logout () {
    try {
      let { data: { data: { loginUrl } } } = await callApi('/manual/logout', { }, { method: 'POST' })
      // 重定向到登录页面
      window.location.href = loginUrl
    } catch (e) {
      message.error(e.message || '出错了，请重试')
    }
  }
}
