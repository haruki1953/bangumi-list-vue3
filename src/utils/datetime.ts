// 将日期字符串转换为 Date 对象，如果解析失败，则返回 null
export function parseDate(dateString: string) {
  if (!dateString) return null
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? null : date
}
