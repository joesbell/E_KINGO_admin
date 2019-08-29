import model from '@symph/joy/model'
import { callApi } from '../util/api'

@model()
export default class SystemUserModel {
    namespace = 'sysUser'

    initState = {
      current: 1,
      size: 10,
      userDetail: null
    }

    async fetchSystemUserData (val) {
      let { data: { data } } = await callApi('/user/query', { ...val }, { method: 'POST' })
      this.setState({
        ...data
      })
    }

    async getUser (val) {
      let { data: { data } } = await callApi('/user/get', { id: val }, { method: 'GET' })
      this.setState({
        userDetail: data
      })
    }
    async delUser (val) {
      await callApi('/user/delete', { loginName: val }, { method: 'POST' })
    }
    async updateUser (val) {
      await callApi('/user/update', { ...val }, { method: 'POST' })
    }

    // 禁用

    async disableStatus (val) {
      await callApi('/user/disabled', { loginName: val }, { method: 'POST' })
    }
    // 启用

    async enableStatus (val) {
      await callApi('/user/enabled', { loginName: val }, { method: 'POST' })
    }

    // 重置密码
    async restPassword (val) {
      await callApi('/user/reset/password', { ...val }, { method: 'POST' })
    }
    async addUser (val) {
      await callApi('/user/insert', { ...val }, { method: 'POST' })
    }
    async updateSuplier (val) {
      await callApi('/suppler/update', { ...val }, { method: 'POST' })
    }
}
