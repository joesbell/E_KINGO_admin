import React, { Component } from 'react'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
import StaffModel from '../../../model/StaffModel'
import SearchForm, { Row, Col } from '../../../component/SearchForm'
import Form from '../../../component/Form'
import { Button, Input, Select } from 'antd'
const { Option } = Select

@controller(({ staff }) => {
  return {
    comList: staff.comList, // 分公司
    departList: staff.departList, // 部门
    Com: staff.Com
  }
})
class StaffMainForm extends Component {
  @autowire()
  staffModel: StaffModel
    onSubmit = (e) => {
      e.preventDefault()
      if (typeof this.props.onSubmit === 'function') {
        this.props.onSubmit()
      }
    }

  selectCompany=async (val) => {
    await this.staffModel.clearDepart()
    await this.staffModel.selectCompany(val)
    this.props.form.resetFields('departmentId')
    await this.staffModel.fetchDepart({ companyId: val })
  }
    handleReset = () => {
      this.props.form.resetFields()
      if (typeof this.props.onSubmit === 'function') {
        this.props.onSubmit()
      }
    }
  addStaff = () => {
    this.props.history.push(
      '/home/staffManager/staffForm?isRevise=false'
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
              label='员工姓名'
              labelAlign='left'
            >
              {
                getFieldDecorator('name')(<Input allowClear placeholder='请输入' />)
              }
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label='员工电话'
              labelAlign='left'
            >
              {
                getFieldDecorator('phone')(<Input allowClear placeholder='请输入' />)
              }
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label='分公司'
              labelAlign='left'
            >
              {
                getFieldDecorator('companyId', {
                })(<Select placeholder='全部' allowClear onChange={this.selectCompany}>
                  {
                    (this.props.comList || []).map((el) => {
                      return (
                        <Option key={el.name} value={el.id}>{el.name}</Option>
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
              labelAlign='left'
            >
              {
                getFieldDecorator('departmentId', {
                })(<Select placeholder='全部' allowClear disabled={!this.props.Com}>
                  {
                    (this.props.departList || []).map((el) => {
                      return (
                        <Option key={el.name} value={el.id}>{el.name}</Option>
                      )
                    })
                  }

                </Select>)

              }
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label='员工角色'
              labelAlign='left'
            >
              {
                getFieldDecorator('role', {
                })(<Select placeholder='全部' allowClear>
                  {/* <Option key="" >全部</Option> */}
                  <Option value={1} >普通员工</Option>
                  <Option value={2} >销售经理</Option>
                </Select>)

              }
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={18}>
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
                <Button style={{ marginLeft: '24px' }} type='primary' onClick={this.addStaff}>新增员工</Button>

                <Button style={{ marginLeft: '24px' }} icon='download' type='primary' href='http://118.24.50.239:8181/staff/download_template' download >下载导入模板</Button>

              </div>
            </div>
          </Col>

        </Row>
      </SearchForm>
    )
  }
}
const SearchStaffMainForm = Form.createWithModel({
  formId: 'StaffMain/StaffMainForm',
  onValuesChange: (props, changedValues, allValues) => {
    // console.log(props, changedValues, allValues)
  }
})(StaffMainForm)
export default SearchStaffMainForm
