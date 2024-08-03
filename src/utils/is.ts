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

export async function isClipboardSupported() {
  const results = {
    apiExists: false,
    writePermission: false,
    readPermission: false,
    writeWorks: false,
    readWorks: false
  }

  // 检查 API 是否存在
  if (navigator.clipboard) {
    results.apiExists = true

    // 检查写入权限
    try {
      const writePermission = await navigator.permissions.query({
        name: 'clipboard-write' as PermissionName
      })
      results.writePermission = writePermission.state === 'granted'
    } catch (error) {
      console.warn('无法查询剪贴板写入权限:', error)
    }

    // 检查读取权限
    try {
      const readPermission = await navigator.permissions.query({
        name: 'clipboard-read' as PermissionName
      })
      results.readPermission = readPermission.state === 'granted'
    } catch (error) {
      console.warn('无法查询剪贴板读取权限:', error)
    }

    // 尝试写入剪贴板
    try {
      await navigator.clipboard.writeText('测试文本')
      results.writeWorks = true
    } catch (error) {
      console.warn('剪贴板写入测试失败:', error)
    }

    // 尝试读取剪贴板
    try {
      await navigator.clipboard.readText()
      results.readWorks = true
    } catch (error) {
      console.warn('剪贴板读取测试失败:', error)
    }
  }

  return results
}

export const isSSR = (function () {
  try {
    return !(typeof window !== 'undefined' && document !== undefined)
  } catch (e) {
    return true
  }
})()
