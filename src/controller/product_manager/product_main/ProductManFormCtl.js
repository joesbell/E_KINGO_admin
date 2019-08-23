import React, { Component } from 'react'
import { message } from 'antd'
// import { Switch, Route } from '@symph/joy/router'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
import PageHeader from '../../../component/PageHeader'
import SupplierModel from '../../../model/SupplierModel'
import { PageBodyCard } from '../../../component/Card'
import SubmitProductManForm from './ProductManForm'

@controller(({ sup }, { match }) => {
  return {
    supRecords: sup.records
  }
})
export default class ProductManForm extends Component {
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
    this.SubmitPMForm.props.form.validateFields(async (err, fieldsValue) => {
      if (err) {
        return
      }
      let paths = []
      fieldsValue['paths'].fileList.map((i) => {
        paths.push(i.response.data[0])
      })
      let values = {
        ...fieldsValue,
        paths: paths
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
          title={<span className='title'>新增商品</span>}
        />
        <PageBodyCard>
          {/* <div className={styles.SubmitProductManFormBox}> */}
          <SubmitProductManForm onSubmit={this.onSubmitSearch} onCancle={this.onCancle} formRef={(form) => { this.SubmitPMForm = form }} />

          {/* </div> */}
        </PageBodyCard>
      </div>
    )
  }
}
