export function parseDataString(dataString: string): Coze.MessagwEntity | null {
  if (dataString.indexOf('data:') !== 0) return null
  // 1. 去除开头的 "data:" 和结尾的换行符
  const trimmedString = dataString.replace(/^data:/, '').trim()

  // 2. 去除字符串中的转义字符 (主要是处理双引号)
  // const unescapedString = trimmedString.replace(/\\"/g, '"').trim()

  // 3. 解析 JSON 字符串为对象
  try {
    // console.log('正常解析', JSON.parse(trimmedString).content)
    return JSON.parse(trimmedString)
  } catch (error) {
    console.error('Error parsing JSON:', error)
    console.log(trimmedString)
    return null
  }
}
