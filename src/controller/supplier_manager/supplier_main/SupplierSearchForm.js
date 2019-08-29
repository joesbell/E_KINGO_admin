import React, { Component } from 'react'
// import controller from '@symph/joy/controller'
// import autowire from '@symph/joy/autowire'
import SearchForm, { Row, Col } from '../../../component/SearchForm'
import Form from '../../../component/Form'
import { Button, Input } from 'antd'
class SupplierSearchForm extends Component {
  onSubmit = (e) => {
    e.preventDefault()
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit()
    }
  }

  handleReset = () => {
    this.props.form.resetFields()
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit()
    }
  }
  addSupplier = () => {
    this.props.history.push(
      '/home/supplierManager/supplierForm?isRevise=false'
    )
  }
  render () {
    const { form } = this.props
    const { getFieldDecorator } = form
    return (
      <SearchForm autoComplete='off' onSubmit={this.onSubmit}>
        <Row>
          <Col>
            <Form.Item
              label='供货商名称'
              labelAlign='left'
            >
              {
                getFieldDecorator('name')(<Input allowClear placeholder='请输入' />)
              }
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label='供货商电话'
              labelAlign='left'
            >
              {
                getFieldDecorator('phone')(<Input allowClear placeholder='请输入' />)
              }
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={12}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', marginBottom: '10px' }}>
              <div>
                <Button
                  type='primary'
                  htmlType='submit'
                >查询</Button>
                <Button style={{ marginLeft: '24px' }} onClick={this.handleReset}>重置</Button>

              </div>
              <div>
                <Button style={{ marginLeft: '24px' }} type='primary' onClick={this.addSupplier}>新增供货商</Button>
                {/* <Button style={{ marginLeft: '24px' }} onClick={this.handleReset}>导入</Button> */}
              </div>
            </div>
          </Col>

        </Row>
      </SearchForm>
    )
  }
}
const SearchSupplierForm = Form.createWithModel({
  formId: 'Supplier/SupplierSearchForm',
  onValuesChange: (props, changedValues, allValues) => {
    // console.log(props, changedValues, allValues)
  }
})(SupplierSearchForm)
export default SearchSupplierForm
