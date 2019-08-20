import React, { Component } from 'react'
// import { Steps } from 'antd'
// import { Switch, Route } from '@symph/joy/router'
// import controller from '@symph/joy/controller'
import PageHeader from '../../../component/PageHeader'
// import AuditMsgCtl from './children/AuditMsgCtl'
// import ApplyInfoCtl from './children/ApplyInfoCtl'
// import TelVerificationCtl from './children/TelVerificationCtl'
// import styles from './CreditGrantingAuditCtl.less'
// import { parse } from 'querystring'
// import styles from '../PublicManager.less'
import { PageBodyCard } from '../../../component/Card'
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
  // onTabChange = (key) => {
  //   this.props.history.replace(`/creditGrantingAudit/${encodeURI(this.props.flowInstanceId)}/${key}${window.location.search}`)
  // }
  goBack = async () => {
    await this.props.history.goBack()
  }
  render () {
    return (
      <div >
        <PageHeader
          onBack={this.goBack}
          className='tabs'
          title={<span className='title'>新增商品</span>}
        // tabList={Tabs}
        // tabActiveKey={this.props.tabKey}
        // onTabChange={this.onTabChange}
        />
        <PageBodyCard>
          新增商品
          {/* <Switch>
            <Route path={'/creditGrantingAudit/:id/auditMsg'} exact component={AuditMsgCtl} />
            <Route path={'/creditGrantingAudit/:id/applyInfo'} exact component={ApplyInfoCtl} />
            <Route path={'/creditGrantingAudit/:id/telVerification'} exact component={TelVerificationCtl} />
          </Switch> */}
        </PageBodyCard>
      </div>
    )
  }
}
