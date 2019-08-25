import React, { Component } from 'react'
// import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
import SearchForm, { Row, Col } from '../../../component/SearchForm'
import Form from '../../../component/Form'
import OrderModel from '../../../model/OrderModel'

import { Button, Input, Select, DatePicker, message } from 'antd'
const { Option } = Select
class OrderMainForm extends Component {
  onSubmit = (e) => {
    e.preventDefault()
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit()
    }
  }
  @autowire()
  orderModel: OrderModel
  handleReset = () => {
    this.props.form.resetFields()
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit()
    }
  }
  // 批量确认收货
  allSure=async () => {
    try {
      await this.orderModel.allSure({ id: this.props.selectedRowKeys })
      Promise.all([this.props.onSubmit(), message.success('收货成功')])
    } catch (e) {
      message.error(e.message || '出错了，请重试')
    }

    // await this.
  }
  // 批量删除订单
  allDelOrder = async () => {
    try {
      await this.orderModel.allDelOrder({ id: this.props.selectedRowKeys })
      Promise.all([this.props.onSubmit(), message.success('删除成功')])
    } catch (e) {
      message.error(e.message || '出错了，请重试')
    }
  }
  addProduct = () => {
    this.props.history.push(
      '/home/productForm?isRevise=false'
    )
  }
  render () {
    const { form } = this.props
    const { getFieldDecorator } = form
    return (
      <SearchForm onSubmit={this.onSubmit}>
        <Row>
          <Col>
            <Form.Item
              label='员工姓名'
              labelAlign='left'
            >
              {
                getFieldDecorator('staffName')(<Input allowClear placeholder='请输入' />)
              }
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label='员工电话'
              labelAlign='left'
            >
              {
                getFieldDecorator('staffPhone')(<Input allowClear placeholder='请输入' />)
              }
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label='订单状态'
              labelAlign='left'
            >
              {
                getFieldDecorator('orderStatus', {
                })(<Select placeholder='全部' allowClear>
                  <Option key='0' value={0} >删除</Option>
                  <Option key='1' value={1}>未收货</Option>
                  <Option key='2' value={2}>确认收货</Option>
                </Select>)

              }
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label='下单时间'
              style={{ marginBottom: 0 }}
            >
              <Form.Item
                style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
              >
                {
                  getFieldDecorator('startDate', {})(
                    <DatePicker format={'YYYY.MM.DD'}
                      placeholder='起始时间'
                      disabledDate={d =>
                        form.getFieldValue('endDate') && d.isAfter(form.getFieldValue('endDate'), 'day')}
                    />)
                }
              </Form.Item>
              <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
              <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                {
                  getFieldDecorator('endDate', {})(
                    <DatePicker format={'YYYY.MM.DD'}
                      placeholder='结束时间'

                      disabledDate={d =>
                        form.getFieldValue('startDate') && d.isBefore(form.getFieldValue('startDate', 'day'))} />)
                }
              </Form.Item>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', marginBottom: '10px' }}>
              <div>
                <Button
                  type='primary'
                  htmlType='submit'
                >查询</Button>
                <Button style={{ marginLeft: '24px' }} onClick={this.handleReset}>重置</Button>

              </div>
              <div>
                <Button style={{ marginLeft: '24px' }} type='primary' disabled={!this.props.hasSelected} onClick={this.allSure}>确认收货</Button>
                <Button style={{ marginLeft: '24px' }} type='danger' disabled={!this.props.hasSelected} onClick={this.allDelOrder}>删除</Button>
                <Button style={{ marginLeft: '24px' }} onClick={this.addProduct}>导出</Button>

                {/* <Button style={{ marginLeft: '24px' }} onClick={this.handleReset}>导入</Button> */}
              </div>
            </div>
          </Col>

        </Row>
      </SearchForm>
    )
  }
}
const SearchOrderMainForm = Form.createWithModel({
  formId: 'OrderMain/OrderMainForm',
  onValuesChange: (props, changedValues, allValues) => {
    // console.log(props, changedValues, allValues)
  }
})(OrderMainForm)
export default SearchOrderMainForm
