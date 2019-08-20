import React, { Component } from 'react'
import { Switch, Route } from '@symph/joy/router'
import controller from '@symph/joy/controller'
import PageHeader from '../../component/PageHeader'
import ReCheckoutCtl from './children/ReCheckoutCtl'
import ReSaleManCtl from './children/ReSaleManCtl'
// import styles from '../PublicManager.less'
import { PageBodyCard } from '../../component/Card'

const Tabs = [{
  key: 'reSale',
  tab: '销售报表'
},
{
  key: 'reCheckout',
  tab: '商品出库报表'
}]
@controller((state, { match }) => {
  return {
    tabKey: match.params.tab || Tabs[0].key
  }
})
export default class ReportManCtl extends Component {
  onTabChange = (key) => {
    this.props.history.replace(`/home/reportManager/${key}`)
  }
  render () {
    return (
      <div>
        <PageHeader
          className='tabs'
          title={<div className='title'>报表管理</div>}
          tabList={Tabs}
          tabActiveKey={this.props.tabKey}
          onTabChange={this.onTabChange}
        />
        <PageBodyCard>
          <Switch>
            <Route path={'/home/reportManager/(reSale)?'} exact component={ReSaleManCtl} />
            <Route path='/home/reportManager/reCheckout' exact component={ReCheckoutCtl} />
          </Switch>
        </PageBodyCard>
      </div>
    )
  }
}
