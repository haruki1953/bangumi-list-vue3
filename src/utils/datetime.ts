import { formatTimeAgo } from '@vueuse/core'

// 将日期字符串转换为 Date 对象，如果解析失败，则返回 null
export function parseDate(dateString: string) {
  if (!dateString) return null
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? null : date
}

// 处理中文日期 "2024年4月1日" 解析为 JavaScript 的 Date 对象
export const parseChsDate = (dateString: string) => {
  const parsedStr = dateString.replace(/[年月日]/g, '/').slice(0, -1)
  return parseDate(parsedStr)
}

const messages = {
  justNow: '刚刚',
  past: (n: string | number) => `${n}前`,
  future: (n: string | number) => `${n}后`,
  month: (n: number, past?: boolean) =>
    n === 1 ? (past ? '上个月' : '下个月') : `${n}个月`,
  year: (n: number, past?: boolean) =>
    n === 1 ? (past ? '去年' : '明年') : `${n}年`,
  // day: (n: number, past?: boolean) =>
  //   n === 1 ? (past ? '昨天' : '明天') : `${n}天`,
  day: (n: number) => `${n}天`,
  week: (n: number, past?: boolean) =>
    n === 1 ? (past ? '上周' : '下周') : `${n}周`,
  hour: (n: number) => `${n}小时`,
  minute: (n: number) => `${n}分钟`,
  second: (n: number) => `${n}秒`,
  invalid: '无效时间'
}

export const formatTimeAgoChs = (dateString: string): string => {
  const date = new Date(dateString)
  return formatTimeAgo(date, { messages, max: 'day' })
}

export const isToday = (month: number, day: number): boolean => {
  const today = new Date()
  const currentMonth = today.getMonth() + 1 // 月份从 0 开始，所以需要加 1
  const currentDay = today.getDate()
  return currentMonth === month && currentDay === day
}
