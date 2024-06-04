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
}

export interface BgmFile {
  fileName: string
  lastModified: string
  showOnHome: boolean
  bgmIds: BgmData['id'][]
}

export interface BgmConfig {
  bgmFileList: {
    fileName: string
    lastModified: string
    showOnHome: boolean
  }[]
}

export type WeekKey =
  | 'sun'
  | 'mon'
  | 'tues'
  | 'wed'
  | 'thur'
  | 'fri'
  | 'sat'
  | 'other'

export type WeekData = Record<WeekKey, BgmData[]>

export interface BgmGroup {
  // 分组标签，数组代表多行
  lable: string[]
  // 番剧数据列表
  bgmList: BgmData[]
}
