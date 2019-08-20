import React, { Component } from 'react'
import { Spin } from 'antd'
import './index.less'

class DynamicLoading extends Component {
  render () {
    return <Spin spinning>
      <div style={{ minHeight: 200 }} />
    </Spin>
  }
}

export default DynamicLoading
