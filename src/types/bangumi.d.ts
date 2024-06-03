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
