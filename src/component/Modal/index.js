import React, { Component } from 'react'
import { Modal, Spin } from 'antd'
import styles from './index.less'
import PropTypes from 'prop-types'
import classnames from 'classnames'

class ModalPanel extends Component {
  static propTypes = {
    loading: PropTypes.bool
  }

  static defaultProps = {
    loading: false
  }
  render () {
    return <Modal {...this.props} className={classnames([styles.modalPanel, this.props.className])} >
      <Spin spinning={!!this.props.loading}>{this.props.children}</Spin>
    </Modal>
  }
}
Modal.ModalPanel = ModalPanel

class ModalEdit extends Component {
  render () {
    return (
      <Modal
        width={520}
        maskClosable={false}
        footer={[]}
        {...this.props}
        className={classnames([styles.modalPanel, this.props.className])}
      >
        <Spin spinning={!!this.props.loading}>{this.props.children}</Spin>
      </Modal>
    )
  }
}
Modal.ModalEdit = ModalEdit

export default Modal
