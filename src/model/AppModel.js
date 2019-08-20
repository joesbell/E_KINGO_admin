import model from '@symph/joy/model'
import { routerRedux } from '@symph/joy/router'
import menusData from '../asset/menus'

const IndexMenuUrl = '/home/productManager'

@model()
export default class AppModel {
  namespace = 'app'

  initState = {
    menuCollapsed: false,
    menuRoot: null,
    indexMenu: null, // 首页菜单项
    allMenusMap: {},
    menuCurrentPath: [],
    menuOpenKeys: null
  }

  async initApp () {
    await Promise.all([
      this.fetchMenus()
    ])
  }

  async setMenuCollapsed ({ menuCollapsed }) {
    this.setState({
      menuCollapsed
    })
  }

  async fetchMenus () {
    // 菜单项 暂时不接入权限管理 2019-04-30 13:47:33
    // let apiUrl = `/system/userLogin`
    // if (env !== 'production') {
    //   apiUrl = `http://172.24.5.10:3000/mock/63/system/userLogin`
    // }
    // let menus
    // try {
    //   let { data: { resultData } } = await callApi(apiUrl, null, { method: 'POST' })
    //   menus = resultData
    // } catch (e) {
    //   // fixme 在poc环境，如果出错，不加载菜单项
    //   console.warn('加载菜单项失败', e)
    //   return
    // }

    let menus = menusData.resultData
    let allMenusMap = {}
    let menuRoot = null
    let indexMenu = null
    let currentMenu
    let menuCurrentPath = []
    let currentUrl = new URL(window.location.href)

    if (menus && menus.length > 0) {
      menus.forEach((item) => {
        item.children = []
        allMenusMap[item.code] = item
        let url = this.normalizeUrl(item.url)
        url = (url.startsWith('//') && 'http:' + url) ||
          url.replace(/^\//, 'http://xxx.jd.com/')
        const urlObj = new URL(url)
        if (currentUrl.pathname.toLowerCase().indexOf(urlObj.pathname.toLowerCase()) >= 0 &&
          ((currentMenu && ((item.url || '').length > (currentMenu.url || '').length)) || !currentMenu)) {
          currentMenu = item
        }
        if (item.url === IndexMenuUrl) {
          console.log(item.url, IndexMenuUrl)
          
          indexMenu = item
        }
      })
      menus.forEach(item => {
        if (!item.parent) {
          menuRoot = item
          return
        }
        allMenusMap[item.parent].children.push(item)
      })

      while (currentMenu) {
        menuCurrentPath.unshift(currentMenu)
        currentMenu = allMenusMap[currentMenu.parent]
      }
    }

    let { menuOpenKeys } = this.getState()
    if (!menuOpenKeys) {
      // 只第一次处理
      menuOpenKeys = menuCurrentPath.map(i => i.code)
    }
    this.setState({
      allMenusMap,
      menuRoot,
      indexMenu,
      menuCurrentPath,
      menuOpenKeys
    })
  }

  async setMenuOpenKeys ({ openKeys }) {
    this.setState({
      menuOpenKeys: openKeys
    })
  }

  async setCurrentMenuByPath (pathname) {
    let { allMenusMap } = this.getState()
    if (!allMenusMap) {
      return
    }
    let currentMenu
    let menuCurrentPath = []
    Object.keys(allMenusMap).forEach((menuKey) => {
      let item = allMenusMap[menuKey]
      let url = this.normalizeUrl(item.url)
      url = (url.startsWith('//') && 'http:' + url) ||
        url.replace(/^\//, 'http://xxx.jd.com/')
      const urlObj = new URL(url)
      if (pathname.toLowerCase().indexOf(urlObj.pathname.toLowerCase()) >= 0 &&
        (!currentMenu || ((item.url || '').length > (currentMenu.url || '').length))) {
        currentMenu = item
      }
    })

    while (currentMenu) {
      menuCurrentPath.unshift(currentMenu)
      currentMenu = allMenusMap[currentMenu.parent]
    }

    this.setState({
      menuCurrentPath
    })
  }

  async setCurrentMenu (menu) {
    let { allMenusMap, indexMenu } = this.getState()
    if (typeof menu === 'string') {
      menu = allMenusMap[menu]
    }
    if (!menu.parent) {
      // root 节点，跳转到主页
      menu = indexMenu
    } else if (!menu.url) {
      // do nothing， if url is empty
      return
    }
    let menuCurrentPath = []
    let tempMenu = menu
    let findDeeps = 0
    while (tempMenu && findDeeps < 10) {
      menuCurrentPath.unshift(tempMenu)
      tempMenu = allMenusMap[tempMenu.parent]
      findDeeps++
    }
    // 跳转处理
    let url = this.normalizeUrl(menu.url)
    let InternalPath = [new RegExp(`^/`)]
    if (/https?:\/\//.test(url)) {
      let { pathname, origin, hostname } = new URL(url)
      if (hostname === window.location.hostname && InternalPath.find(reg => reg.test(pathname))) {
        // 内部路径
        this.dispatch(routerRedux.push(url.replace(origin, '')))
      } else {
        // 外部链接
        window.location.href = url
      }
    } else {
      if (InternalPath.find(reg => reg.test(url))) {
        // 内部相对路径
        this.dispatch(routerRedux.push(url))
      } else {
        window.location.href = window.location.origin + url
      }
    }
    this.setState({
      menuCurrentPath
    })
  }

  getMenuIcon (menu) {
    if (!menu.icon) {
      return null
    }
    let icon = menu.icon
    let match = icon.match(/icon:\/\/antd\/([^/?&]+)/i)
    if (match) {
      return match[1]
    }
  }

  /**
   * 标准url，填充占位符的值，
   * @param url
   */
  normalizeUrl (url) {
    if (!url) {
      url = '/'
    }
    if (!url.startsWith('/') && !/http/i.test(url)) {
      //  platform/xxx 这种路径
      url = '/' + url
    }
    const { lsCode } = this.getState()
    url = url.replace('{lsCode}', lsCode)
    return url
  }
}
