import React, { Component } from 'react'
import { Link } from '@symph/joy/router'
// import { Icon } from 'antd'
// import GlobalFooter from 'ant-design-pro/lib/GlobalFooter'
import styles from './UserLayout.less'
import logo from './assets/logo.png'

// const links = [
//   {
//     key: 'help',
//     title: '帮助',
//     href: ''
//   },
//   {
//     key: 'privacy',
//     title: '隐私',
//     href: ''
//   },
//   {
//     key: 'terms',
//     title: '团队',
//     href: ''
//   }
// ]

// const copyright = (
//   <Fragment>
//     Copyright <Icon type='copyright' /> 2019  京东数科
//   </Fragment>
// )

export default class UserLayout extends Component {
  componentDidMount () {
  }

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
