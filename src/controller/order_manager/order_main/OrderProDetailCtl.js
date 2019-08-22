import React, { Component } from 'react'
import PageHeader from '../../../component/PageHeader'
import { PageBodyCard } from '../../../component/Card'
export default class OrderProDetailCtl extends Component {
  goBack = async () => {
    await this.props.history.goBack()
  }
  render () {
    return (
      <div className='taskPools'>
        <PageHeader
          onBack={this.onBack}
          className='tabs'
          title={<div className='title'>商品明细</div>}
        />
        <PageBodyCard>
          fffg
        </PageBodyCard>
      </div>
    )
  }
}
