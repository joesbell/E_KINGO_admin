import React, { Component } from 'react'
import { message } from 'antd'
// import { Switch, Route } from '@symph/joy/router'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
import PageHeader from '../../../component/PageHeader'
import SupplierModel from '../../../model/SupplierModel'
import { PageBodyCard } from '../../../component/Card'
import SubmitSupplierForm from './SupplierForm'

@controller(({ sup }, { match }) => {
  return {
    supRecords: sup.records
  }
})
export default class SupplierFormCrl extends Component {
  @autowire()
  supplierModel: SupplierModel

  async componentDidMount () {
    await this.supplierModel.fetchAllSupplier()
  }

  goBack = async () => {
    await this.props.history.goBack()
  }
  onCancle = () => {
    this.props.history.goBack()
  }
  onSubmitSearch = async () => {
    this.SubmitSpForm.props.form.validateFields(async (err, fieldsValue) => {
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

        // await this.taskPoolsModel.fetchTaskPoolsData({ pageNum, pageSize, searchArgs: values })
      } catch (e) {
        message.error(e.message || '出错了，请重试')
      }
      this.setState({
        isLoading: false
      })
    })
  }
  render () {
    return (
      <div >
        <PageHeader
          onBack={this.goBack}
          className='tabs'
          title={<span className='title'>新增供货商</span>}
        />
        <PageBodyCard>
          {/* <div className={styles.SubmitProductManFormBox}> */}
          <SubmitSupplierForm onSubmit={this.onSubmitSearch} onCancle={this.onCancle} formRef={(form) => { this.SubmitSpForm = form }} />

          {/* </div> */}
        </PageBodyCard>
      </div>
    )
  }
}
