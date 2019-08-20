import Decimal from 'decimal.js/decimal'

// const Decimal = require('decimal.js/decimal.mjs');

/**
 * 千分位格式化
 * @param num
 * @param toFixed 小数点后面位数
 * @param sign 是否包含正负符号
 * @returns {string}
 */
export function fmtThousands (num, toFixed = 2, sign = false, roundMode = Decimal.ROUND_DOWN) {
  if (num === undefined || num === null) {
    return '--'
  }
  num = new Decimal(num)
  if (toFixed > 0) {
    num = num.toFixed(toFixed, roundMode)
  } else {
    num = num.toString()
  }

  if (sign) {
    if (!num.startsWith('-') && !num.startsWith('+')) {
      num = '+ ' + num
    }
  }

  let dot = ''; let flag = ''
  if (num.startsWith('-') || num.startsWith('+')) {
    flag = num.slice(0, 1)
    num = num.slice(1).trim()
  }

  let indexOfDot = num.indexOf('.')
  if (indexOfDot > 0) {
    dot = num.substring(indexOfDot)
    num = num.substring(0, indexOfDot)
  }
  let result = ''
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result
    num = num.slice(0, num.length - 3)
  }

  result = flag + num + result + dot

  return result
}

/**
 * 格式化百分数
 * @param num  原始数值，比如： 0.0123 = 1.23%
 * @param toFixed
 * @param sign
 * @param roundMode
 * @returns {*}
 */
export function fmtPercent (num, toFixed = 2, sign = false, roundMode = Decimal.ROUND_DOWN) {
  if (num === undefined || num === null) {
    return '--'
  }

  num = new Decimal(num)
  num = new Decimal(100).mul(num)

  num = num.toFixed(toFixed, roundMode)
  if (sign) {
    if (!num.startsWith('-') && !num.startsWith('+')) {
      num = '+' + num
    }
  }

  return num
}
