import { decrypto, encrypto } from '@/utils/crypto'

export interface StorageData<T> {
  value: T
  expire: number | null
}

type StorageKey = `--discord-${string}-record-key`

export interface UseStorageEntity {
  genKey: (id: string) => StorageKey
  get: <T>(key: StorageKey) => T | null
  set: <T>(key: StorageKey, val: T, expire?: number) => void
  remove: (key: StorageKey) => void
  clear: () => void
}

export function useStorage(): UseStorageEntity {
  /** 默认缓存期限为7天 */
  const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7

  function genKey(id: string): StorageKey {
    return `--discord-${id}-record-key`
  }

  function remove(key: StorageKey) {
    localStorage.removeItem(key)
  }
  function clear() {
    localStorage.clear()
  }

  function set<T>(key: StorageKey, val: T, expire: number = DEFAULT_CACHE_TIME) {
    const storageData: StorageData<T> = {
      value: val,
      expire: expire ? new Date().getTime() + expire * 1000 : null
    }

    const json = encrypto(storageData)
    localStorage.setItem(key, json)
  }

  function get<T>(key: StorageKey): T | null {
    const json = localStorage.getItem(key)
    if (!json) return null

    let storageData: StorageData<T> | null = null

    try {
      storageData = decrypto(json)
      if (!storageData) return null

      const { value, expire } = storageData

      if (expire === null || expire >= Date.now()) {
        return value
      }

      remove(key)
      return null
    } catch (err) {
      return null
    }
  }

  return { genKey, get, set, remove, clear }
}
