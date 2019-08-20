import React, { Component } from 'react'
import { Button, Divider, PageHeader as AntdPageHeader, Tabs } from 'antd'
import classNames from 'classnames'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
import AppModel from '../../model/AppModel'
import styles from './index.less'

@controller((store) => {
  return {
    menuCurrentPath: store.app.menuCurrentPath
  }
})
export class PageHeader extends Component {
  @autowire()
  appModel: AppModel

  onClickBreadcrumb = (menu) => {
    this.appModel.setCurrentMenu(menu)
  }

  render () {
    const { menuCurrentPath, tabList, onTabChange, tabActiveKey, title, backIcon = 'arrow-left', onBack, ...retainProps } = this.props
    const routes = (menuCurrentPath || []).map((item) => {
      return {
        ...item,
        children: null,
        breadcrumbName: !item.parent ? '首页' : item.name
      }
    })
    const footer = (
      <Tabs activeKey={tabActiveKey} onChange={onTabChange}>
        {(tabList || []).map((tab) => {
          return (<Tabs.TabPane tab={tab.tab} key={tab.key} />)
        })}
      </Tabs>
    )
    let titleView = title
    if (onBack) {
      titleView = <div><Button className={styles.btnBack} shape='circle' icon={backIcon} onClick={onBack} /><Divider type={'vertical'} />{title}</div>
    }

    return (
      <AntdPageHeader
        footer={footer}
        title={titleView}
        breadcrumb={{
          routes,
          itemRender: (route, params, routes, paths) => {
            const last = routes.indexOf(route) === routes.length - 1
            return last || !route.url
              ? (<span key={route.code}>{route.breadcrumbName}</span>)
              : (<a key={route.code} onClick={this.onClickBreadcrumb.bind(this, route)}>{route.breadcrumbName}</a>)
          } }}
        {...retainProps} className={classNames(this.props.className)} />
    )
  }
}

export default PageHeader
