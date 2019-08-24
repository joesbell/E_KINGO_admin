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
import { parse } from 'querystring'

@controller(({ sup, pro }, { match }) => {
  let query = parse(window.location.search.slice(1))
  console.log(query)

  return {
    supRecords: sup.records,
    proDetail: pro.proDetail,
    isRevise: query.isRevise ? query.isRevise : null,
    detail: query.detail ? query.detail : null,
    id: query.id ? query.id : null
  }
})
export default class ProductManForm extends Component {
  @autowire()
  supplierModel: SupplierModel
  @autowire()
  proModel: ProModel
  async componentDidMount () {
    if (this.props.id) {
      await this.proModel.getProDetail(this.props.id)
      // await ["number", "category", "name", "costPrice", "petailPrice", "limitNum", "onlineStartDate", "onlineEndDate", "supplerId"].forEach(data => {
      //   this.SubmitPMForm.props.form.setFieldsValue({ [data]: this.props.proDetail[data] })
      // });
      // await console.log(this.props.proDetail);

      await this.SubmitPMForm.props.form.setFieldsValue({ 'number': this.props.proDetail.number })
      this.SubmitPMForm.props.form.setFieldsValue({ 'category': this.props.proDetail.category })
      this.SubmitPMForm.props.form.setFieldsValue({ 'name': this.props.proDetail.name })
      this.SubmitPMForm.props.form.setFieldsValue({ 'costPrice': this.props.proDetail.costPrice })
      this.SubmitPMForm.props.form.setFieldsValue({ 'petailPrice': this.props.proDetail.petailPrice })
      this.SubmitPMForm.props.form.setFieldsValue({ 'limitNum': this.props.proDetail.limitNum })
      // this.SubmitPMForm.props.form.setFieldsValue({"onlineStartDate":this.props.proDetail.onlineStartDate})
      // this.SubmitPMForm.props.form.setFieldsValue({"onlineEndDate":this.props.proDetail.onlineEndDate})
      this.SubmitPMForm.props.form.setFieldsValue({ 'supplerId': this.props.proDetail.supplerId })
    }
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
        {
          this.props.detail === 'true'
            ? <PageHeader
              onBack={this.goBack}
              className='tabs'
              title={<span className='title'>商品详情</span>}
            />
            : <PageHeader
              onBack={this.goBack}
              className='tabs'
              title={<span className='title'>{this.props.isRevise === 'true' ? '修改商品' : '新增商品'}</span>}
            />
        }

        <PageBodyCard>
          {/* <div className={styles.SubmitProductManFormBox}> */}
          <SubmitProductManForm onSubmit={this.onSubmitSearch} onCancle={this.onCancle} formRef={(form) => { this.SubmitPMForm = form }} />

          {/* </div> */}
        </PageBodyCard>
      </div>
    )
  }
}
