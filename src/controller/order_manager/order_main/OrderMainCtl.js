import React, { Component } from 'react'
// import controller from '@symph/joy/controller'
// import autowire from '@symph/joy/autowire'
// import { fmtDate } from '../../../util/dateUtils'
import { Table, Pagination, message, Divider, Modal } from 'antd'
// import TaskPoolsModel from '../../../model/TaskPoolsModel'
// import TodoTaskModel from '../../../model/TodoTaskModel'
import SearchOrderMainForm from './OrderMainForm'
const { confirm } = Modal

// @controller(({ }) => {
//   return {
//   }
// })
const data = []
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`
  })
}
export default class OrderMainCtl extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      isLoading: false,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false
    }
    this.columns = [
      {
        title: 'Name',
        dataIndex: 'name'
      },
      {
        title: 'Age',
        dataIndex: 'age',
        render: (text, record, index) => {
          return (
            <span onClick={() => this.props.history.push(
              `/home/productManager/productForm?id=$`
            )} style={{ color: 'red', cursor: 'pointer' }}>{record.age}</span>
          )
        }
      },
      {
        title: 'Address',
        dataIndex: 'address'
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (text, record, index) => {
          return (
            <div>
              <span>
                <a href='javascript:;' onClick={() => this.goDetail(record)}>确认收货</a>
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
  // @autowire()
  // todoTaskModel: TodoTaskModel
  goProDetail=(age) => {
    console.log(age)

    this.props.history.push(
      `/home/productManager/productForm?id=$`
    )
  }
  start = () => {
    this.setState({ loading: true })
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false
      })
    }, 1000)
  };

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    this.setState({ selectedRowKeys })
  };
  fetchData = (pageNum, pageSize) => {
    this.searchOMForm.props.form.validateFields(async (err, fieldsValue) => {
      if (err) {
        return
      }
      let values = {
        ...fieldsValue
      }
      console.log(values)

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
    const { loading, selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    }
    const hasSelected = selectedRowKeys.length > 0
    return (
      <div>
        <SearchOrderMainForm hasSelected={hasSelected} loading={loading} onSubmit={this.onSubmitSearch} formRef={(form) => { this.searchOMForm = form }} />
        <Table rowSelection={rowSelection} scroll={{ x: 'max-content' }} dataSource={data} columns={this.columns} bordered pagination={false} rowKey='id' loading={this.state.isLoading} />
        <Pagination size='small' onChange={this.onChangePage} total={totalCount} pageSize={pageSize} current={pageNum}
          showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange} />
      </div>
    )
  }
}
