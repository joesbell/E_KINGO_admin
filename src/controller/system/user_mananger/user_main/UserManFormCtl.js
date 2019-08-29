import React, { Component } from 'react'
import { message, Spin } from 'antd'

// import { Switch, Route } from '@symph/joy/router'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
import PageHeader from '../../../../component/PageHeader'
import SystemUserModel from '../../../../model/SystemUserModel'
import { PageBodyCard } from '../../../../component/Card'
import SubmitUserManForm from './UserManForm'
import { parse } from 'querystring'
// import { object } from 'prop-types'
@controller(({ sysUser }, { match }) => {
  let query = parse(window.location.search.slice(1))
  return {
    userDetail: sysUser.userDetail,
    isRevise: query.isRevise ? query.isRevise : null,
    detail: query.detail ? query.detail : null,
    id: query.id ? query.id : null
  }
})
export default class UserManFormCtl extends Component {
    state = {
      isLoading: false
    }
    @autowire()
    systemUserModel: SystemUserModel
    async componentDidMount () {
      if (this.props.id) {
        try {
          this.setState({
            isLoading: true
          })
          await this.systemUserModel.getUser(this.props.id)
          await ['loginName', 'password', 'userName', 'mobile'].forEach(data => {
            this.SubmitUManForm.props.form.setFieldsValue({ [data]: this.props.userDetail[data] })
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
      await this.SubmitUManForm.props.form.resetFields()
      await this.props.history.goBack()
    }
    onCancle = () => {
      this.props.history.goBack()
    }
    onSubmitSearch = async () => {
      this.SubmitUManForm.props.form.validateFields(async (err, fieldsValue) => {
        if (err) {
          return
        }
        let values = {
          userType: 0,
          ...fieldsValue
        }

        try {
          this.setState({
            isLoading: true
          })
          if (this.props.isRevise === 'true') {
            values = Object.assign(values, { id: this.props.id })
            await this.systemUserModel.updateUser({ ...values })
            Promise.all([this.setState({ isLoading: false }), message.success('修改成功'), this.SubmitUManForm.props.form.resetFields(), this.props.history.goBack()])
          } else {
            await this.systemUserModel.addUser({ ...values })
            Promise.all([this.setState({ isLoading: false }), message.success('新增成功'), this.SubmitUManForm.props.form.resetFields(), this.props.history.goBack()])
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
                title={<span className='title'>用户详情</span>}
              />
              : <PageHeader
                onBack={this.goBack}
                className='tabs'
                title={<span className='title'>{this.props.isRevise === 'true' ? '修改用户信息' : '新增用户'}</span>}
              />
          }

          <PageBodyCard>
            <Spin spinning={this.state.isLoading}>
              {/* <div className={styles.SubmitProductManFormBox}> */}
              <SubmitUserManForm onSubmit={this.onSubmitSearch} onCancle={this.onCancle} formRef={(form) => { this.SubmitUManForm = form }} />
            </Spin>
            {/* </div> */}
          </PageBodyCard>
        </div>
      )
    }
}
