import React, { Component } from 'react'
import PageHeader from '../../../component/PageHeader'
import { PageBodyCard } from '../../../component/Card'
import UserManMainCtl from './user_main/UserManMainCtl'
export default class UserManCtl extends Component {
  render () {
    return (
      <div className='taskPools'>
        <PageHeader
          className='tabs'
          title={<div className='title'>用户管理</div>}
        />
        <PageBodyCard>
          <UserManMainCtl />
        </PageBodyCard>
      </div>
    )
  }
}
