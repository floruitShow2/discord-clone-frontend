export function isArray(val: unknown): val is any[] {
  return Object.prototype.toString.call(val) === '[object Array]'
}
export function isObject(val: unknown): val is Record<string, any> {
  return Object.prototype.toString.call(val) === '[object Object]'
}
export function isString(val: unknown): val is string {
  return Object.prototype.toString.call(val) === '[object String]'
}
export function isUndefined(obj: any): obj is undefined {
  return obj === undefined
}
export function isFunction(obj: any): obj is (...args: any[]) => any {
  return typeof obj === 'function'
}

export const isSSR = (function () {
  try {
    return !(typeof window !== 'undefined' && document !== undefined)
  } catch (e) {
    return true
  }
})()
