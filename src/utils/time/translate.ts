import dayjs from 'dayjs'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT = 'YYYY-MM-DD '

/**
 * @description 将时间转换为 年月日 时分秒 的格式
 * @param date
 * @param format
 * @returns
 */
export function translateToDateTime(
  date: dayjs.ConfigType = undefined,
  format = DATE_TIME_FORMAT
): string {
  return dayjs(date).format(format)
}

export function translateToDate(date: dayjs.ConfigType = undefined, format = DATE_FORMAT): string {
  return dayjs(date).format(format)
}

export const dateUtil = dayjs

export function translateToTimeAgo(time: Date | string | number) {
  const timestamp = new Date(time).getTime()
  const current = new Date().getTime()
  const delta = current - timestamp
  if (delta < 0) return '时间在当前时间以后'
  const seconds = delta / 1000
  const minutes = seconds / 60
  const hours = minutes / 60
  const days = hours / 24
  const weeks = days / 7
  const months = days / 30
  if (months > 1) {
    return `${Math.floor(months)}月前`
  }
  if (weeks > 1) {
    return `${Math.floor(weeks)}周前`
  }
  if (days > 1) {
    return `${Math.floor(days)}天前`
  }
  if (hours > 1) {
    return `${Math.floor(hours)}小时前`
  }
  if (minutes > 1) {
    return `${Math.floor(minutes)}分钟前`
  }
  return '刚刚'
}

function padStart(value: string | number, length: number, padString: string) {
  value = value.toString()
  while (value.length < length) {
    value = padString + value
  }
  return value
}
export function translateSecondsToTimeCount(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${padStart(minutes, 2, '0')}:${padStart(secs, 2, '0')}`
  } else {
    return `${padStart(minutes, 2, '0')}:${padStart(secs, 2, '0')}`
  }
}
