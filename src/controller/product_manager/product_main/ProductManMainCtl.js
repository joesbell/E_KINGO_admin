import React, { Component } from 'react'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
// import { fmtDate } from '../../../util/dateUtils'
import { Table, Pagination, message, Divider, Modal } from 'antd'
// import TaskPoolsModel from '../../../model/TaskPoolsModel'
import ProModel from '../../../model/ProModel'
import { constUtils, proStatus } from '../../../util/constUtils'
import SearchProMainForm from './SearchProMainForm'
const { confirm } = Modal

@controller(({ pro }) => {
  return {
    curPage: pro.curPage,
    pageSize: pro.pageSize,
    records: pro.records
  }
})
export default class ProductManMainCtl extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      isLoading: false
    }
    this.columns = [
      {
        title: '商品编号',
        dataIndex: 'number',
        key: 'number'
      },
      {
        title: '商品分类',
        dataIndex: 'category',
        key: 'category'
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '零售价',
        dataIndex: 'petailPrice',
        key: 'petailPrice'
      },
      {
        title: '限购数量',
        dataIndex: 'limitNum',
        key: 'limitNum'
      },
      {
        title: '上限有效期',
        dataIndex: 'onlineDate',
        key: 'onlineDate'
      },
      {
        title: '供货商姓名',
        dataIndex: 'supplerName',
        key: 'supplerName'
      },
      {
        title: '供货商电话',
        dataIndex: 'supplerPhone',
        key: 'supplerPhone'
      },
      {
        title: '商品状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => {
          return (
            <span>{constUtils.getItemName(proStatus, text)}</span>
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
  @autowire()
  proModel: ProModel
  fetchData = (curPage, pageSize) => {
    this.searchPMForm.props.form.validateFields(async (err, fieldsValue) => {
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

        await this.proModel.fetchProData({ curPage, pageSize, ...values })
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
        <SearchProMainForm onSubmit={this.onSubmitSearch} formRef={(form) => { this.searchPMForm = form }} />
        <Table scroll={{ x: 'max-content' }} dataSource={records} columns={this.columns} bordered pagination={false} rowKey={(record) => { return `${record.name}index` }} loading={this.state.isLoading} />
        <Pagination size='small' onChange={this.onChangePage} total={totalCount} pageSize={pageSize} current={curPage}
          showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange} />
      </div>
    )
  }
}
