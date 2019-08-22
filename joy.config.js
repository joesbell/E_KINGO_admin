const NODE_ENV = process.env.NODE_ENV || 'development'
process.env.NODE_ENV = NODE_ENV !== 'development' ? 'production' : 'development'

const withCss = require('@symph/joy-css')
const withLess = require('@symph/joy-less')
const withImage = require('@symph/joy-image')
const path = require('path')
const resolve = require('resolve')

const lessLoaderOptions = {
  javascriptEnabled: true,
  modifyVars: {
    'menu-bg': '#f9fafc'
  }
}
// 根据环境设置变量
let EnvConfig, ServerConfig

if (NODE_ENV === 'debug') {
  EnvConfig = {
    assetPrefix: '/',
    apiPath: 'http://10.9.10.9:8080/manage'
  }
} else if (NODE_ENV === 'beta') {
  EnvConfig = {
    assetPrefix: '/',
    apiPath: 'http://10.222.10.71:8889'
  }
  ServerConfig = {
    port: 8883
  }
} else if (NODE_ENV === 'production') {
  EnvConfig = {
    assetPrefix: '/',
    apiPath: 'http://192.144.250.93:8002/manage'
  }
  ServerConfig = {
    port: 3000
  }
} else {
  EnvConfig = {
    assetPrefix: '/',
    // apiPath: 'http://172.24.5.10:3000/mock/78'
    // apiPath: 'http://10.222.10.63:8086/manage'
    apiPath: 'http://118.24.50.239:8181'

  }
}

module.exports = {
  distDir: `.joy/${NODE_ENV}`,
  serverRender: false,
  publicRuntimeConfig: Object.assign({ env: NODE_ENV, routePrefix: '' }, EnvConfig),
  serverRuntimeConfig: Object.assign({ port: 3000 }, ServerConfig),
  plugins: [
    // 处理antd-mobile中的样式
    withCss({
      cssModules: false,
      ruleOptions: {
        include: [
          path.resolve(__dirname, './node_modules/')
        ]
      }
    }),
    withLess({
      cssModules: false,
      ruleOptions: {
        include: [
          path.resolve(__dirname, './node_modules/')
        ]
      },
      lessLoaderOptions
    }),
    // 处理应用内组件的less样式
    withLess({
      cssModules: true,
      ruleOptions: {
        exclude: [
          path.resolve(__dirname, './node_modules/')
        ]
      },
      lessLoaderOptions
    }),
    withImage({})
  ],
  webpack: (webpackConfig, { dir, isServer }) => {
    // 由于antd-mobile不进行编译的话，无法进行服务端渲染，所以这里需要特殊处理下
    // 如果配置 serverRender: false 关闭服务渲染的话，可以不需要这部分
    if (!isServer) {
      return webpackConfig
    }

    const origin = webpackConfig.externals[0]

    webpackConfig.externals.splice(0, 1, (context, request, callback) => {
      resolve(request, { basedir: dir, preserveSymlinks: true }, (err, res) => {
        if (err) {
          return callback()
        }

        if (res.match(/node_modules[/\\]normalize\.css/) ||
          res.match(/node_modules[/\\]antd/) ||
          res.match(/node_modules[/\\]ant-design/)) {
          return callback()
        }

        if (origin) {
          origin(context, request, callback)
        } else {
          callback()
        }
      })
    })

    return webpackConfig
  }
}
