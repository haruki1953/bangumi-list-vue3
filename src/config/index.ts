//
export const codeConfig = {
  // 代码版本（版本控制优化）当对番剧数据处理发生变化时需更改
  version: '2409111343'
}

// axios配置
export const axiosConfig = {
  // baseUrl: 'https://bangumi.sakiko.top/home/data', // 番剧文件的存放路径
  // baseUrl: 'http://localhost:5173/home/data', // 番剧文件的存放路径
  baseUrl: '/home/data', // 番剧文件的存放路径
  timeout: 20000
}

export const rssConfig = {
  link: '/home/data/rss.xml'
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
import type { BgmData, BgmUpdateInfo } from '@/types'
export const adConfig = {
  image: adImage,
  link: 'https://moeu01.com/sakiko',
  code: 'AGMwNnEN',
  name: '萌物云moeu'
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
    description: '@harukiO_0', // 描述,简介
    link: 'https://x.com/harukiO_0' // 链接
  },
  discord: {
    name: 'Discord',
    fontawesomeClass: 'fa-brands fa-discord',
    description: '小祥の小窝',
    link: 'https://discord.gg/93JRQbNbb2'
  },
  telegram: {
    name: 'Telegram',
    fontawesomeClass: 'fa-brands fa-telegram',
    description: '小祥の小窝',
    link: 'https://t.me/sakiko214'
  },
  github: {
    name: 'Github',
    fontawesomeClass: 'fa-brands fa-github',
    description: 'haruki1953/bangumi-list-vue3',
    link: 'https://github.com/haruki1953/bangumi-list-vue3'
  }
}

export const bgmImgReplace: ReplaceConfig[] = []

// 对 config.json 中 alistPath 的替换处理配置
export const alistPathReplace: ReplaceConfig[] = [
  {
    pattern: /^https:\/\/bangumi\.sakiko\.top\//,
    replacement: '/'
  }
]

// BgmData 属于 BgmUpdateInfo 的判断方法
export const bgmDataIsUpdateInfo = (
  // alistPath: "/Bangumi/魔法光源股份有限公司"
  bgmData: BgmData,
  // filePath: "/root/Downloads/Sakiko/Bangumi/魔法光源股份有限公司/Season 1"
  updateInfo: BgmUpdateInfo
) => {
  return updateInfo.filePath.includes(`${bgmData.alistPath}/`)
}

// 用 BgmUpdateInfo 拼接观看链接
// filePath: "/root/Downloads/Sakiko/Bangumi/魔法光源股份有限公司/Season 1"
// fileName: "[LoliHouse] Kabushikigaisha Magi-Lumière - 04 [WebRip 1080p HEVC-10bit AAC SRTx2].mkv"
// watchlink: "/Bangumi/魔法光源股份有限公司/Season 1/[LoliHouse] Kabushikigaisha Magi-Lumière - 04 [WebRip 1080p HEVC-10bit AAC SRTx2].mkv"
export const updateInfoToBgmWatchLink = (updateInfo: BgmUpdateInfo) => {
  const dirPath = updateInfo.filePath.slice('/root/Downloads/Sakiko'.length)
  return dirPath + '/' + updateInfo.fileName
}

// 用 BgmUpdateInfo 拼接下载链接
// downloadlink: "/d/onedrive/Sakiko/Bangumi/魔法光源股份有限公司/Season 1/[LoliHouse] Kabushikigaisha Magi-Lumière - 04 [WebRip 1080p HEVC-10bit AAC SRTx2].mkv"
export const updateInfoToBgmDownloadLink = (updateInfo: BgmUpdateInfo) => {
  return '/d/onedrive/Sakiko' + updateInfoToBgmWatchLink(updateInfo)
}

// 用 BgmUpdateInfo 拼接详情链接
// infoLink: "/Bangumi/魔法光源股份有限公司"
export const updateInfoToBgmInfoLink = (updateInfo: BgmUpdateInfo) => {
  const watchlink = updateInfoToBgmWatchLink(updateInfo)
  // 获取前三个路径部分 ['', 'Bangumi', '魔法光源股份有限公司'] ，然后拼接
  return watchlink.split('/').slice(0, 3).join('/')
}
