
import _isPlainObject from 'is-plain-object'

export const isPlainObject = _isPlainObject
export const isArray = Array.isArray.bind(Array)
export const isFunction = o => typeof o === 'function'
export const returnSelf = m => m
export const noop = () => {}

const hasOwn = Object.prototype.hasOwnProperty

function is (x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  } else {
    return x !== y && x !== y
  }
}

/**
 *
 * @param objA
 * @param objB
 * @param exclude  这些属性，不参与参与比较
 * @returns {boolean}
 */
export function isShallowEqual (objA, objB, { exclude = [] } = {}) {
  if (is(objA, objB)) return true

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object.keys(objA).filter(i => !exclude.includes(i))
  const keysB = Object.keys(objB).filter(i => !exclude.includes(i))
  if (keysA.length !== keysB.length) return false

  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false
    }
  }

  return true
}
