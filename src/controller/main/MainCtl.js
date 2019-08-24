import React from 'react'
import styles from './MainCtl.less'
import { Icon, Layout, Menu, message, Modal, Spin } from 'antd'
import { Redirect, Route, Switch } from '@symph/joy/router'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
// import dynamic from '@symph/joy/dynamic'
import AppModel from '../../model/AppModel'
import UserModel from '../../model/UserModel'
import { registErrorHandler, setCommonHeader } from '../../util/api'

// import querystring from 'query-string'
// import DynamicLoading from '../../component/DynamicLoading'

// const dynamicCtl = function (loader) {
//   return dynamic({
//     loader,
//     loading: DynamicLoading
//   })
// }

const { SubMenu } = Menu
const { Header, Content, Sider, Footer } = Layout

@controller(({ user, app }) => ({
  menuRoot: app.menuRoot,
  menuCurrentPath: app.menuCurrentPath,
  menuOpenKeys: app.menuOpenKeys,
  userName: user.userName ? user.userName : window.sessionStorage.getItem('userName'),
  collapsed: app.menuCollapsed
}))
export default class MainCtl extends React.Component {
  constructor (...args) {
    super(...args)

    // 注册未登录异常监听器
    registErrorHandler('401', 200, () => {
      this.props.history.push('/')
    })
  }

  @autowire()
  userModel: UserModel

  @autowire()
  appModel: AppModel

  state = {
    loading: true
  }

  async componentPrepare () {
    try {
      // let curUrl = querystring.parseUrl(window.location.href)
      // await this.userModel.fetchCurrentUser({ sst: curUrl.query.sst })
      if (window.sessionStorage.getItem('token')) {
        setCommonHeader({ 'Authorization': window.sessionStorage.getItem('token') })
      } else {
        this.props.history.push('/')
      }

      await this.appModel.initApp()
      this.setState({
        loading: false
      })
    } catch (e) {
      message.error(e.message || '出错了，请重试', 0)
    }
  }

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px'
      }
    }
    return null
  }

  onLogout = () => {
    Modal.confirm({
      title: '提示',
      content: '是否确认退出登录？',
      okText: '退出登录',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        await this.userModel.logout()
        await window.sessionStorage.removeItem('token')
        await window.sessionStorage.removeItem('userName')
        await this.props.history.push('/')
      }
    })
  }

  onMenuCollapse = () => {
    const { collapsed } = this.props
    this.appModel.setMenuCollapsed({ menuCollapsed: !collapsed })
  }

  onMenuSelect = ({ selectedKeys }) => {
    if (!selectedKeys || selectedKeys.left === 0) {
      return
    }
    this.appModel.setCurrentMenu(selectedKeys[0])
  }

  onMenuOpenChange = (openKeys) => {
    this.appModel.setMenuOpenKeys({ openKeys })
  }

  renderMenuChildren = (parent) => {
    if (!parent || !parent.children || !parent.children.length) {
      return null
    }
    return parent.children.map((menu) => {
      let icon = this.appModel.getMenuIcon(menu)
      if (menu.children.length === 0) {
        return (<Menu.Item key={menu.code}>
          {icon ? <Icon type={icon} /> : null}
          <span>{menu.name}</span>
        </Menu.Item>)
      } else {
        return (
          <SubMenu key={menu.code} title={<React.Fragment>
            {icon ? <Icon type={icon} /> : null}
            <span>{menu.name}</span></React.Fragment>}>
            {this.renderMenuChildren(menu)}
          </SubMenu>
        )
      }
    })
  }

  render () {
    let { userName, collapsed, menuRoot, menuCurrentPath } = this.props
    let { loading } = this.state
    let currentMenu = menuCurrentPath && menuCurrentPath.length > 0 ? menuCurrentPath[menuCurrentPath.length - 1] : {}
    if (loading) {
      return <Spin spinning={loading} style={{ width: '100%' }} />
    }
    return (
      <Spin spinning={loading}>
        <Layout className={styles.root}>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            collapsedWidth={120}
            width={256}
            className={styles.sider}
          >
            <div className={styles.logo}>
              {/* <img className={styles.icon} alt={'logo'}
                src={require('./logo.png')} /> */}
              {collapsed
                ? null
                : <span className={styles.title}>后台管理系统</span>
              }
            </div>
            <Menu theme='dark' mode='inline'
              onSelect={this.onMenuSelect}
              selectedKeys={[currentMenu.code]}>
              {this.renderMenuChildren(menuRoot)}
            </Menu>
          </Sider>
          <Layout
            style={{
              ...this.getLayoutStyle(),
              minHeight: '100vh'
            }}>
            <Header className={styles.header}>
              <div className={styles.left}>
                <Icon
                  className={styles.trigger}
                  type={collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.onMenuCollapse}
                />
              </div>
              <div className={styles.right}>
                <span>您好，{userName}</span>
                <span className={styles.arrowRight} onClick={this.onLogout}>
                  <Icon type={'right'} title={'退出登录'} />
                </span>
              </div>
            </Header>
            <Content className={styles.content}>
              <Switch>
                <Route exact path='/home/productManager' component={require('../product_manager/ProductManCtl').default} />
                <Route exact path='/home/productManager/productForm' component={require('../product_manager/product_main/ProductManFormCtl').default} />

                {/* <Route exact path='/home/myTask/:tab?' component={require('../my_task/MyTaskCtl').default} />
                <Route exact path='/home/creditGrantingAudit/:flowInstanceId/:tab' component={require('../credit_granting_audit/CreditGrantingAuditCtl').default} /> */}
                <Route exact path='/home/orderManager' component={require('../order_manager/OrderManCtl').default} />
                <Route exact path='/home/orderManager/orderProDetail' component={require('../order_manager/order_main/OrderProDetailCtl').default} />
                <Route exact path='/home/orderManager/orderDetail' component={require('../order_manager/order_main/OrderDetailCtl').default} />

                <Route exact path='/home/reportManager/:tab?' component={require('../report_manager/ReportManCtl').default} />

                <Route exact path='/home/supplierManager' component={require('../supplier_manager/SupplierManCtl').default} />
                <Route exact path='/home/supplierManager/supplierForm' component={require('../supplier_manager/supplier_main/SupplierFormCrl').default} />

                <Route exact path='/home/staffManager' component={require('../staff_manager/StaffManCtl').default} />
                {/* <Route exact path='/home/systemManager' component={require('../system_manager/ReviewCtl').default} /> */}

                {/* <Route exact path='/products' component={require('../product/ProductListCtl').default} />
                <Route exact path='/products/add' component={dynamicCtl(() => import('../product/AddProductCtl'))} />
                <Route exact path='/products/:id/edit' component={dynamicCtl(() => import('../product/EditProductCtl'))} /> */}
                <Route path={'/home'} children={(match) => {
                  this.appModel.setCurrentMenuByPath('/home/productManager')
                  return <Redirect form='/home' to={'/home/productManager'} />
                }} />
              </Switch>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              ©2019 东创建国
            </Footer>
          </Layout>
        </Layout>
      </Spin>
    )
  }
}
