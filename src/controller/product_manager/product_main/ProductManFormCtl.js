import React, { Component } from 'react'
import { message, Spin } from 'antd'
import { fmtDate } from '../../../util/dateUtils'
import moment from 'moment'
// import { Switch, Route } from '@symph/joy/router'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
import PageHeader from '../../../component/PageHeader'
import SupplierModel from '../../../model/SupplierModel'
import ProModel from '../../../model/ProModel'
import { PageBodyCard } from '../../../component/Card'
import SubmitProductManForm from './ProductManForm'
import { parse } from 'querystring'
// import { object } from 'prop-types'
let uid = 1
@controller(({ sup, pro }, { match }) => {
  let query = parse(window.location.search.slice(1))
  return {
    supRecords: sup.records,
    proDetail: pro.proDetail,
    isRevise: query.isRevise ? query.isRevise : null,
    detail: query.detail ? query.detail : null,
    id: query.id ? query.id : null
  }
})
export default class ProductManForm extends Component {
  state={
    isLoading: false
  }
  @autowire()
  supplierModel: SupplierModel
  @autowire()
  proModel: ProModel
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
      await this.supplierModel.fetchAllSupplier()
      await this.proModel.proCategory()
    } catch (e) {
      message.error(e.message || '出错了，请重试')
    }
  }

  goBack = async () => {
    await this.SubmitPMForm.props.form.resetFields()
    await this.proModel.setFileList([])
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
      if (fieldsValue['paths'].fileList) {
        fieldsValue['paths'].fileList.map((i) => {
          if (i.response) {
            paths.push(i.response.data[0])
          } else {
            paths.push(i.url)
          }
        })
      } else {
        paths = fieldsValue['paths']
      }

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
        if (this.props.isRevise === 'true') {
          values = Object.assign(values, { id: this.props.id })
          await this.proModel.updatePro({ ...values })
          Promise.all([this.setState({ isLoading: false }), message.success('修改成功'), this.proModel.setFileList([]), this.SubmitPMForm.props.form.resetFields(), this.props.history.goBack()])
        } else {
          await this.proModel.addPro({ ...values })
          Promise.all([this.setState({ isLoading: false }), message.success('新增成功'), this.proModel.setFileList([]), this.SubmitPMForm.props.form.resetFields(), this.props.history.goBack()])
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
              title={<span className='title'>商品详情</span>}
            />
            : <PageHeader
              onBack={this.goBack}
              className='tabs'
              title={<span className='title'>{this.props.isRevise === 'true' ? '修改商品' : '新增商品'}</span>}
            />
        }

        <PageBodyCard>
          <Spin spinning={this.state.isLoading}>
            {/* <div className={styles.SubmitProductManFormBox}> */}
            <SubmitProductManForm onSubmit={this.onSubmitSearch} onCancle={this.onCancle} formRef={(form) => { this.SubmitPMForm = form }} />
          </Spin>
          {/* </div> */}
        </PageBodyCard>
      </div>
    )
  }
}
