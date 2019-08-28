import React, { Component } from 'react'
import { message, Spin } from 'antd'
// import { Switch, Route } from '@symph/joy/router'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
import PageHeader from '../../../component/PageHeader'
import StaffModel from '../../../model/StaffModel'
import { PageBodyCard } from '../../../component/Card'
import SubmitStaffManForm from './StaffManForm'
import { parse } from 'querystring'
// import { object } from 'prop-types'
@controller(({ staff }, { match }) => {
  let query = parse(window.location.search.slice(1))
  return {
    staffDetail: staff.staffDetail,
    isRevise: query.isRevise ? query.isRevise : null,
    detail: query.detail ? query.detail : null,
    id: query.id ? query.id : null
  }
})
export default class StaffManFormCtl extends Component {
    state = {
      isLoading: false
    }
    @autowire()
    staffModel: StaffModel
    async componentDidMount () {
      try {
        await this.staffModel.fetchCompany()
        await this.staffModel.clearDepart()
      } catch (e) {
        message.error(e.message || '出错了，请重试')
      }

      if (this.props.id) {
        try {
          this.setState({
            isLoading: true
          })
          await this.staffModel.getStaffModel(this.props.id)
          await this.staffModel.fetchDepart({ 'companyName': this.props.staffDetail.companyName })
          await ['number', 'companyName', 'departmentName', 'name', 'phone', 'role'].forEach(data => {
            this.SubmitStaffMForm.props.form.setFieldsValue({ [data]: this.props.staffDetail[data] })
          })
        } catch (e) {
          message.error(e.message || '出错了，请重试')
        }
        this.setState({
          isLoading: false
        })
      }
    }

    goBack = async () => {
      await this.SubmitStaffMForm.props.form.resetFields()
      await this.props.history.goBack()
    }
    onCancle = () => {
      this.props.history.goBack()
    }
    onSubmitSearch = async () => {
      this.SubmitStaffMForm.props.form.validateFields(async (err, fieldsValue) => {
        if (err) {
          return
        }
        let values = {
          ...fieldsValue
        }
        console.log(values)

        try {
          this.setState({
            isLoading: true
          })
          if (this.props.id) {
            values = Object.assign(values, { id: this.props.id })
            await this.staffModel.updateStaffModel({ ...values })
            Promise.all([this.setState({ isLoading: false }), message.success('修改成功'), this.SubmitStaffMForm.props.form.resetFields(), this.props.history.goBack()])
          } else {
            await this.staffModel.addStaff({ ...values })
            Promise.all([this.setState({ isLoading: false }), message.success('新增成功'), this.SubmitStaffMForm.props.form.resetFields(), this.props.history.goBack()])
          }
        } catch (e) {
          message.error(e.message || '出错了，请重试')
          this.setState({
            isLoading: false
          })
        }
      })
    }
    render () {
      return (
        <div >
          {
            this.props.detail === 'true'
              ? <PageHeader
                onBack={this.goBack}
                className='tabs'
                title={<span className='title'>员工详情</span>}
              />
              : <PageHeader
                onBack={this.goBack}
                className='tabs'
                title={<span className='title'>{this.props.id ? '修改员工' : '新增员工'}</span>}
              />
          }

          <PageBodyCard>
            <Spin spinning={this.state.isLoading}>
              {/* <div className={styles.SubmitProductManFormBox}> */}
              <SubmitStaffManForm onSubmit={this.onSubmitSearch} onCancle={this.onCancle} formRef={(form) => { this.SubmitStaffMForm = form }} />
            </Spin>
            {/* </div> */}
          </PageBodyCard>
        </div>
      )
    }
}
