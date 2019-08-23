import React, { Component } from 'react'
import { message } from 'antd'
import { fmtDate } from '../../../util/dateUtils'

// import { Switch, Route } from '@symph/joy/router'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
import PageHeader from '../../../component/PageHeader'
import SupplierModel from '../../../model/SupplierModel'
import ProModel from '../../../model/ProModel'
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
  @autowire()
  proModel: ProModel
  async componentDidMount () {
    await this.supplierModel.fetchAllSupplier()
    await this.proModel.proCategory()
  }

  goBack = async () => {
    await this.SubmitPMForm.props.form.resetFields()
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
        paths: paths,
        onlineStartDate: fmtDate(fieldsValue['onlineStartDate'], 'YYYY-MM-DD 00:00:00'),
        onlineEndDate: fmtDate(fieldsValue['onlineEndDate'], 'YYYY-MM-DD 23:59:59')
      }
      console.log(values)

      try {
        this.setState({
          isLoading: true
        })

        await this.proModel.addPro({ ...values })
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
