// /**
//  * moment->string 格式化form中的日期字段
//  * @param moment
//  * @param strFmt
//  * @param defaultValue
//  * @returns {*}
//  */
// export function fmtDate (moment, strFmt = 'YYYY-MM-DD HH:mm:ss', defaultValue) {
//   if (moment === undefined || moment === null) {
//     return defaultValue
//   }
//   if (typeof moment.format === 'function') {
//     return moment.format(strFmt)
//   } else {
//     throw new Error(`can not format the value${moment} by ${strFmt}`)
//   }
// }

/**
 * 生成ant form验证的错误概要信息
 * @param errors validateFields、getFieldsValue得到的errors对
 * @returns {*}
 */
export function getErrorInfo (errors) {
  if (errors === undefined || errors === null || Object.keys(errors).length === 0) {
    return null
  }

  for (let i of Object.keys(errors)) {
    let field = errors[i]
    if (!field) {
      continue
    }
    if (Array.isArray(field)) {
      if (field && field.length > 0) {
        return field[0]
      } else {
        // continue
      }
    } else {
      let errs = field.errors
      if (errs && errs.length > 0) {
        return errs[0].message
      } else {
        // continue
      }
    }
  }
}

export function fillFieldValue (values, pattern, { ignoreEmptyValue: ignoreEmptyValue = true } = {}) {
  if (values === undefined || values === null) {
    return values
  }
  // pattern 为空时，不约束输入值
  if (pattern === undefined || pattern === null) {
    return values
  }
  let result = {}
  Object.keys(pattern).forEach(key => {
    let value = values[key]
    if (ignoreEmptyValue && (value === undefined || value === null)) {
      return
    }
    if (typeof pattern[key] === 'object' && !Array.isArray(pattern[key])) {
      result[key] = fillFieldValue(value, pattern[key], {})
    } else {
      result[key] = value
    }
  })
  return result
}
