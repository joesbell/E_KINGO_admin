import React, { Component } from 'react'
import controller from '@symph/joy/controller'
// import autowire from '@symph/joy/autowire'
import SubmitForm, { Row, Col, ActionsItem } from '../../../component/SubmitForm'
import Form from '../../../component/Form'
import {
  Button,
  Input
  // Select
} from 'antd'
// const { Option } = Select
const labelCol = {
  md: { span: 24 },
  lg: { span: 8 },
  xl: { span: 8 },
  xxl: { span: 8 }
}
const wrapperCol = {
  md: { span: 24 },
  lg: { span: 10, offset: 8 },
  xl: { span: 8, offset: 8 },
  xxl: { span: 8, offset: 8 }
}

@controller(({ sup }, { match }) => {
  return {
    supRecords: sup.records
  }
})
class SupplierForm extends Component {
  onSubmit = (e) => {
    e.preventDefault()
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit()
    }
  }

  handleReset = async () => {
    await this.props.form.resetFields()
    await this.props.onCancle()
  }
  render () {
    const { form } = this.props
    const { getFieldDecorator } = form
    return (
      <SubmitForm onSubmit={this.onSubmit}>
        <Row>
          <Col>
            <Form.Item
              label='供货商名称'
            >
              {
                getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '不能为空'
                    }
                  ]
                })(<Input allowClear />)
              }
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label='供货商电话'
            >
              {
                getFieldDecorator('phone', {
                  rules: [
                    {
                      required: true,
                      message: '不能为空'
                    }
                  ]
                })(<Input allowClear />)
              }
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label='公司名称'
            >
              {
                getFieldDecorator('namepe', {
                  rules: [
                    {
                      required: true,
                      message: '不能为空'
                    }
                  ]
                })(<Input allowClear />)
              }
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              label='地址'
            >
              {
                getFieldDecorator('address', {
                  rules: [
                    {
                      required: true,
                      message: '不能为空'
                    }
                  ]
                })(<Input allowClear />)
              }
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label='备注'
            >
              {
                getFieldDecorator('remark')(<Input allowClear />)
              }
            </Form.Item>
          </Col>
          <ActionsItem labelCol={labelCol} wrapperCol={wrapperCol}>
            <Button type='primary' onClick={this.onSubmit}>保存</Button>
            <Button style={{ marginLeft: '24px' }} onClick={this.handleReset}>取消</Button>
          </ActionsItem>
        </Row>
      </SubmitForm>
    )
  }
}
const SubmitSupplierForm = Form.createWithModel({
  formId: 'SupplierF/SupplierForm',
  onValuesChange: (props, changedValues, allValues) => {
    // console.log(props, changedValues, allValues)
  }
})(SupplierForm)
export default SubmitSupplierForm
