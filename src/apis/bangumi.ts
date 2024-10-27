import type { BgmConfig, BgmData, BgmUpdateInfo } from '@/types'
import http from '@/utils/http'

export const bangumiGetConfigService = () => http.get<BgmConfig>('/config.json')

export const bangumiGetBgmFileService = (filename: string) =>
  http.get<BgmData[]>(`/${filename}`)

export const bangumiGetUpdateService = () =>
  http.get<BgmUpdateInfo[]>('/update.json')
