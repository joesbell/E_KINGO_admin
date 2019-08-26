import React, { Component } from 'react'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
// import { fmtDate } from '../../../util/dateUtils'
import { Table, Pagination, message, Modal, Divider } from 'antd'
// import TaskPoolsModel from '../../../model/TaskPoolsModel'
import SupplierModel from '../../../model/SupplierModel'
import SearchSupplierForm from './SupplierSearchForm'
const { confirm } = Modal

@controller(({ sup }) => {
  return {
    current: sup.current,
    size: sup.size,
    total: sup.total,
    records: sup.records
  }
})
export default class SupplierMainCtl extends Component {
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
        title: '供货商姓名',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '供货商电话',
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName'
      },
      {
        title: '地址',
        dataIndex: 'address',
        key: 'address'
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark'
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
                <a href='javascript:;' onClick={() => this.delete(record)} >删除</a>
              </span>
            </div>

          )
        }
      }
    ]
  }
  @autowire()
  supplierModel: SupplierModel

  fetchData = (current, size) => {
    this.searchSLForm.props.form.validateFields(async (err, fieldsValue) => {
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

        await this.supplierModel.fetchSupplierData({ current, size, ...values })
      } catch (e) {
        message.error(e.message || '出错了，请重试')
      }
      this.setState({
        isLoading: false
      })
    })
  }
  changeForm = (record) => {
    this.props.history.push(
      `/home/supplierManager/supplierForm?id=${record.id}&&isRevise=true`
    )
  }
  delete = (record) => {
    let _this = this
    confirm({
      title: '删除',
      content: '确定删除此供货商?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk () {
        try {
          await _this.supplierModel.delSupplierData(record.id)
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
        <SearchSupplierForm onSubmit={this.onSubmitSearch} formRef={(form) => { this.searchSLForm = form }} />
        <Table scroll={{ x: 'max-content' }} dataSource={this.props.records} columns={this.columns} bordered pagination={false} rowKey='id' loading={this.state.isLoading} />
        <Pagination size='small' onChange={this.onChangePage} total={total} pageSize={size} current={current}
          showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange} />
      </div>
    )
  }
}
