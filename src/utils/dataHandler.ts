import { alistPathReplace, bgmImgReplace } from '@/config'
import type { BgmData } from '@/types/bangumi'
import type { ReplaceConfig } from '@/types/utils'

// ues a ReplaceConfigList to replace a string
const replaceHandler = (str: string, replaceList: ReplaceConfig[]) => {
  let newStr = str
  replaceList.some((replaceConfig) => {
    newStr = str.replace(replaceConfig.pattern, replaceConfig.replacement)
    // on success replace, return true to break
    if (newStr !== str) {
      return true
    }
  })
  return newStr
}

// Special Characters handler
export const specCharsHandler = (str: string): string => {
  const entities: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39': "'"
  }
  return str.replace(/&.+?;/g, (entity) => entities[entity] || entity)
}

export const handleBgmData = (bgm: BgmData): BgmData => {
  const newAlistPath = replaceHandler(bgm.alistPath, alistPathReplace)
  const newImg = replaceHandler(bgm.img, bgmImgReplace)
  const newName = specCharsHandler(bgm.name)
  const newChineseName = specCharsHandler(bgm.chineseName)
  return {
    ...bgm,
    alistPath: newAlistPath,
    img: newImg,
    name: newName,
    chineseName: newChineseName
  }
}
