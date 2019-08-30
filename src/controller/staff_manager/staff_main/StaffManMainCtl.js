import React, { Component } from 'react'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
// import { fmtDate } from '../../../util/dateUtils'
import { Table, Pagination, message, Divider, Modal, Spin, Upload, Icon, Button } from 'antd'
// import TaskPoolsModel from '../../../model/TaskPoolsModel'
import StaffModel from '../../../model/StaffModel'

import { constUtils, staffRole } from '../../../util/constUtils'
import SearchStaffMainForm from './SearchStaffMainForm'
const { confirm } = Modal

@controller(({ staff }) => {
  return {
    current: staff.current,
    size: staff.size,
    total: staff.total,
    records: staff.records,
    comList: staff.comList, // 分公司
    departList: staff.departList // 部门
  }
})
export default class StaffManMainCtl extends Component {
  constructor () {
    super(...arguments)
    let _this = this
    this.state = {
      isLoading: false,
      btnLoading: false,
      uploadProps: {
        name: 'file',
        showUploadList: false,
        accept: 'text/csv',
        action: 'http://118.24.50.239:8181/staff/import_staff',
        headers: {
          Authorization: window.sessionStorage.getItem('token')
        },
        onChange (info) {
          if (info.file.status === 'uploading') {
            _this.setState({
              isLoading: true
            })
          }
          if (info.file.status === 'done') {
            console.log(info.file.response)

            if (info.file.response.code === 200) {
              Promise.all([message.success(`导入成功`), _this.setState({ isLoading: false }), _this.fetchData(1, 10)])
            } else {
              Promise.all([message.error(info.file.response.msg), _this.setState({ isLoading: false })])
            }
          } else if (info.file.status === 'error') {
            _this.setState({
              isLoading: false
            })
            message.error(`导入失败`)
          }
        }
      }
    }
    this.columns = [
      {
        title: '员工编号',
        dataIndex: 'userNumber',
        key: 'userNumber'
      },
      {
        title: '分公司',
        dataIndex: 'companyName',
        key: 'companyName'
      },
      {
        title: '部门',
        dataIndex: 'departmentName',
        key: 'departmentName'
      },
      {
        title: '员工姓名',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '员工电话',
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: '员工角色',
        dataIndex: 'role',
        key: 'role',
        render: (text) => {
          return (
            <span>{constUtils.getItemName(staffRole, text)}</span>
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
                <a href='javascript:;' onClick={() => this.changeForm(record)}>修改</a>
              </span>
              <Divider type={'vertical'} />
              <span>
                <a href='javascript:;' onClick={() => this.offline(record)} >删除</a>
              </span>
            </div>

          )
        }
      }
    ]
  }
  // @autowire()
  // taskPoolsModel: TaskPoolsModel
  @autowire()
  staffModel: StaffModel

  changeForm = (record) => {
    this.props.history.push(
      `/home/staffManager/staffForm?id=${record.id}&&isRevise=false`
    )
  }
  goProDetail = (record) => {
    this.props.history.push(
      `/home/productManager/productForm?id=${record.id}&detail=true`
    )
  }
  fetchData = (current, size) => {
    this.searchStaMForm.props.form.validateFields(async (err, fieldsValue) => {
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

        await this.staffModel.fetchStaffModel({ current, size, ...values })
      } catch (e) {
        message.error(e.message || '出错了，请重试')
      }
      this.setState({
        isLoading: false
      })
    })
  }
  offline = async (record) => {
    const { current, size } = this.props
    const _this = this
    confirm({
      title: '删除',
      content: `确定删除${record.name}?`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk () {
        try {
          let staff = {
            'id': record.id
          }
          await _this.staffModel.deleteStaffModel(staff)
          Promise.all([message.success('删除成功', 1), Modal.destroyAll(), _this.fetchData(current, size)])
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
    this.searchStaMForm.props.form.resetFields()
    const { current, size } = this.props
    await this.staffModel.fetchCompany()
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
    const { current, size, total, records } = this.props
    return (
      <div>
        <Spin spinning={this.state.isLoading}>
          <SearchStaffMainForm onSubmit={this.onSubmitSearch} formRef={(form) => { this.searchStaMForm = form }} > </SearchStaffMainForm>

          <div>
            <Upload {...this.state.uploadProps} className='uploadBtn'>
              <Button style={{ marginBottom: '10px' }} >
                <Icon type='upload' />
                导入员工
              </Button>
            </Upload>
          </div>
          <Table scroll={{ x: 'max-content' }} dataSource={records} columns={this.columns} bordered pagination={false} rowKey={(record) => { return `${record.name}index` }} />
          <Pagination size='small' onChange={this.onChangePage} total={total} pageSize={size} current={current}
            showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange} />
        </Spin>

      </div>
    )
  }
}
