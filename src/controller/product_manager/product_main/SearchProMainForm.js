import React, { Component } from 'react'
// import controller from '@symph/joy/controller'
// import autowire from '@symph/joy/autowire'
import SearchForm, { Row, Col } from '../../../component/SearchForm'
import Form from '../../../component/Form'
import { Button, Input, Select } from 'antd'
const { Option } = Select
class ProMainForm extends Component {
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
  addProduct = () => {
    this.props.history.push(
      '/home/productManager/productForm?isRevise=false'
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
              label='商品名称'
              labelAlign='left'
            >
              {
                getFieldDecorator('name')(<Input allowClear placeholder='请输入' />)
              }
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label='商品状态'
              labelAlign='left'
            >
              {
                getFieldDecorator('status', {
                })(<Select placeholder='全部' allowClear>
                  {/* <Option key="" >全部</Option> */}
                  <Option value={1} >上线</Option>
                  <Option value={0} >下线</Option>
                </Select>)

              }
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={12}>
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
                <Button style={{ marginLeft: '24px' }} type='primary' onClick={this.addProduct}>新增商品</Button>
                {/* <Button style={{ marginLeft: '24px' }} onClick={this.handleReset}>导入</Button> */}
              </div>
            </div>
          </Col>

        </Row>
      </SearchForm>
    )
  }
}
const SearchProMainForm = Form.createWithModel({
  formId: 'ProductManMain/ProMainForm',
  onValuesChange: (props, changedValues, allValues) => {
    // console.log(props, changedValues, allValues)
  }
})(ProMainForm)
export default SearchProMainForm
