import React, { Component } from 'react'
import _FooterToolbar from 'ant-design-pro/lib/FooterToolbar'
import 'ant-design-pro/lib/FooterToolbar/style'

export default class FooterToolbar extends Component {
  state = { width: '100%' }

  componentDidMount () {
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true })
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resizeFooterToolbar)
  }

  resizeFooterToolbar = () => {
    window.requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0]
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`
        const { width: stateWidth } = this.state
        if (stateWidth !== width) {
          this.setState({ width })
        }
      }
    })
  };

  render () {
    return (
      <_FooterToolbar style={{ width: this.state.width }} {...this.props} />
    )
  }
}
