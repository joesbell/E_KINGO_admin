import React, { Component } from 'react'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
import SubmitForm, { Row, Col, ActionsItem } from '../../../component/SubmitForm'
import Form from '../../../component/Form'
import StaffModel from '../../../model/StaffModel'

import { parse } from 'querystring'

import { Button, Input, Radio, Select } from 'antd'
const { Option } = Select
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

@controller(({ staff }, { match }) => {
  let query = parse(window.location.search.slice(1))
  return {
    comList: staff.comList,
    departList: staff.departList,
    isRevise: query.isRevise ? query.isRevise : null,
    detail: query.detail ? query.detail : null,
    id: query.id ? query.id : null
  }
})
class StaffManForm extends Component {
    state = {
      Comname: '',
      DepartName: ''
      // fileList: [
      // ]
    };
    @autowire()
    staffModel: StaffModel
    componentDidMount = () => {

    }
    onSubmit = (e) => {
      e.preventDefault()
      if (typeof this.props.onSubmit === 'function') {
        this.props.onSubmit()
      }
    }
    onChange = (value) => {
      this.setState({
        Comname: value
      })
    }
    onBlur = async () => {
      await this.staffModel.changeCompany(this.state.Comname)
      await this.props.form.setFieldsValue({ 'companyName': this.state.Comname })
    //   await this.
    }
    onSearch = (value) => {
      if (value) {
        this.setState({
          Comname: value
        })
      }
    }
    onChangeDepart = (value) => {
      this.setState({
        DepartName: value
      })
    }
    onBlurDepart = async () => {
      await this.staffModel.changeDepart(this.state.DepartName)
      await this.props.form.setFieldsValue({ 'departmentName': this.state.DepartName })
    }
    onSearchDepart = (value) => {
      if (value) {
        this.setState({
          DepartName: value
        })
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
                label='员工编号'
              >
                {
                  getFieldDecorator('number')(<Input disabled placeholder='后台自动生成' allowClear />)
                }
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label='分公司'
              >
                {
                  getFieldDecorator('companyName', {
                    rules: [
                      {
                        required: true,
                        message: '不能为空'
                      }
                    ]
                  })(<Select
                    showSearch
                    optionFilterProp='children'
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    onSearch={this.onSearch}
                    filterOption={(input, option) =>
                      option.props.children.toString().indexOf(input.toString()) >= 0
                    }
                  >
                    {(this.props.comList || []).map(el => (
                      <Option key={el.name} value={el.name} >{el.name}</Option>
                    ))}
                  </Select>)
                }
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label='部门'
              >
                {
                  getFieldDecorator('departmentName', {
                    rules: [
                      {
                        required: true,
                        message: '不能为空'
                      }
                    ]
                  })(<Select
                    showSearch
                    optionFilterProp='children'
                    onChange={this.onChangeDepart}
                    onBlur={this.onBlurDepart}
                    onSearch={this.onSearchDepart}
                    filterOption={(input, option) =>
                      option.props.children.toString().indexOf(input.toString()) >= 0
                    }
                  >
                    {(this.props.departList || []).map(el => (
                      <Option key={el.name} value={el.name} >{el.name}</Option>
                    ))}
                  </Select>)
                }
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label='员工姓名'
              >
                {
                  getFieldDecorator('name', {
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
                label='员工电话'
              >
                {
                  getFieldDecorator('phone', {
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
                  })(<Input style={{ width: '100%' }} min={0} readOnly={this.props.detail === 'true'} step={0.1} />)
                }
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label='员工角色'
              >
                {
                  getFieldDecorator('role', {
                    rules: [
                      {
                        required: true,
                        message: '不能为空'
                      }
                    ]
                  })(<Radio.Group >
                    <Radio value={1}>普通员工</Radio>
                    <Radio value={2}>销售经理</Radio>
                  </Radio.Group>)
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
const SubmitStaffManForm = Form.createWithModel({
  formId: 'StaffMan/StaffManForm',
  onValuesChange: (props, changedValues, allValues) => {
    // console.log(props, changedValues, allValues)
  }
})(StaffManForm)
export default SubmitStaffManForm
