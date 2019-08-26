import React, { Component } from 'react'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
import checkoutReportModel from '../../../model/checkoutReportModel'

import SearchForm, { Row, Col } from '../../../component/SearchForm'
import Form from '../../../component/Form'
import { Button, Select, DatePicker } from 'antd'
const { Option } = Select

@controller(({ checkoutReport }) => {
  return {
    comList: checkoutReport.comList, // 分公司
    departList: checkoutReport.departList, // 部门
    checkoutCom: checkoutReport.checkoutCom,
    checkoutDepart: checkoutReport.checkoutDepart,
    ManagerList: checkoutReport.ManagerList// 销售经理
  }
})
class ReCheckoutForm extends Component {
  @autowire()
  checkoutReportModel: checkoutReportModel
  onSubmit = (e) => {
    e.preventDefault()
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit()
    }
  }
  exportCheckout = () => {
    this.props.exportCheckout()
  }
  handleReset = async () => {
    await this.checkoutReportModel.clearDepart()
    await this.checkoutReportModel.clearManager()
    await this.checkoutReportModel.selectCheckoutCompany(null)
    await this.checkoutReportModel.selectCheckoutDepart(null)
    await this.props.form.resetFields()

    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit()
    }
  }
  changeCheckoutCompany = async (value) => {
    await this.checkoutReportModel.clearDepart()
    await this.checkoutReportModel.selectCheckoutCompany(value)
    await this.checkoutReportModel.selectCheckoutDepart(null)
    this.props.form.resetFields('departmentId')
    this.props.form.resetFields('salesManagerId')
    await this.checkoutReportModel.fetchDepart({ companyId: value })
  }
  changeCheckoutDepart = async (value) => {
    await this.checkoutReportModel.clearManager()
    this.checkoutReportModel.selectCheckoutDepart(value)
    this.props.form.resetFields('salesManagerId')
    await this.checkoutReportModel.fetchManager({ companyId: this.props.checkoutCom, departmentId: value })
  }
  render () {
    const { form } = this.props
    const { getFieldDecorator } = form
    return (
      <SearchForm autoComplete='off' onSubmit={this.onSubmit}>
        <Row>
          <Col>
            <Form.Item
              label='分公司'
              labelAlign='left'
            >
              {
                getFieldDecorator('companyId', {
                })(<Select placeholder='全部' allowClear onChange={this.changeCheckoutCompany}>
                  {
                    (this.props.comList || []).map((item) => {
                      return (
                        <Option key={item.id} value={item.id} >{item.name}</Option>
                      )
                    })
                  }
                </Select>)

              }
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label='部门'
            >
              {
                getFieldDecorator('departmentId', {
                })(<Select placeholder='全部' disabled={!this.props.checkoutCom} allowClear onChange={this.changeCheckoutDepart}>
                  {
                    (this.props.departList || []).map((item) => {
                      return (
                        <Option key={item.id} value={item.id} >{item.name}</Option>
                      )
                    })
                  }
                </Select>)

              }
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label='销售经理'
              labelAlign='left'
            >
              {
                getFieldDecorator('salesManagerId', {
                })(<Select placeholder='全部' disabled={!this.props.checkoutDepart} allowClear>
                  {
                    (this.props.ManagerList || []).map((item) => {
                      return (
                        <Option key={item.id} value={item.id} >{item.name}</Option>
                      )
                    })
                  }

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
                  icon='search'
                >查询</Button>
                <Button style={{ marginLeft: '24px' }} onClick={this.handleReset}>重置</Button>

              </div>
              <div>
                <Button style={{ marginLeft: '24px' }} type='primary' onClick={this.exportCheckout} icon='download' >
                  导出
                </Button>
                {/* <Button style={{ marginLeft: '24px' }} onClick={this.handleReset}>导入</Button> */}
              </div>
            </div>
          </Col>

        </Row>
      </SearchForm>
    )
  }
}
const SearchReCheckoutForm = Form.createWithModel({
  formId: 'ReCheckout/ReCheckoutForm',
  onValuesChange: (props, changedValues, allValues) => {
    // console.log(props, changedValues, allValues)
  }
})(ReCheckoutForm)
export default SearchReCheckoutForm
