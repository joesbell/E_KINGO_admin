import React, { Component } from 'react'
import { Col, Row } from 'antd'
import Form from 'antd/lib/form'
import styles from './index.less'
import classnames from 'classnames'

class SearchForm extends Component {
  static defaultProps = {
    labelCol: {
      md: { span: 24 },
      lg: { span: 0 }
    },
    wrapperCol: {
      md: { span: 24 },
      lg: { span: 24 }
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
    xs: 24, sm: 24, md: 24, lg: 6, xl: 6, xxl: 6
  }
}

class ActionsItem extends Component {
  render () {
    return (
      <Col xs={24} sm={24} md={24} lg={18} xl={18} xxl={18}>
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
