import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SubCutSetting, XImgCutSetting, Image } from '../types'
import { generateRandomKey } from '@/utils'

export const useUtilsStore = defineStore(
  'sakiko-utils-store',
  () => {
    const defaultXImgCutSetting = () => {
      return {
        imageType: 'image/jpeg' as const,
        imageQuality: 0.9,
        mergeGap: 0,
        enabledMainRatio: true,
        mainWidthRatio: 16,
        mainHeightRatio: 9,
        enabledSecondaryRatio: true,
        secondaryWidthRatio: 16,
        secondaryHeightRatio: 9
      }
    }
    const defaultSubCutSetting = () => {
      return {
        imageType: 'image/jpeg' as const,
        imageQuality: 0.9,
        mergeGap: 0,
        cropRangeMax: 15,
        cropRangeMin: 0,
        dontCropFirstSub: false,
        enabledCropRatio: true,
        corpWidthRatio: 16,
        corpHeightRatio: 9
      }
    }

    const xImgCutSetting = ref<XImgCutSetting>(defaultXImgCutSetting())
    const subCutSetting = ref<SubCutSetting>(defaultSubCutSetting())

    const saveXImgCutSetting = (setting: XImgCutSetting) => {
      xImgCutSetting.value = setting
    }
    const saveSubCutSetting = (setting: SubCutSetting) => {
      subCutSetting.value = setting
    }

    const resetXImgCutSetting = () => {
      xImgCutSetting.value = defaultXImgCutSetting()
    }
    const resetSubCutSetting = () => {
      subCutSetting.value = defaultSubCutSetting()
    }

    // 随机字符串，在变化时即显示对话框
    const altDialogMark = ref('')

    const altDialogImageData = ref<Image | null>(null)

    const openAltDialog = (image: Image) => {
      altDialogImageData.value = image
      altDialogMark.value = generateRandomKey()
    }

    return {
      xImgCutSetting,
      subCutSetting,
      defaultXImgCutSetting,
      defaultSubCutSetting,
      saveXImgCutSetting,
      saveSubCutSetting,
      resetXImgCutSetting,
      resetSubCutSetting,
      altDialogMark,
      altDialogImageData,
      openAltDialog
    }
  },
  {
    persist: true // 持久化
  }
)
