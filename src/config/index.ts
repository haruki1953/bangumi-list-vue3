// axios配置
export const axiosConfig = {
  baseUrl: 'https://bangumi.sakiko.top/home/data', // 番剧文件的存放路径
  // baseUrl: 'http://localhost:5173/home/data', // 番剧文件的存放路径
  timeout: 10000
}

// alist配置
export const alistConfig = {
  baseUrl: 'https://bangumi.sakiko.top'
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
export const contactInfo: LinkInfo = {
  twitter: {
    name: 'X / Twitter', // 平台名称
    fontawesomeClass: 'fa-brands fa-x-twitter', // fontawesome图标的class
    // logoUrl: '', // 图标地址(有fontawesomeClass则不显示)
    description: '@harukiO_0', // 描述,简介
    link: 'https://x.com/harukiO_0' // 链接
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
