import React, { Component } from 'react'
import { message } from 'antd'
// import { Switch, Route } from '@symph/joy/router'
// import controller from '@symph/joy/controller'
import PageHeader from '../../../component/PageHeader'
// import AuditMsgCtl from './children/AuditMsgCtl'
// import ApplyInfoCtl from './children/ApplyInfoCtl'
// import TelVerificationCtl from './children/TelVerificationCtl'
// import styles from './CreditGrantingAuditCtl.less'
// import { parse } from 'querystring'
import { PageBodyCard } from '../../../component/Card'
import SubmitProductManForm from './ProductManForm'
// import styles from '../ProductManCtl.less'

// const { Step } = Steps

// const Tabs = [{
//   key: 'auditMsg',
//   tab: '审核信息'
// },
// {
//   key: 'applyInfo',
//   tab: '申请人信息'
// },
// {
//   key: 'telVerification',
//   tab: '电话核查'
// }
// ]
// @controller(({ TodoTaskM }, { match }) => {
//   let query = parse(window.location.search.slice(1))
//   return {
//     isAudit: query.isAudit === 'true',
//     nextTaskName: query.nextTaskName,
//     taskId: query.taskId,
//     tabKey: match.params.tab || Tabs[0].key,
//     flowInstanceId: decodeURI(match.params.flowInstanceId)
//   }
// })

export default class ProductManForm extends Component {
  goBack = async () => {
    await this.props.history.goBack()
  }
  onCancle=() => {
    this.props.history.goBack()
  }
  onSubmitSearch = async () => {
    this.SubmitPMForm.props.form.validateFields(async (err, fieldsValue) => {
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
