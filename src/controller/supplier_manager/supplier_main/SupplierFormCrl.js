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

@controller(() => {
  let query = parse(window.location.search.slice(1))
  return {
    id: query.id,
    isRevise: query.isRevise
  }
})
export default class SupplierFormCrl extends Component {
  state = {
    isLoading: false
  }
  @autowire()
  supplierModel: SupplierModel

  async componentDidMount () {
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
      let values = {
        ...fieldsValue
      }
      try {
        this.setState({
          isLoading: true
        })
        console.log(values)
        await this.supplierModel.addSuplier({ ...values })

        await Promise.all([this.setState({ isLoading: false }), this.goBack(), message.success('新增成功')])
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
