import React, { Component } from 'react'
// import controller from '@symph/joy/controller'
// import autowire from '@symph/joy/autowire'
import SearchForm, { Row, Col } from '../../../component/SearchForm'
import Form from '../../../component/Form'
import { Button, Select } from 'antd'
const { Option } = Select
class ReSaleManForm extends Component {
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
        <SearchForm onSubmit={this.onSubmit}>
          <Row>
            <Col>
              <Form.Item
                label='订单状态'
                labelAlign='left'
              >
                {
                  getFieldDecorator('flowType', {
                  })(<Select placeholder='全部' allowClear>
                    {/* <Option key="" >全部</Option> */}
                    <Option key='0' >上线</Option>
                    <Option key='1' >下线</Option>
                  </Select>)

                }
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label='分公司'
              >
                {
                  getFieldDecorator('flowType', {
                  })(<Select placeholder='全部' allowClear>
                    {/* <Option key="" >全部</Option> */}
                    <Option key='0' >上线</Option>
                    <Option key='1' >下线</Option>
                  </Select>)

                }
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label='部门'
              >
                {
                  getFieldDecorator('flowType', {
                  })(<Select placeholder='全部' allowClear>
                    {/* <Option key="" >全部</Option> */}
                    <Option key='0' >上线</Option>
                    <Option key='1' >下线</Option>
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
                  getFieldDecorator('flowType', {
                  })(<Select placeholder='全部' allowClear>
                    {/* <Option key="" >全部</Option> */}
                    <Option key='0' >上线</Option>
                    <Option key='1' >下线</Option>
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
                  >查询</Button>
                  <Button style={{ marginLeft: '24px' }} onClick={this.handleReset}>重置</Button>

                </div>
                <div>
                  <Button style={{ marginLeft: '24px' }} type='primary' onClick={this.addProduct}>导出</Button>
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
