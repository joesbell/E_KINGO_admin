import React, { Component } from 'react'
import PageHeader from '../../../component/PageHeader'
import { PageBodyCard } from '../../../component/Card'
import StaffManMainCtl from './StaffManMainCtl'
export default class StaffManCtl extends Component {
  render () {
    return (
      <div >
        <PageHeader
          className='tabs'
          title={<div className='title'>员工管理</div>}
        />
        <PageBodyCard>
          <StaffManMainCtl />
        </PageBodyCard>
      </div>
    )
  }
}
