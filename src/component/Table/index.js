import React, { Component } from 'react'
import { Table } from 'antd'
import styles from './index.less'

class TableTopActions extends Component {
  render () {
    let { children } = this.props
    let childrenView = []
    if (Array.isArray(children)) {
      childrenView = children.map((item, index) => {
        return (
          <div key={index} className={styles.action}>
            {item}
          </div>
        )
      })
    } else {
      childrenView = children
    }
    return (
      <div className={styles.tableTopAction}>
        {childrenView}
      </div>
    )
  }
}

Table.TableTopActions = TableTopActions

export default Table
