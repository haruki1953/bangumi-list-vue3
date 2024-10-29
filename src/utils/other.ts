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

// 辅助函数：从数组中随机抽取count个
export const getRandomElements = (arr: string[], count: number) => {
  // 如果 count 大于数组长度，返回打乱后的整个数组
  if (count >= arr.length) {
    return arr.sort(() => Math.random() - 0.5)
  }
  // 复制数组，以免修改原数组
  const shuffled = arr.slice()
  // 使用Fisher-Yates算法随机打乱数组
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    // 交换元素
    const temp = shuffled[i]
    shuffled[i] = shuffled[j]
    shuffled[j] = temp
  }
  // 返回前count个元素
  return shuffled.slice(0, count)
}

// 从数组中随机抽取 count 个元素，靠前的项有更高的抽中概率
export const getWeightedRandomElements = (
  arr: string[],
  count: number,
  bias: number = 1 // 可调节参数，默认为1
) => {
  // 如果 count 大于数组长度，返回打乱后的整个数组
  if (count >= arr.length) {
    return arr.sort(() => Math.random() - 0.5)
  }

  // 生成权重数组，基于 bias 来调整权重差异
  const weights = arr.map((_, index) => 1 / Math.pow(index + 1, bias))

  // 计算所有权重的总和
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)

  // 从数组中随机抽取 count 个元素
  const selected: string[] = []
  const availableItems = arr.slice()

  for (let i = 0; i < count; i++) {
    // 生成一个 0 到 totalWeight 之间的随机数
    let random = Math.random() * totalWeight
    let selectedIndex = -1

    // 找到对应的元素
    for (let j = 0; j < availableItems.length; j++) {
      random -= weights[j]
      if (random <= 0) {
        selectedIndex = j
        break
      }
    }

    // 将选中的元素加入结果，并从可选列表中移除
    const selectedItem = availableItems[selectedIndex]
    selected.push(selectedItem)
    availableItems.splice(selectedIndex, 1)
    weights.splice(selectedIndex, 1)
  }

  return selected
}

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
