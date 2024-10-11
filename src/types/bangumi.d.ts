import type { Ref } from 'vue'

export interface BgmData {
  id: string
  alistPath: string
  bgmUrl: string
  img: string
  name: string
  chineseName: string
  episode: string
  date: string
  weekday: string
  score: string
  tagList: string[]
  aliasList: string[]
}

// 前端程序中的BgmFile多了 bgmIds，统计番剧id
export interface BgmFile extends ConfigBgmFile {
  bgmIds: BgmData['id'][]
}

// 前端程序中的NotifInfo多了 isRead，标记已读未读
export interface NotifInfo extends ConfigNotifInfo {
  isRead: boolean
}

// config.json中的BgmFile
interface ConfigBgmFile {
  fileName: string
  lastModified: string
  showOnHome: boolean
}

// config.json中的NotifInfo
export interface ConfigNotifInfo {
  id: string
  title: string
  message: string
  type: 'success' | 'warning' | 'info' | 'error' | ''
}

export interface ConfigLink {
  link: string
  img: string
  name: string
  isRadiu: boolean
}

export interface AboutTag {
  tag: 'b' | 'p' | 'a' | ''
  content: string
  link?: string
}

export type AboutLi = AboutTag[]

export interface BgmConfig {
  version?: string
  notification?: ConfigNotifInfo
  aboutList?: AboutLi[]
  contact?: ConfigLink[]
  friend?: ConfigLink[]
  bgmFileList: ConfigBgmFile[]
}

export interface BgmGroup {
  // 分组标签，数组代表多行
  lable: string[]
  // 番剧数据列表
  bgmList: BgmData[]
}

export interface BangumiStoreDataDependencies {
  bgmDatas: Ref<BgmData[]>
  bgmFiles: Ref<BgmFile[]>
  isLoadingData: Ref<boolean>
  isFirstLoad: Ref<boolean>
  version: Ref<string>
  codeVersion: Ref<string>
  notifInfo: Ref<NotifInfo | null>
  contact: Ref<ConfigLink[]>
  friend: Ref<ConfigLink[]>
  aboutList: Ref<AboutLi[]>
}
