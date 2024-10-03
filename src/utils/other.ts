import { useRouter } from 'vue-router'

export const sakiGoBack = (router: ReturnType<typeof useRouter>) => {
  if (window.history.length > 2) {
    router.back()
  } else {
    // 如果没有历史记录，则导航到首页
    router.push({ name: 'home' })
  }
}

// 打开链接
export const openLink = (url: string) => {
  window.open(url, '_blank')
}

// 生成随机密钥
export const generateRandomKey = (length: number = 16) => {
  const array = new Uint8Array(length)
  window.crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
}
// 生成随机类名
export const generateRandomClassName = (length?: number) => {
  return generateRandomKey(length).replace(/[^a-zA-Z]/g, '') // 只保留字母
}

export const getScrollbarWidth = () => {
  // 创建一个带有滚动条的隐藏元素
  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll' // 强制显示滚动条
  document.body.appendChild(outer)

  // 创建一个内部元素
  const inner = document.createElement('div')
  outer.appendChild(inner)

  // 计算滚动条的宽度
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth

  // 移除临时元素
  outer.parentNode?.removeChild(outer)

  return scrollbarWidth
}

export const arraysEqual = (arr1: number[], arr2: number[]): boolean => {
  if (arr1.length !== arr2.length) return false
  const sortedArr1 = [...arr1].sort((a, b) => a - b)
  const sortedArr2 = [...arr2].sort((a, b) => a - b)
  return sortedArr1.every((value, index) => value === sortedArr2[index])
}
