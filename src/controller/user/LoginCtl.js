import React, { Component } from 'react'
import controller from '@symph/joy/controller'
import autowire from '@symph/joy/autowire'
import { message } from 'antd'
import Login from 'ant-design-pro/lib/Login'
import 'ant-design-pro/lib/Login/style'
import styles from './LoginCtl.less'
import UserLayout from './UserLayout'
import UserModel from '../../model/UserModel'

const { Tab, UserName, Password, Submit } = Login

@controller(({ user }) => ({
  token: user.token,
  userName: user.userName
}))
class LoginPage extends Component {
  // state={
  //   login: true,
  //   submitting: true
  // }
  componentDidMount () {
    if (window.sessionStorage.getItem('token')) {
      this.props.history.push('/home')
    }
  }
  @autowire()
  userModel: UserModel

  state = {
    login: true,
    submitting: false,
    type: 'account',
    autoLogin: true
  }

  onTabChange = type => {
    this.setState({ type })
  }

  // onGetCaptcha = () =>
  //   new Promise((resolve, reject) => {
  //     this.loginForm.validateFields(['mobile'], {}, (err, values) => {
  //       if (err) {
  //         reject(err)
  //       } else {
  //         const { dispatch } = this.props
  //         dispatch({
  //           type: 'login/getCaptcha',
  //           payload: values.mobile
  //         }).then(resolve).catch(reject)
  //       }
  //     })
  //   })

  handleSubmit = async (err, values) => {
    if (err) {
      return
    }
    try {
      this.setState({
        submitting: true
      })
      let userObj = {
        'loginName': values.loginName,
        'password': values.password
      }
      await this.userModel.login(userObj)
      await window.sessionStorage.setItem('userName', this.props.userName)
      await window.sessionStorage.setItem('token', this.props.token)
      await this.setState({
        submitting: false
      })
      await this.props.history.push('/home')
    } catch (e) {
      message.error(e.message || '出错了，请重试')
    }
  }

  // changeAutoLogin = e => {
  //   this.setState({
  //     autoLogin: e.target.checked
  //   })
  // }

  // renderMessage = content => (
  //   <Alert style={{ marginBottom: 24 }} message={content} type='error'
  //     showIcon />
  // )

  render () {
    // const { login, submitting } = this.props
    const { type, submitting } = this.state
    return (
      <UserLayout>
        <div className={styles.main}>
          <Login
            defaultActiveKey={type}
            onTabChange={this.onTabChange}
            onSubmit={this.handleSubmit}
            ref={form => {
              this.loginForm = form
            }}>
            <Tab key='account' tab={'账户密码登录'}>
              {/* {login.status === 'error' &&
              login.type === 'account' &&
              !submitting && '用户名或密码错误'} */}
              <UserName
                name='loginName'
                placeholder={`手机号`}
                rules={[
                  {
                    required: true,
                    message: '请输入用户名'
                  }, {
                    pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
                    message: '请输入正确手机号'

                  }
                ]}
              />
              <Password
                name='password'
                placeholder={`密码`}
                rules={[
                  {
                    required: true,
                    message: '请输入密码'
                  }
                ]}
                onPressEnter={e => {
                  e.preventDefault()
                  this.loginForm.validateFields(this.handleSubmit)
                }}
              />
            </Tab>
            {/* <div>
              <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
                <span>自动登录</span>
              </Checkbox>
              <a style={{ float: 'right' }} href=''>
                <span>忘记密码</span>
              </a>
            </div> */}
            <Submit loading={submitting}>
              <span>登录</span>
            </Submit>
            {/* <div className={styles.other}>
              <span>其他登录方式</span>
              <Icon type='weibo-circle' className={styles.icon}
                theme='outlined' />
              <a className={styles.register} to='/user/register'>
                <span>注册账户</span>
              </a>
            </div> */}
          </Login>
        </div>
      </UserLayout>
    )
  }
}

export default LoginPage
