import type { BgmConfig, BgmData } from '@/types/bangumi'
import http from '@/utils/http'

export const bangumiGetConfigService = () => http.get<BgmConfig>('/config.json')

export const bangumiGetBgmFileService = (filename: string) =>
  http.get<BgmData[]>(`/${filename}`)
