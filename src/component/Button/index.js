import React, { Component } from 'react'
import { Button } from 'antd'
export default class AddButton extends Component {
  render () {
    return (
      <div style={{ 'marginBottom': '8px' }}>
        <Button type='primary' {...this.props}>新建</Button>
      </div>
    )
  }
}
