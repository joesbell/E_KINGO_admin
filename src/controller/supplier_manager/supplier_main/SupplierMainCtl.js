import React, { Component } from 'react'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
// import { fmtDate } from '../../../util/dateUtils'
import { Table, Pagination, message, Divider, Modal } from 'antd'
// import TaskPoolsModel from '../../../model/TaskPoolsModel'
import SupplierModel from '../../../model/SupplierModel'
// import { constUtils, proStatus } from '../../../util/constUtils'
import SearchSupplierForm from './SupplierSearchForm'
const { confirm } = Modal

@controller(({ sup }) => {
  return {
    curPage: sup.curPage,
    pageSize: sup.pageSize,
    records: sup.records
  }
})
export default class supplierMainCtl extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      isLoading: false
    }
    this.columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id'
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
        dataIndex: 'address1',
        key: 'address1'
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
                <a href='javascript:;' onClick={() => this.goDetail(record)}>修改</a>
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
  supplierModel: SupplierModel
  fetchData = (curPage, pageSize) => {
    this.searchSpForm.props.form.validateFields(async (err, fieldsValue) => {
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

        await this.supplierModel.fetchSupplierData({ curPage, pageSize, ...values })
      } catch (e) {
        message.error(e.message || '出错了，请重试')
      }
      this.setState({
        isLoading: false
      })
    })
  }
  goDetail = (record) => {
    this.props.history.push(
      '/creditGrantingAudit/' + encodeURI(record.flowInstanceId) + `/auditMsg?isAudit=false&taskId=${record.taskId}`
    )
  }
  offline = async (record) => {
    confirm({
      title: '确定下线此商品?',
      content: 'Some descriptions',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk () {
        console.log('OK')
      },
      onCancel () {
        console.log('Cancel')
      }
    })
  }
  async componentDidMount () {
    const { curPage, pageSize } = this.props
    await this.fetchData(curPage, pageSize)
  }

  onSubmitSearch = async () => {
    const { pageSize } = this.props
    this.fetchData(1, pageSize)
  }
  onChangePage = (curPage, pageSize) => {
    this.fetchData(curPage, pageSize)
  }
  onShowSizeChange = (curPage, pageSize) => {
    curPage = 1
    this.fetchData(curPage, pageSize)
  }
  render () {
    const { curPage, pageSize, totalCount, records } = this.props
    return (
      <div>
        <SearchSupplierForm onSubmit={this.onSubmitSearch} formRef={(form) => { this.searchSpForm = form }} />
        <Table scroll={{ x: 'max-content' }} dataSource={records} columns={this.columns} bordered pagination={false} rowKey='id' loading={this.state.isLoading} />
        <Pagination size='small' onChange={this.onChangePage} total={totalCount} pageSize={pageSize} current={curPage}
          showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange} />
      </div>
    )
  }
}
