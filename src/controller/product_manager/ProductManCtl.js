import React, { Component } from 'react'
import PageHeader from '../../component/PageHeader'
import { PageBodyCard } from '../../component/Card'
import ProductManMainCtl from './product_main/ProductManMainCtl'
export default class taskPoolsCtl extends Component {
  render () {
    return (
      <div className='taskPools'>
        <PageHeader
          className='tabs'
          title={<div className='title'>商品管理</div>}
        />
        <PageBodyCard>
          <ProductManMainCtl />
        </PageBodyCard>
      </div>
    )
  }
}
