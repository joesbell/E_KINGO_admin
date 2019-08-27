import React, { Component } from 'react'
import { message, Spin } from 'antd'
import moment from 'moment'
// import { Switch, Route } from '@symph/joy/router'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
import PageHeader from '../../../component/PageHeader'
import StaffModel from '../../../model/StaffModel'
import { PageBodyCard } from '../../../component/Card'
import SubmitStaffManForm from './StaffManForm'
import { parse } from 'querystring'
// import { object } from 'prop-types'
let uid = 1
@controller(({ staff }, { match }) => {
  let query = parse(window.location.search.slice(1))
  return {
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
      if (this.props.id) {
        try {
          this.setState({
            isLoading: true
          })
          let fileList = []
          await this.proModel.getProDetail(this.props.id)
          await ['number', 'category', 'name', 'costPrice', 'paths', 'petailPrice', 'onlineStartDate', 'onlineEndDate', 'limitNum', 'supplerId'].forEach(data => {
            if (data === 'onlineStartDate' || data === 'onlineEndDate') {
              this.SubmitPMForm.props.form.setFieldsValue({ [data]: moment(this.props.proDetail[data], 'YYYY-MM-DD') })
            } else {
              this.SubmitPMForm.props.form.setFieldsValue({ [data]: this.props.proDetail[data] })
            }
          })
          for (const iterator of this.props.proDetail.paths) {
            fileList.push({
              url: iterator,
              uid: uid++,
              name: `image${uid++}.png`,
              status: 'done'
            })
          }
          await this.proModel.setFileList(fileList)
        } catch (e) {
          message.error(e.message || '出错了，请重试')
        }
        this.setState({
          isLoading: false
        })
      }
      try {
        await this.staffModel.fetchCompany()
      } catch (e) {
        message.error(e.message || '出错了，请重试')
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
          if (this.props.isRevise === 'true') {
            values = Object.assign(values, { id: this.props.id })
            await this.proModel.updatePro({ ...values })
            Promise.all([this.setState({ isLoading: false }), message.success('修改成功'), this.proModel.setFileList([]), this.SubmitPMForm.props.form.resetFields(), this.props.history.goBack()])
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
                title={<span className='title'>{this.props.isRevise === 'true' ? '修改员工' : '新增员工'}</span>}
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
