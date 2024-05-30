// axios配置
export const axiosConfig = {
  baseUrl: import.meta.env.BASE_URL, // 番剧数据文件将与网站配置在同一路径
  timeout: 10000
}

// 网站名称
export const webName = '小祥の小窝'

// logo图标
import logoImage from '@/assets/logo.png'
export { logoImage }

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
