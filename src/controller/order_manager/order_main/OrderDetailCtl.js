import React, { Component } from 'react'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
import PageHeader from '../../../component/PageHeader'
import { PageBodyCard } from '../../../component/Card'
import { ListRow, ListCol, ListLableCol } from '../../../component/List'
import OrderModel from '../../../model/OrderModel'
import { constUtils, orderStatus } from '../../../util/constUtils'
import { parse } from 'querystring'
import { Table, message, Spin } from 'antd'

@controller(({ ord }) => {
  let query = parse(window.location.search.slice(1))
  return {
    current: ord.current,
    size: ord.size,
    total: ord.total,
    records: ord.records,
    orderProDetailList: ord.orderProDetailList,
    orderDetail: ord.orderDetail,
    id: query.id ? query.id : null
  }
})
export default class OrderDetailCtl extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: false
    }
    this.columns = [
      {
        title: '商品编号',
        dataIndex: 'goodsNumber'
      },
      {
        title: '商品分类',
        dataIndex: 'goodsCategory'
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName'
      },
      {
        title: '数量',
        dataIndex: 'goodsNum'
      },
      {
        title: '上线有效期',
        dataIndex: 'onlineDate'
      },
      {
        title: '供货商名称',
        dataIndex: 'supplerName'
      },
      {
        title: '供货商电话',
        dataIndex: 'supplerPhone'
      }
    ]
  }
  @autowire()
  orderModel: OrderModel

  async componentDidMount () {
    this.setState({
      isLoading: true
    })
    try {
      await this.orderModel.fetchOrderDetail(this.props.id)
    } catch (e) {
      message.error(e.message || '出错了，请重试')
    }
    this.setState({
      isLoading: false
    })
  }

  goBack = async () => {
    await this.props.history.goBack()
  }
  render () {
    const orderDetail = this.props.orderDetail
    return (
      <div >
        <PageHeader
          onBack={this.goBack}
          className='tabs'
          title={<span className='title'>订单详情</span>}
        />
        <PageBodyCard>
          {
            orderDetail
              ? <Spin spinning={this.state.isLoading}>

                <div className='orderDetaiBox'>
                  <ListRow>
                    <ListLableCol >
                      订单编号:
                    </ListLableCol>
                    <ListCol >
                      {orderDetail.orderNumber ? orderDetail.orderNumber : '无'}
                    </ListCol>
                    <ListLableCol >
                      订单时间:
                    </ListLableCol>
                    <ListCol >
                      {orderDetail.orderDate ? orderDetail.orderDate : '无'}
                    </ListCol>
                    <ListLableCol >
                      订单总金额:
                    </ListLableCol>
                    <ListCol >
                      {orderDetail.orderAmount ? orderDetail.orderAmount : '无'}
                    </ListCol>
                    <ListLableCol >
                      销售经理:
                    </ListLableCol>
                    <ListCol>
                      {orderDetail.salesManagerName ? orderDetail.salesManagerName : '无'}
                    </ListCol>
                    <ListLableCol >
                      订单状态:
                    </ListLableCol>
                    <ListCol>
                      {orderDetail.orderStatus ? constUtils.getItemName(orderStatus, orderDetail.orderStatus) : '无'}
                    </ListCol>
                    <ListLableCol >
                      下单员工:
                    </ListLableCol>
                    <ListCol>
                      {orderDetail.staffName ? orderDetail.staffName : '无'}
                    </ListCol>
                    <ListLableCol >
                      所属分公司:
                    </ListLableCol>
                    <ListCol>
                      {orderDetail.companyName ? orderDetail.companyName : '无'}
                    </ListCol>
                    <ListLableCol >
                      所属部门:
                    </ListLableCol>
                    <ListCol>
                      {orderDetail.departmentName ? orderDetail.departmentName : '无'}
                    </ListCol>
                    <ListLableCol>
                      地址:
                    </ListLableCol>
                    <ListCol >
                      {orderDetail.address ? orderDetail.address : '无'}
                    </ListCol>
                    <ListLableCol>
                      商品详情:
                    </ListLableCol>
                  </ListRow>
                </div>
                <Table scroll={{ x: 'max-content' }} dataSource={orderDetail.goodsList} columns={this.columns} bordered pagination={false} rowKey={(record, index) => `${record.goodsName}${index}`} />
              </Spin>

              : null
          }

        </PageBodyCard>
      </div>
    )
  }
}
