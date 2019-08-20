import Moment from 'moment'

/**
 * moment->string 格式化form中的日期字段
 * @param moment
 * @param strFmt
 * @param defaultValue
 * @returns {*}
 */
export function fmtDate (moment, strFmt = 'YYYY-MM-DD HH:mm:ss', defaultValue) {
  if (moment === undefined || moment === null || moment === '') {
    return defaultValue
  }
  if (typeof moment === 'string' || typeof moment === 'number') {
    moment = new Moment(moment)
  }

  if (typeof moment.format === 'function') {
    return moment.format(strFmt)
  } else {
    throw new Error(`can not format the value${moment} by ${strFmt}`)
  }
}

/*
 *   功能:时间计算功能
 *   参数:interval,字符串表达式，表示要添加的时间间隔.
 *   参数:number,数值表达式，表示要添加的时间间隔的个数.
 *   参数:date,时间对象.
 *   返回:新的时间对象.
 *   var now = new Date();
 *   var newDate = DateAdd( "d", 5, now);
 *---------------   DateAdd(interval,number,date)   -----------------
 */
export function addDate (date, interval, number) {
  date = new Date(date) // 不影响传入产生
  switch (interval) {
    case 'Y': {
      date.setFullYear(date.getFullYear() + number)
      return date
    }
    case 'Q': {
      date.setMonth(date.getMonth() + number * 3)
      return date
    }
    case 'M': {
      date.setMonth(date.getMonth() + number)
      return date
    }
    case 'W': {
      date.setDate(date.getDate() + number * 7)
      return date
    }
    case 'd': {
      date.setDate(date.getDate() + number)
      return date
    }
    case 'h': {
      date.setHours(date.getHours() + number)
      return date
    }
    case 'm': {
      date.setMinutes(date.getMinutes() + number)
      return date
    }
    case 's': {
      date.setSeconds(date.getSeconds() + number)
      return date
    }
    default: {
      date.setDate(date.getDate() + number)
      return date
    }
  }
}

/**
 * 获取日期部分，时间部分为00:00:00
 * @param date
 */
export function resetTime (date) {
  if (date == null) {
    return null
  }
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 00:00:00`)
}
