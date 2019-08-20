import React, { Component } from 'react'
import { Col, Row } from 'antd'
import Form from 'antd/lib/form'
import styles from './index.less'
import classnames from 'classnames'

class SearchForm extends Component {
  static defaultProps = {
    labelCol: {
      md: { span: 24 },
      lg: { span: 8 }
    },
    wrapperCol: {
      md: { span: 24 },
      lg: { span: 16 }
    }
  }

  render () {
    return <Form hideRequiredMark {...this.props} className={classnames([styles.searchForm, this.props.className])} />
  }
}

class SearchFormRow extends Row {
  static defaultProps = {
    gutter: 16
  }
}

class SearchFormCol extends Col {
  static defaultProps = {
    xs: 24, sm: 12, md: 12, lg: 8, xl: 8, xxl: 8
  }
}

class ActionsItem extends Component {
  render () {
    return (
      <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
        <Form.Item {...this.props} className={classnames(['search-form-actions-item-block', this.props.className])} />
      </Col>
    )
  }
}

export {
  SearchFormCol as Col,
  SearchFormRow as Row,
  ActionsItem
}
export default SearchForm
