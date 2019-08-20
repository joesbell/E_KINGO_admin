import React, { Component } from 'react'
// import controller from '@symph/joy/controller'
// import autowire from '@symph/joy/autowire'
// import { fmtDate } from '../../../util/dateUtils'
import { Table, Pagination, message, Divider, Modal } from 'antd'
// import TaskPoolsModel from '../../../model/TaskPoolsModel'
// import TodoTaskModel from '../../../model/TodoTaskModel'
import SearchProMainForm from './SearchProMainForm'
const { confirm } = Modal

// @controller(({ }) => {
//   return {
//   }
// })
export default class ProductManMainCtl extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      isLoading: false
    }
    this.columns = [
      {
        title: '商品编号',
        dataIndex: 'orderNo',
        key: 'orderNo'
      },
      {
        title: '商品分类',
        dataIndex: 'customerName',
        key: 'customerName'
      },
      {
        title: '商品名称',
        dataIndex: 'customerID',
        key: 'customerID'
      },
      {
        title: '商品规格',
        dataIndex: 'customerPhoneNum',
        key: 'customerPhoneNum'
      },
      {
        title: '零售价',
        dataIndex: 'applyDate',
        key: 'applyDate'
      },
      {
        title: '限购数量',
        dataIndex: 'auditStatus',
        key: 'auditStatus'
      },
      {
        title: '上限有效期',
        dataIndex: 'currentOperatorName',
        key: 'currentOperatorName'
      },
      {
        title: '供货商姓名',
        dataIndex: 'currentOperatorName',
        key: 'currentOperatorName'
      },
      {
        title: '供货商电话',
        dataIndex: 'currentOperatorName',
        key: 'currentOperatorName'
      },
      {
        title: '商品状态',
        dataIndex: 'currentOperatorName',
        key: 'currentOperatorName'
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
                <a href='javascript:;' onClick={() => this.offline(record)} >下线</a>
              </span>
            </div>

          )
        }
      }
    ]
  }
  // @autowire()
  // taskPoolsModel: TaskPoolsModel
  // @autowire()
  // todoTaskModel: TodoTaskModel
  fetchData = (pageNum, pageSize) => {
    this.searchTPForm.props.form.validateFields(async (err, fieldsValue) => {
      if (err) {
        return
      }
      // let values = {
      //   ...fieldsValue,
      //   startDate: fmtDate(fieldsValue['startDate'], 'YYYY-MM-DD 00:00:00'),
      //   endDate: fmtDate(fieldsValue['endDate'], 'YYYY-MM-DD 23:59:59')
      // }

      try {
        this.setState({
          isLoading: true
        })

        // await this.taskPoolsModel.fetchTaskPoolsData({ pageNum, pageSize, searchArgs: values })
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
    const { pageNum, pageSize } = this.props
    await this.fetchData(pageNum, pageSize)
  }

  onSubmitSearch = async () => {
    const { pageSize } = this.props
    this.fetchData(1, pageSize)
  }
  onChangePage = (pageNum, pageSize) => {
    this.fetchData(pageNum, pageSize)
  }
  onShowSizeChange = (pageNum, pageSize) => {
    pageNum = 1
    this.fetchData(pageNum, pageSize)
  }
  render () {
    const { pageNum, pageSize, totalCount } = this.props
    return (
      <div>
        <SearchProMainForm onSubmit={this.onSubmitSearch} formRef={(form) => { this.searchTPForm = form }} />
        <Table scroll={{ x: 'max-content' }} dataSource={[]} columns={this.columns} bordered pagination={false} rowKey='id' loading={this.state.isLoading} />
        <Pagination size='small' onChange={this.onChangePage} total={totalCount} pageSize={pageSize} current={pageNum}
          showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange} />
      </div>
    )
  }
}
