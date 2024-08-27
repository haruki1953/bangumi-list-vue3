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
export const webName = '小祥の小窝'

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

// 广告
import adImage from '@/assets/moeu-ad-img.jpg'
export const adConfig = {
  image: adImage,
  link: 'https://moeu01.com/sakiko'
}

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
export const contactInfo: LinkInfo = {
  twitter: {
    name: 'X / Twitter', // 平台名称
    fontawesomeClass: 'fa-brands fa-x-twitter', // fontawesome图标的class
    // logoUrl: '', // 图标地址(有fontawesomeClass则不显示)
    description: '@sakiko214', // 描述,简介
    link: 'https://x.com/sakiko214' // 链接
  },
  discord: {
    name: 'Discord',
    fontawesomeClass: 'fa-brands fa-discord',
    description: '小祥の小窝',
    link: 'https://discord.gg/nZWpvz2WNW'
  },
  github: {
    name: 'Github',
    fontawesomeClass: 'fa-brands fa-github',
    description: 'haruki1953/bangumi-list-vue3',
    link: 'https://github.com/haruki1953/bangumi-list-vue3'
  }
}

export const bgmImgReplace: ReplaceConfig[] = []

export const alistPathReplace: ReplaceConfig[] = [
  {
    pattern: /^https:\/\/bangumi\.sakiko\.top\//,
    replacement: '/'
  }
]
