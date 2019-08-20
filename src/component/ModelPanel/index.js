import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Spin } from 'antd'
import styles from './index.less'
import classnames from 'classnames'

export default class _Modal extends Component {
    static propTypes = {
      loading: PropTypes.bool
    }

    static defaultProps = {
      loading: false
    }
    render () {
      return <Modal {...this.props} className={classnames([styles.modal, this.props.className])} >
        <Spin spinning={this.props.loading}>{this.props.children}</Spin>
      </Modal>
    }
}
