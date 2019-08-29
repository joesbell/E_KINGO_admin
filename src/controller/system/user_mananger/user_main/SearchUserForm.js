import React, { Component } from 'react'
// import controller from '@symph/joy/controller'
// import autowire from '@symph/joy/autowire'
import SearchForm, { Row, Col } from '../../../../component/SearchForm'
import Form from '../../../../component/Form'
import { Button, Input, Select } from 'antd'
const { Option } = Select
class sysUserForm extends Component {
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
    addUser = () => {
      this.props.history.push(
        '/home/systemManager/userManager/userManForm?isRevise=false'
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
                label='用户账号'
                labelAlign='left'
              >
                {
                  getFieldDecorator('loginName')(<Input allowClear placeholder='请输入' />)
                }
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label='用户姓名'
              >
                {
                  getFieldDecorator('userName')(<Input allowClear placeholder='请输入' />)
                }
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label='手机号码'
              >
                {
                  getFieldDecorator('mobile')(<Input allowClear placeholder='请输入' />)
                }
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label='状态'
                labelAlign='left'

              >
                {
                  getFieldDecorator('status', {
                  })(<Select placeholder='全部' allowClear >

                    <Option key={0} value={0}>停用</Option>
                    <Option key={1} value={1}>正常</Option>
                    <Option key={-1} value={-1}>删除</Option>
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
                  <Button style={{ marginLeft: '24px' }} type='primary' onClick={this.addUser}>新增用户</Button>
                  {/* <Button style={{ marginLeft: '24px' }} onClick={this.handleReset}>导入</Button> */}
                </div>
              </div>
            </Col>

          </Row>
        </SearchForm>
      )
    }
}
const SearchUserForm = Form.createWithModel({
  formId: 'sysUser/sysUserForm',
  onValuesChange: (props, changedValues, allValues) => {
    // console.log(props, changedValues, allValues)
  }
})(sysUserForm)
export default SearchUserForm
