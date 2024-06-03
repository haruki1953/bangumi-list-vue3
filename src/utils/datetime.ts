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
