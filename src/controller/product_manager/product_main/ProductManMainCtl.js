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
    current: pro.current,
    size: pro.size,
    total: pro.total,
    records: pro.records
  }
})
export default class ProductManMainCtl extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      isLoading: false,
      btnLoading: false
    }
    this.columns = [
      {
        title: '商品编号',
        dataIndex: 'goodsNumber',
        key: 'goodsNumber'
      },
      {
        title: '商品分类',
        dataIndex: 'category',
        key: 'category'
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        render: (text, record, index) => {
          return (
            <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => this.goProDetail(record)}>{text}</span>
          )
        }
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
          if (text === 0) {
            return (
              <span style={{ color: '#ff7875' }}>{constUtils.getItemName(proStatus, text)}</span>
            )
          } else {
            return (
              <span >{constUtils.getItemName(proStatus, text)}</span>
            )
          }
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
                <a href='javascript:;' onClick={() => this.offline(record)} >{record.status === 0 ? '上线' : '下线'}</a>
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

  changeForm = (record) => {
    this.props.history.push(
      `/home/productManager/productForm?id=${record.id}&isRevise=true`
    )
  }
  goProDetail = (record) => {
    this.props.history.push(
      `/home/productManager/productForm?id=${record.id}&detail=true`
    )
  }
  fetchData = (current, size) => {
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

        await this.proModel.fetchProData({ current, size, ...values })
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
      title: record.status === 0 ? '上线' : '下线',
      content: `确定${record.status === 0 ? '上线' : '下线'}${record.name}?`,
      okText: '确定',
      okType: record.status === 0 ? 'primary' : 'danger',
      cancelText: '取消',
      async onOk () {
        try {
          let pro = {
            'id': record.id,
            'status': record.status === 0 ? 1 : 0
          }
          await _this.proModel.offlinePro(pro)
          Promise.all([message.success(record.status === 0 ? '上线' : '下线', 1), Modal.destroyAll(), _this.fetchData(current, size)])
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
    this.searchPMForm.props.form.resetFields()
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
    const { current, size, total, records } = this.props
    return (
      <div>
        <SearchProMainForm onSubmit={this.onSubmitSearch} formRef={(form) => { this.searchPMForm = form }} />
        <Table scroll={{ x: 'max-content' }} dataSource={records} columns={this.columns} bordered pagination={false} rowKey={(record) => { return `${record.name}index` }} loading={this.state.isLoading} />
        <Pagination size='small' onChange={this.onChangePage} total={total} pageSize={size} current={current}
          showSizeChanger showQuickJumper onShowSizeChange={this.onShowSizeChange} />
      </div>
    )
  }
}
