import React, { Component } from 'react'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
import SubmitForm, { Row, Col, ActionsItem } from '../../../../component/SubmitForm'
import Form from '../../../../component/Form'
import SystemUserModel from '../../../../model/SystemUserModel'
import { parse } from 'querystring'

import { Button, Input } from 'antd'
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

@controller(({ match }) => {
  let query = parse(window.location.search.slice(1))
  return {
    isRevise: query.isRevise ? query.isRevise : null,
    detail: query.detail ? query.detail : null,
    id: query.id ? query.id : null
  }
})
class UserManForm extends Component {
    state = {
      previewVisible: false,
      previewImage: ''
      // fileList: [
      // ]
    };
    @autowire()
    systemUserModel: SystemUserModel
    componentDidMount = () => {

    }
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
        <SubmitForm autoComplete='off' onSubmit={this.onSubmit}>
          <Row>
            <Col>
              <Form.Item
                label='用户账号'
              >
                {
                  getFieldDecorator('loginName', {
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
                label='密码'
              >
                {
                  getFieldDecorator('password', {
                    rules: [
                      {
                        required: true,
                        message: '不能为空'
                      }
                    ]
                  })(<Input setValue={this.setValue} />)
                }
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label='用户姓名'
              >
                {
                  getFieldDecorator('userName', {
                    rules: [
                      {
                        required: true,
                        message: '不能为空'
                      }
                    ]
                  })(<Input readOnly={this.props.detail === 'true'} allowClear={!this.props.detail} />)
                }
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label='手机号码'
              >
                {
                  getFieldDecorator('mobile', {
                    rules: [
                      {
                        required: true,
                        message: '不能为空'
                      },
                      {
                        pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
                        message: '请输入正确手机号'
                      }
                    ]
                  })(<Input allowClear={!this.props.detail} />)
                }
              </Form.Item>
            </Col>
            {
              this.props.detail === 'true'
                ? null
                : <ActionsItem labelCol={labelCol} wrapperCol={wrapperCol}>
                  <Button type='primary' onClick={this.onSubmit}>保存</Button>
                  <Button style={{ marginLeft: '24px' }} onClick={this.handleReset}>取消</Button>
                </ActionsItem>
            }
          </Row>
        </SubmitForm>
      )
    }
}
const SubmitUserManForm = Form.createWithModel({
  formId: 'UserMan/UserManForm',
  onValuesChange: (props, changedValues, allValues) => {
    // console.log(props, changedValues, allValues)
  }
})(UserManForm)
export default SubmitUserManForm
