import React, { Component } from 'react'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
// import { fmtDate } from '../../../util/dateUtils'
import { Table, Pagination, message, Modal, Divider } from 'antd'
// import TaskPoolsModel from '../../../model/TaskPoolsModel'
import { constUtils, userStatus } from '../../../../util/constUtils'
import SystemUserModel from '../../../../model/SystemUserModel'
import SearchUserForm from './SearchUserForm'
const { confirm } = Modal

@controller(({ sysUser }) => {
  return {
    current: sysUser.current,
    size: sysUser.size,
    total: sysUser.total,
    records: sysUser.records
  }
})
export default class UserManMainCtl extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      isLoading: false
    }
    this.columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        render: (text, record, index) => {
          return (
            index + 1
          )
        }
      },
      {
        title: '用户账号',
        dataIndex: 'loginName',
        key: 'loginName'
      },
      {
        title: '用户姓名',
        dataIndex: 'userName',
        key: 'userName'
      },
      {
        title: '手机号码',
        dataIndex: 'mobile',
        key: 'mobile'
      },
      {
        title: '状态',
        dataIndex: 'enabled',
        key: 'enabled',
        render: (text) => {
          return (
            <span>{constUtils.getItemName(userStatus, text)}</span>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (text, record, index) => {
          return (
            <div>
              <span>
                <a href='javascript:;' onClick={() => this.FormDetail(record)}>详情</a>
              </span>
              <Divider type={'vertical'} />
              <span>
                <a href='javascript:;' onClick={() => this.changeStatus(record)} >{record.enabled === '1' ? '禁用' : '启用'}</a>
              </span>
              <Divider type={'vertical'} />
              <span>
                <a href='javascript:;' onClick={() => this.reset(record)} >重置密码</a>
              </span>
              <Divider type={'vertical'} />
              <span>
                <a href='javascript:;' onClick={() => this.changeForm(record)} >修改</a>
              </span>
              <Divider type={'vertical'} />
              <span>
                <a href='javascript:;' onClick={() => this.delete(record)} >删除</a>
              </span>
            </div>

          )
        }
      }
    ]
  }
  @autowire()
  systemUserModel: SystemUserModel

  fetchData = (current, size) => {
    this.searchUserForm.props.form.validateFields(async (err, fieldsValue) => {
      if (err) {
        return
      }
      let values = {
        ...fieldsValue
      }

      try {
        this.setState({
          isLoading: true
        })

        await this.systemUserModel.fetchSystemUserData({ current, size, ...values })
      } catch (e) {
        message.error(e.message || '出错了，请重试')
      }
      this.setState({
        isLoading: false
      })
    })
  }
  FormDetail = (record) => {
    this.props.history.push(
      `/home/systemManager/userManager/userManForm?id=${record.id}&&isRevise=false&&detail=true`
    )
  }

  reset = async (record) => {
    let val = {
      loginName: record.loginName,
      password: 'DCJG123456'
    }
    await this.systemUserModel.restPassword(val)
    await Promise.all([message.success('密码重置成功'), this.onSubmitSearch()])
  }
  changeStatus = async (record) => {
    try {
      if (record.enabled === '1') {
        await this.systemUserModel.disableStatus(record.loginName)
      } else {
        await this.systemUserModel.enableStatus(record.loginName)
      }
      await this.onSubmitSearch()
    } catch (e) {
      message.error(e.message || '出错了，请重试')
    }
  }
  changeForm = (record) => {
    this.props.history.push(
      `/home/systemManager/userManager/userManForm?id=${record.id}&&isRevise=true`
    )
  }
  delete = (record) => {
    let _this = this
    confirm({
      title: '删除',
      content: '确定删除此用户?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk () {
        try {
          await _this.systemUserModel.delUser(record.loginName)
          await Promise.all([message.success('删除成功'), Modal.destroyAll(), _this.onSubmitSearch()])
        } catch (e) {
          message.error(e.message || '出错了，请重试')
        }
      },
      onCancel () {
        console.log('Cancel')
      }
    })
  }
  async componentDidMount () {
    this.searchUserForm.props.form.resetFields()
    const { current, size } = this.props
    await this.fetchData(current, size)
  }

  onSubmitSearch = async () => {
    const { size } = this.props
    this.fetchData(1, size)
  }
  onChangePage = (current, size) => {
    this.fetchData(current, size)
  }
  onShowSizeChange = (current, size) => {
    current = 1
    this.fetchData(current, size)
  }
  render () {
    const { current, size, total } = this.props
    return (
      <div>
        <SearchUserForm onSubmit={this.onSubmitSearch} formRef={(form) => { this.searchUserForm = form }} />
        <Table scroll={{ x: 'max-content' }} dataSource={this.props.records} columns={this.columns} bordered pagination={false} rowKey='id' loading={this.state.isLoading} />
        <Pagination size='small' onChange={this.onChangePage} total={total} pageSize={size} current={current}
          showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange} />
      </div>
    )
  }
}
