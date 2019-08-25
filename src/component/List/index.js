import React from 'react'
import { Col, Row } from 'antd'
import styles from './index.less'
import classnames from 'classnames'

class ListRow extends Row {
    static defaultProps = {
      gutter: 16
    }
}

class ListLableCol extends Col {
    static defaultProps = {
      xs: 24, sm: 12, md: 6, lg: 4, xl: 4, xxl: 2
    }
    render () {
      return <Col {...this.props} className={classnames([styles.ListCol, this.props.className])} />
    }
}
class ListCol extends Col {
    static defaultProps = {
      xs: 24, sm: 12, md: 18, lg: 20, xl: 20, xxl: 22
    }
    render () {
      return <Col {...this.props} className={classnames([styles.ListCol, this.props.className])} />
    }
}

export {
  ListLableCol,
  ListCol,
  ListRow
}
