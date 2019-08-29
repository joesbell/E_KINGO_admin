import React, { Component } from 'react'
import { Link } from '@symph/joy/router'
// import { Icon } from 'antd'
// import GlobalFooter from 'ant-design-pro/lib/GlobalFooter'
import styles from './UserLayout.less'
import logo from './assets/logo.png'
export default class UserLayout extends Component {
  render () {
    const {
      children
    } = this.props
    return (
      <div >
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to='/'>
                  <img alt='logo' className={styles.logo} src={logo} />
                </Link>
              </div>
              <div className={styles.desc}>后台管理系统 2019</div>
            </div>
            {children}
          </div>
          {/* <GlobalFooter links={links} copyright={copyright} /> */}
        </div>
      </div>
    )
  }
}
