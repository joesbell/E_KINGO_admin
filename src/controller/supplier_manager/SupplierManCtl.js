import React, { Component } from 'react'
import PageHeader from '../../component/PageHeader'
import { PageBodyCard } from '../../component/Card'
import SupplierMainCtl from './supplier_main/SupplierMainCtl'
export default class taskPoolsCtl extends Component {
  render () {
    return (
      <div className='taskPools'>
        <PageHeader
          className='tabs'
          title={<div className='title'>供货商管理</div>}
        />
        <PageBodyCard>
          <SupplierMainCtl />
        </PageBodyCard>
      </div>
    )
  }
}
