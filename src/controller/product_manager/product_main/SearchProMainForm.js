import React, { Component } from 'react'
// import controller from '@symph/joy/controller'
// import autowire from '@symph/joy/autowire'
import SearchForm, { Row, Col, ActionsItem } from '../../../component/SearchForm'
import Form from '../../../component/Form'
import { Button, Input } from 'antd'

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
            >
              {
                getFieldDecorator('customerName')(<Input allowClear placeholder='商品名称' />)
              }
            </Form.Item>
          </Col>
          <ActionsItem>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <Button
                  type='primary'
                  htmlType='submit'
                >查询</Button>
                <Button style={{ marginLeft: '24px' }} onClick={this.handleReset}>重置</Button>

              </div>
              <div>
                <Button style={{ marginLeft: '24px' }} type='primary' onClick={this.addProduct}>新增商品</Button>
                {/* <Button style={{ marginLeft: '24px' }} onClick={this.handleReset}>导入</Button> */}
              </div>
            </div>

          </ActionsItem>

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
