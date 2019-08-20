import './themes.less'
import React from 'react'
import './index.less'
import dynamic from '@symph/joy/dynamic'
import { Route, Switch } from '@symph/joy/router'
import MainCtl from './controller/main/MainCtl'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'

const LoginCtl = dynamic({
  loader: () => import('./controller/user/LoginCtl')
})

export default class Index extends React.Component {
  render () {
    return (
      <ConfigProvider locale={zhCN}>
        <Switch>
          <Route component={LoginCtl} path={'/'} exact />
          <Route component={MainCtl} path={'/home'} />
        </Switch>
      </ConfigProvider>
    )
  }
}
