import { strFromU8, strToU8, unzlibSync, zlibSync } from 'fflate'

export function compress(data: string): string {
  const buffer = strToU8(data)
  const zipped = zlibSync(buffer, { level: 9 })
  const str = strFromU8(zipped, true)
  // 二进制转 ASCII 码
  return btoa(str)
}

export function uncompress(base64: string): string {
  // ASCII 码转二进制
  const binary = atob(base64)

  const buffer = strToU8(binary, true)
  const unzipped = unzlibSync(buffer)
  return strFromU8(unzipped)
}
