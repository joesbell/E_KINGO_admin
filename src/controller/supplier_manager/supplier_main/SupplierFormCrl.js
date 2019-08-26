import React, { Component } from 'react'
import { message, Spin } from 'antd'
// import { Switch, Route } from '@symph/joy/router'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
import PageHeader from '../../../component/PageHeader'
import SupplierModel from '../../../model/SupplierModel'
import { PageBodyCard } from '../../../component/Card'
import SubmitSupplierForm from './SupplierForm'
import { parse } from 'querystring'

@controller(({ sup }) => {
  let query = parse(window.location.search.slice(1))
  return {
    id: query.id,
    isRevise: query.isRevise,
    supplierFormData: sup.supplierFormData
  }
})
export default class SupplierFormCrl extends Component {
  state = {
    isLoading: false
  }
  @autowire()
  supplierModel: SupplierModel

  async componentDidMount () {
    if (this.props.isRevise === 'true') {
      try {
        this.setState({
          isLoading: true
        })
        await this.supplierModel.getsupplierForm(this.props.id)
        await ['name', 'phone', 'companyName', 'address', 'remark'].forEach(data => {
          this.SubmitSpForm.props.form.setFieldsValue({ [data]: this.props.supplierFormData[data] })
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
    await this.SubmitSpForm.props.form.resetFields()
    await this.props.history.goBack()
  }
  onCancle = () => {
    this.props.history.goBack()
  }
  onSubmitSearch = () => {
    this.SubmitSpForm.props.form.validateFields(async (err, fieldsValue) => {
      if (err) {
        return
      }
      let values
      if (this.props.id) {
        values = {
          id: this.props.id,
          ...fieldsValue
        }
      } else {
        values = {
          ...fieldsValue
        }
      }

      try {
        this.setState({
          isLoading: true
        })
        if (this.props.id) {
          await this.supplierModel.updateSuplier({ ...values })
        } else {
          await this.supplierModel.addSuplier({ ...values })
        }

        await Promise.all([this.setState({ isLoading: false }), this.goBack(), message.success(this.props.id ? '修改成功' : '新增成功')])
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
        <PageHeader
          onBack={this.goBack}
          className='tabs'
          title={<span className='title'>{this.props.isRevise === 'true' ? '修改供货商' : '新增供货商'}</span>}
        />
        <PageBodyCard>
          <Spin spinning={this.state.isLoading}>
            <SubmitSupplierForm onSubmit={this.onSubmitSearch} onCancle={this.onCancle} formRef={(form) => { this.SubmitSpForm = form }} />
          </Spin>
        </PageBodyCard>
      </div>
    )
  }
}
