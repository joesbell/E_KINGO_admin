// server.js
const express = require('express')
const joy = require('@symph/joy')
const proxy = require('@symph/joy/proxy-api-middleware')
// const logger = require('./mylogger').Logger
const logger = console
const dev = process.env.NODE_ENV === 'development'
const app = joy({ dev, dir: '.' })
const joyConfig = require('@symph/joy/config').default
const port = parseInt(process.env.PORT, 10) || joyConfig().serverRuntimeConfig.port || 8888
const handle = app.getRequestHandler()

const server = express()
const preapredApp = app.prepare()

server.get('/api/user/ticket/register', (req, res) => {
  preapredApp.then(() => {
    const ticket = req.param('ticket')
    const remember = req.param('remember') || ''
    if (!ticket) {
      res.status(400).send('ticket is required')
      return res.end()
    }
    res.cookie('ticket_megrez', ticket)
    res.cookie('remember_megrez', remember)
    res.status(200).send('success')
    res.end()
  })
})

server.use(proxy.createProxyApiMiddleware())

server.get('*', (req, res) => {
  preapredApp.then(() => {
    return handle(req, res)
  })
})

const startServer = function () {
  server.listen(port, (err) => {
    if (err) {
      logger.error(err)
      throw err
    }
    logger.info('Listening on ' + port)
    logger.info(`current env is [${process.env.NODE_ENV}]`)
  })
}

module.exports.start = startServer

// 直接运行当前js来运行server
if (!module.parent) {
  startServer()
}
