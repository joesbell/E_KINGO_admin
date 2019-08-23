class constUtils {
  static toArray (enumType) {
    let a = []
    for (let p in enumType) {
      if (enumType.hasOwnProperty(p)) {
        a.push(enumType[p])
      }
    }
    return a
  }

  static getItem (enumType, value) {
    for (let p in enumType) {
      if (enumType.hasOwnProperty(p) && value === enumType[p].value) {
        return enumType[p]
      }
    }
    return null
  }

  static getItems (enumType) {
    let items = []
    for (let p in enumType) {
      if (enumType.hasOwnProperty(p) && typeof enumType[p] !== 'function') {
        items.push(enumType[p])
      }
    }
    return items
  }

  static getItemName (enumType, value) {
    if (value === null) {
      return null
    }
    for (let p in enumType) {
      if (enumType.hasOwnProperty(p) && value === enumType[p].value) {
        return enumType[p].name
      }
    }
    return null
  }
}

/**
 * 商品状态
 */
export const proStatus = {
  0: { value: 0, name: '下线' },
  1: { value: 1, name: '上线' }
}

export default constUtils
export { constUtils }
