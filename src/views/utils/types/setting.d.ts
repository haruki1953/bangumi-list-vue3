export interface XImgCutSetting {
  imageType: 'image/png' | 'image/jpeg' | 'image/webp'
  imageQuality: number
  mergeGap: number
  enabledMainRatio: boolean
  mainWidthRatio: number
  mainHeightRatio: number
  enabledSecondaryRatio: boolean
  secondaryWidthRatio: number
  secondaryHeightRatio: number
}
export interface SubCutSetting {
  imageType: 'image/png' | 'image/jpeg' | 'image/webp'
  imageQuality: number
  mergeGap: number
  cropRangeMax: number
  cropRangeMin: number
  dontCropFirstSub: boolean
  enabledCropRatio: boolean
  corpWidthRatio: number
  corpHeightRatio: number
}

export interface Image {
  src: string
  alt?: string
}

export type XImgModeType = 'four' | 'three' | 'two'
