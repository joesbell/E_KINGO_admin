import React, { Component } from 'react'
import { Card } from 'antd'
import styles from './index.less'
import classNames from 'classnames'

export class PageBodyCard extends Component {
  render () {
    return (
      <Card bordered={false} {...this.props} className={classNames(styles.pageBodyCard, this.props.className)} />
    )
  }
}

Card.PageBodyCard = PageBodyCard

export default Card
