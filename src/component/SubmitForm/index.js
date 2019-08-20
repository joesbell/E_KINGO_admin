import React, { Component } from 'react'
import { Col, Row } from 'antd'
import Form from 'antd/lib/form'
import styles from './index.less'
import classnames from 'classnames'

class SubmitForm extends Component {
  static defaultProps = {
    labelCol: {
      md: { span: 24 },
      lg: { span: 8 },
      xl: { span: 8 },
      xxl: { span: 8 }
    },
    wrapperCol: {
      md: { span: 24 },
      lg: { span: 10 },
      xl: { span: 8 },
      xxl: { span: 8 }
    }
  }

  render () {
    return <Form hideRequiredMark {...this.props} className={classnames([styles.SubmitForm, this.props.className])} />
  }
}

class SubmitFormRow extends Row {
  static defaultProps = {
    gutter: 16
  }
}

class SubmitFormCol extends Col {
  static defaultProps = {
    xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24
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
  SubmitFormCol as Col,
  SubmitFormRow as Row,
  ActionsItem
}
export default SubmitForm
