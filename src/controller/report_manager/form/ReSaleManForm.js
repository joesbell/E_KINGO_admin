import React, { Component } from 'react'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
import saleReportModel from '../../../model/saleReportModel'

import SearchForm, { Row, Col } from '../../../component/SearchForm'
import Form from '../../../component/Form'
import { Button, Select } from 'antd'
const { Option } = Select

@controller(({ saleReport }) => {
  return {
    comList: saleReport.comList, // 分公司
    departList: saleReport.departList, // 部门
    saleCom: saleReport.saleCom,
    saleDepart: saleReport.saleDepart,
    ManagerList: saleReport.ManagerList// 销售经理
  }
})
class ReSaleManForm extends Component {
  @autowire()
  saleReportModel: saleReportModel
  onSubmit = (e) => {
    e.preventDefault()
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit()
    }
  }
  exportSale=() => {
    this.props.exportSale()
  }
  handleReset = async () => {
    await this.saleReportModel.clearDepart()
    await this.saleReportModel.clearManager()
    await this.saleReportModel.selectSaleCompany(null)
    await this.saleReportModel.selectSaleDepart(null)
    await this.props.form.resetFields()

    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit()
    }
  }
  addProduct = () => {
    this.props.history.push(
      '/home/productManager/productForm?isRevise=false'
    )
  }
  changeSaleCompany = async (value) => {
    await this.saleReportModel.clearDepart()
    await this.saleReportModel.selectSaleCompany(value)
    await this.saleReportModel.selectSaleDepart(null)
    this.props.form.resetFields('departmentId')
    this.props.form.resetFields('salesManagerId')
    await this.saleReportModel.fetchDepart({ companyId: value })
  }
  changeSaleDepart = async (value) => {
    await this.saleReportModel.clearManager()
    this.saleReportModel.selectSaleDepart(value)
    this.props.form.resetFields('salesManagerId')
    await this.saleReportModel.fetchManager({ companyId: this.props.saleCom, departmentId: value })
  }
  render () {
    const { form } = this.props
    const { getFieldDecorator } = form
    return (
      <SearchForm autoComplete='off' onSubmit={this.onSubmit}>
        <Row>
          <Col>
            <Form.Item
              label='订单状态'
              labelAlign='left'
            >
              {
                getFieldDecorator('orderStatus', {
                })(<Select placeholder='全部' allowClear>
                  <Option value={0} >删除</Option>
                  <Option value={1} >未收货</Option>
                  <Option value={2} >已确认收货</Option>
                </Select>)

              }
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label='分公司'
            >
              {
                getFieldDecorator('companyId', {
                })(<Select placeholder='全部' allowClear onChange={this.changeSaleCompany}>
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
                })(<Select placeholder='全部' disabled={!this.props.saleCom} allowClear onChange={this.changeSaleDepart}>
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
                })(<Select placeholder='全部' disabled={!this.props.saleDepart} allowClear>
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
                <Button style={{ marginLeft: '24px' }} type='primary' onClick={this.exportSale} icon='download' >
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
const SearchReSaleManForm = Form.createWithModel({
  formId: 'ReSaleMan/ReSaleManForm',
  onValuesChange: (props, changedValues, allValues) => {
    // console.log(props, changedValues, allValues)
  }
})(ReSaleManForm)
export default SearchReSaleManForm
