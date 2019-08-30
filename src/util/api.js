/* global Request */
import querystring from 'query-string'
import fetch from '@symph/joy/fetch'
import getConfig from '@symph/joy/config'

const { publicRuntimeConfig: { apiPath } } = getConfig()

// 定义Response body中的字段
const RESULT_CODE = 'code'
const RESULT_MSG = 'msg'
// const RESULT_DATA = 'resultData'
const SUCCESS_CODE = 200

//= ===== 通用参数处理
/**
 * 通用请求参数
 */
export const commonParams = {}

export function setCommonParams (params) {
  Object.assign(commonParams, params)
}

/**
 * 通用请求header
 */
export const commonHeader = {
  'X-Requested-With': 'XMLHttpRequest'
}

export function setCommonHeader (params) {
  Object.assign(commonHeader, params)
}

export class ApiError {
  constructor (request, response, code, message) {
    this.request = request
    this.response = response
    this.code = code
    this.message = message
  }

  toString () {
    return '(' + this.code + ', ' + this.message + ')'
  }
}

/**
 * 调用接口,捕捉异常并返回异常。
 * @param url
 * @param method
 * @param params
 * @param responseBodyType
 * @returns {*}
 */
function _callApi (url, params, { method = 'POST', responseBodyType = 'json' } = {}) {
  let body = null
  if (method === 'POST' || method === 'PUT') {
    body = JSON.stringify(params)
  } else if (method === 'GET' || method === 'delete') {
    // params = Object.assign({ _h: new Date().getTime() }, params) // 清理缓存
    url += (url.indexOf('?') > 0 ? '' : '?') + querystring.stringify(params)
  }

  let request = null
  let response = null
  let responseBody = null

  let headers = {
    'Accept': 'application/json; charset=utf-8',
    'Content-Type': 'application/json; charset=utf-8',
    'Node-Referrer': `${window.location.origin}`,
    ...commonHeader
  }

  const requestOptions = {
    method,
    headers,
    body,
    mode: 'cors',
    credentials: 'include'
  }
  if (/\/\/mock.jdfmgt.com/.test(url)) {
    // mock平台不支持header和credentials传递
    requestOptions.headers = {}
    requestOptions.credentials = 'omit'
  }
  request = new Request(url, requestOptions)

  let returnPromise
  // 只有在app中运行的时候，才会走app中的代理
  returnPromise = fetch(url, requestOptions)
  returnPromise = Promise.race([returnPromise, new Promise((resolve, reject) => {
    setTimeout(() => reject(new ApiError(request, null, -1, '连接超时，请重试')), 15000)
  })])

  returnPromise = returnPromise.then((resp) => {
    response = resp
    let oauthstatus = resp.headers.get('oauthstatus')
    if (oauthstatus) {
      throw new ApiError(request, response, `oauth-${oauthstatus}`, oauthstatus === 302 ? '未登录' : '无权限')
    }

    // 输出日志,在生产环境屏蔽掉
    // if (process.env.NODE_ENV === 'development') {
    //   resp.clone().text().then((text) => {
    //     console.log("response:" + url + ', status:' + resp.status + ', data:' + text);
    //   });
    // }
    return resp
  })

  returnPromise = returnPromise.catch((e) => {
    if (e instanceof ApiError) {
      throw e
    }
    // 没有连接到服务器。
    e = new ApiError(
      request,
      response,
      -2,
      '无网络连接，请检查网络！'
    )
    throw e
  })

  if (responseBodyType) {
    if (responseBodyType === 'json') {
      returnPromise = returnPromise.then((resp) => {
        return resp.json()
      }).then((jsonBody) => {
        responseBody = jsonBody
      })
    } else if (responseBodyType === 'text') {
      returnPromise = returnPromise.then((resp) => {
        return resp.text()
      }).then((textBody) => {
        responseBody = textBody
      })
    }
  }

  returnPromise = returnPromise.then(() => {
    return { request, response, data: responseBody }
  })

  return returnPromise
}

/**
 * 调用接口,捕捉异常并返回异常。
 * @param url
 * @param params
 * @param options {method="POST", responseBodyType = 'json'}
 * @returns {Promise.<TResult>} 正常响应返回{requst, respone,data}对象，出现异常返回error对象{request,response, code, message}
 */
export function callApi (url, params, { method = 'POST', responseBodyType = 'json' } = {}) {
  if (!/https?:\/\//i.test(url)) {
    url = apiPath + url
  }
  let returnRequest, returnResponse
  if (method === 'POST') {
    // 单点登录的特殊处理，只有POST请求，才加head部分。
    if (!(params instanceof window.FormData)) {
      // 加入通用参数
      // params = {
      //   head: commonParams || {},
      //   data: params || {}
      // }
    }
  }

  let returnPromise = null

  returnPromise = _callApi(url, params, {
    method,
    responseBodyType
  })

  returnPromise = returnPromise.then(({ request, response, data }) => {
    returnRequest = request
    returnResponse = response

    // 解析服务端逻辑错误
    if (responseBodyType === 'json') {
      if (!data || data[RESULT_CODE] !== SUCCESS_CODE) {
        let errCode = (data && data[RESULT_CODE]) || -1
        let errMsg = (data && data[RESULT_MSG]) || null
        if (data && data.resultCtrl) {
          if (data.resultCtrl.type === 'toast') {
            errMsg = data.resultCtrl.toastValue
          } else if (data.resultCtrl.type === 'dialog') {
            errMsg = data.resultCtrl.dialogContent
          }
        }

        throw new ApiError(
          request,
          response,
          errCode,
          errMsg)
      }
    }

    return {
      request,
      response,
      data
    }
  }).catch((error) => {
    // 将所有错误统一处理
    console.log('call api error:' + error)
    if (!(error instanceof ApiError)) {
      error = new ApiError(
        returnRequest,
        returnResponse,
        -1,
        null
      )
    }

    notifyErrorHandlers(error)
    throw error
  })

  return returnPromise
}

//= === 异常定义

class ErrorHandler {
  /**
   *
   * @param errorCode 业务错误代码
   * @param httpStatus http 状态吗，优先匹配errorCode
   * @param handleFunc function(ApiError)； 返回true会阻止error的传播
   */
  constructor (errorCode, httpStatus, handleFunc) {
    this.errorCode = errorCode
    this.httpStatus = httpStatus
    this.handleFunc = handleFunc
  }
}

export const _errorHandlers = []

export function registErrorHandler (errorCode, httpStatus, handleFunc) {
  if ((errorCode === undefined || errorCode === null) && (httpStatus === undefined || httpStatus === null)) {
    throw new Error('oen of errorCode and httpStatus can not be emtpy')
  }
  let handler = new ErrorHandler(errorCode, httpStatus, handleFunc)
  _errorHandlers.push(handler)
}

export function notifyErrorHandlers (error) {
  if (!error) {
    return
  }
  for (let i in _errorHandlers) {
    const handler = _errorHandlers[i]
    if (handler.errorCode) {
      if ((typeof (handler.errorCode.test) === 'function')) {
        if (!handler.errorCode.test(String(error.code))) {
          continue
        }
      } else {
        if (handler.errorCode !== error.code) {
          continue
        }
      }
    }

    if (handler.httpStatus) {
      if (handler.httpStatus !== (error.response && error.response.status)) {
        continue
      }
    }

    if (handler.handleFunc && handler.handleFunc(error)) {
      return true
    }
  }

  return false
}
