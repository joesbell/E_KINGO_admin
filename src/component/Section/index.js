import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'
import classnames from 'classnames'

export default class SearchForm extends Component {
  static propTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool
  }
  render () {
    let { title, children, ...retainProps } = this.props
    return <div {...retainProps} className={classnames([styles.section, this.props.className])} >
      <div className={styles.title}>{title}</div>
      <div className={styles.children}>{children}</div>
    </div>
  }
}
