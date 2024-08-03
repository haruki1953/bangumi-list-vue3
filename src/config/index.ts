//
export const codeConfig = {
  // 代码版本（版本控制优化）
  version: '2407141627'
}

// axios配置
export const axiosConfig = {
  // baseUrl: 'https://bangumi.sakiko.top/home/data', // 番剧文件的存放路径
  // baseUrl: 'http://localhost:5173/home/data', // 番剧文件的存放路径
  baseUrl: '/home/data', // 番剧文件的存放路径
  timeout: 10000
}

// 网站名称
export const webName = '番剧小窝'

// logo图标
import logoImage from '@/assets/logo.png'
export { logoImage }

// 海报 占位 失败
import bgmPlaceholder from '@/assets/bgm-placeholder.jpg'
import bgmError from '@/assets/bgm-error.jpg'
export { bgmPlaceholder, bgmError }

// bangumi图标
import bangumiIcon from '@/assets/bangumi-icon.ico'
import type { ReplaceConfig } from '@/types/utils'
export { bangumiIcon }

interface LinkInfo {
  [key: string]: {
    name: string
    fontawesomeClass: string
    // logoUrl?: string
    description: string
    link: string
  }
}
// 联系方式
export const contactInfo: LinkInfo = {}

export const bgmImgReplace: ReplaceConfig[] = []

export const alistPathReplace: ReplaceConfig[] = [
  {
    pattern: /^https:\/\/bangumi\.sakiko\.top\//,
    replacement: '/'
  }
]
