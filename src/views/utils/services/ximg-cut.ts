import { nextTick, type Ref } from 'vue'
import type { XImgCutSetting, XImgModeType } from '../types'
import type { UploadFile, UploadUserFile } from 'element-plus'
import { useUtilsStore } from '../stores'
import {
  imageCropToRatioService,
  imageLoadImageFromFileService,
  imageMergeVerticalService,
  imageResizeImageService,
  imageScaleImageService,
  imageSplitInFourService,
  imageSplitInThreeService,
  imageSplitInTwoService
} from './image'

export const useXImgCutService = (dependencies: {
  mainImageFile: Ref<UploadFile | null>
  ltImageFiles: Ref<UploadUserFile[]>
  rtImageFiles: Ref<UploadUserFile[]>
  lbImageFiles: Ref<UploadUserFile[]>
  rbImageFiles: Ref<UploadUserFile[]>
  mergedImageLT: Ref<string | null>
  mergedImageRT: Ref<string | null>
  mergedImageLB: Ref<string | null>
  mergedImageRB: Ref<string | null>
  modeRadio: Ref<XImgModeType>
  isMerging: Ref<boolean>
  imageType: Ref<XImgCutSetting['imageType']>
  imageQuality: Ref<XImgCutSetting['imageQuality']>
  imageMergeGap: Ref<XImgCutSetting['mergeGap']>
  enabledMainRatio: Ref<XImgCutSetting['enabledMainRatio']>
  mainWidthRatio: Ref<XImgCutSetting['mainWidthRatio']>
  mainHeightRatio: Ref<XImgCutSetting['mainHeightRatio']>
  enabledSecondaryRatio: Ref<XImgCutSetting['enabledSecondaryRatio']>
  secondaryWidthRatio: Ref<XImgCutSetting['secondaryWidthRatio']>
  secondaryHeightRatio: Ref<XImgCutSetting['secondaryHeightRatio']>
  saveSetting: () => void
}) => {
  const {
    mainImageFile,
    ltImageFiles,
    rtImageFiles,
    lbImageFiles,
    rbImageFiles,
    mergedImageLT,
    mergedImageRT,
    mergedImageLB,
    mergedImageRB,
    modeRadio,
    isMerging,
    imageType,
    imageQuality,
    imageMergeGap,
    enabledMainRatio,
    mainWidthRatio,
    mainHeightRatio,
    enabledSecondaryRatio,
    secondaryWidthRatio,
    secondaryHeightRatio,
    saveSetting
  } = dependencies

  const utilsStore = useUtilsStore()

  const clearImages = () => {
    mainImageFile.value = null
    ltImageFiles.value = []
    rtImageFiles.value = []
    lbImageFiles.value = []
    rbImageFiles.value = []
    mergedImageLT.value = null
    mergedImageRT.value = null
    mergedImageLB.value = null
    mergedImageRB.value = null
  }

  const saveImage = (img: string, addname: string) => {
    if (!mainImageFile.value) {
      return
    }
    const link = document.createElement('a')
    link.href = img
    const firstFileName = mainImageFile.value.name
      .split('.')
      .slice(0, -1)
      .join('.')
    const typeName = (() => {
      if (utilsStore.xImgCutSetting.imageType === 'image/png') {
        return '.png'
      } else if (utilsStore.xImgCutSetting.imageType === 'image/jpeg') {
        return '.jpg'
      } else if (utilsStore.xImgCutSetting.imageType === 'image/webp') {
        return '.webp'
      } else {
        return ''
      }
    })()
    link.download = `sakiko-${firstFileName}-${addname}${typeName}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const saveAllImage = () => {
    if (modeRadio.value === 'four') {
      if (
        mergedImageLT.value &&
        mergedImageRT.value &&
        mergedImageLB.value &&
        mergedImageRB.value
      ) {
        saveImage(mergedImageLT.value, 'LeftTop')
        saveImage(mergedImageRT.value, 'RightTop')
        saveImage(mergedImageLB.value, 'LeftBottom')
        saveImage(mergedImageRB.value, 'RightBottom')
      }
    } else if (modeRadio.value === 'three') {
      if (mergedImageLT.value && mergedImageRT.value && mergedImageRB.value) {
        saveImage(mergedImageLT.value, 'Left')
        saveImage(mergedImageRT.value, 'RightTop')
        saveImage(mergedImageRB.value, 'RightBottom')
      }
    } else if (modeRadio.value === 'two') {
      if (mergedImageLT.value && mergedImageRT.value) {
        saveImage(mergedImageLT.value, 'Left')
        saveImage(mergedImageRT.value, 'Right')
      }
    }
  }

  const mergeImage = async () => {
    if (!mainImageFile.value) {
      return
    }

    isMerging.value = true
    await nextTick()

    try {
      const mainImageEl = await imageLoadImageFromFileService(
        mainImageFile.value
      )

      // 1 将主图裁剪为16:9
      // const mainImageCutTo169 = imageCropToRatioService(mainImageEl, 16, 9)
      const mainImageCutToRatio = (() => {
        if (!enabledMainRatio.value) {
          return mainImageEl
        }
        return imageCropToRatioService(
          mainImageEl,
          mainWidthRatio.value,
          mainHeightRatio.value
        )
      })()

      // 2 将主图放大2倍
      const mainImageEnlarge2 = imageScaleImageService(mainImageCutToRatio, 2)

      let mergedLT
      let mergedRT
      let mergedLB
      let mergedRB

      // 3 将图片分为指定份数份
      if (modeRadio.value === 'four') {
        const mainImageAfterSplitInFour =
          imageSplitInFourService(mainImageEnlarge2)
        // 4 拼接
        mergedLT = await mergeImageListToMain(
          ltImageFiles.value,
          mainImageAfterSplitInFour.leftTop
        )
        mergedRT = await mergeImageListToMain(
          rtImageFiles.value,
          mainImageAfterSplitInFour.rightTop
        )
        mergedLB = await mergeImageListToMain(
          lbImageFiles.value,
          mainImageAfterSplitInFour.leftBottom
        )
        mergedRB = await mergeImageListToMain(
          rbImageFiles.value,
          mainImageAfterSplitInFour.rightBottom
        )
      } else if (modeRadio.value === 'three') {
        const mainImageAfterSplit = imageSplitInThreeService(mainImageEnlarge2)
        // 4 拼接
        mergedLT = await mergeImageListToMain(
          ltImageFiles.value,
          mainImageAfterSplit.left
        )
        mergedRT = await mergeImageListToMain(
          rtImageFiles.value,
          mainImageAfterSplit.rightTop
        )
        mergedRB = await mergeImageListToMain(
          rbImageFiles.value,
          mainImageAfterSplit.rightBottom
        )
      } else if (modeRadio.value === 'two') {
        const mainImageAfterSplit = imageSplitInTwoService(mainImageEnlarge2)
        // 4 拼接
        mergedLT = await mergeImageListToMain(
          ltImageFiles.value,
          mainImageAfterSplit.left
        )
        mergedRT = await mergeImageListToMain(
          rtImageFiles.value,
          mainImageAfterSplit.right
        )
      }

      // 保存最终图片
      mergedImageLT.value =
        mergedLT?.toDataURL(imageType.value, imageQuality.value) || null
      mergedImageRT.value =
        mergedRT?.toDataURL(imageType.value, imageQuality.value) || null
      mergedImageLB.value =
        mergedLB?.toDataURL(imageType.value, imageQuality.value) || null
      mergedImageRB.value =
        mergedRB?.toDataURL(imageType.value, imageQuality.value) || null

      await nextTick()
      saveSetting()
      ElMessage({
        type: 'success',
        offset: 66,
        message: '生成成功'
      })
    } catch (error) {
      ElMessage({
        type: 'error',
        offset: 66,
        message: '生成失败'
      })
    } finally {
      isMerging.value = false
    }
  }

  // 将对应数组中的图片，和切割后的主图拼接
  const mergeImageListToMain = async (
    fileList: UploadUserFile[],
    partOfMainCanvas: HTMLCanvasElement
  ) => {
    // 图片处理函数
    const processTheImageFileInList = async (file: UploadUserFile) => {
      const imgEl = await imageLoadImageFromFileService(file)
      // 1 将所有图片按“cover”方式裁剪为16比9
      // const imgCutTo169 = imageCropToRatioService(imgEl, 16, 9)
      const imgCutToRatio = (() => {
        if (!enabledSecondaryRatio.value) {
          return imgEl
        }
        return imageCropToRatioService(
          imgEl,
          secondaryWidthRatio.value,
          secondaryHeightRatio.value
        )
      })()

      // 2 将所有图片进行缩放，大小就为主图切割后一份的大小
      const imgResizeToMain = imageResizeImageService(
        imgCutToRatio,
        partOfMainCanvas.width,
        partOfMainCanvas.width * (imgCutToRatio.height / imgCutToRatio.width)
      )
      return imgResizeToMain
    }

    // 分情况进行拼接
    if (fileList.length >= 2) {
      // 数组中的第一个图片拼接在 主图切割后（以下简称主切）的上方，第二个图片拼接在主切下方
      const image1InList = await processTheImageFileInList(fileList[0])
      const image2InList = await processTheImageFileInList(fileList[1])
      return imageMergeVerticalService(
        [image1InList, partOfMainCanvas, image2InList],
        imageMergeGap.value
      )
    } else if (fileList.length === 1) {
      // 如果数组中只有一个图片，则主切的上方和下方都为这个图片
      const image1InList = await processTheImageFileInList(fileList[0])
      return imageMergeVerticalService(
        [image1InList, partOfMainCanvas, image1InList],
        imageMergeGap.value
      )
    } else {
      // fileList.length === 0
      // 如果数组中没有图片，则不进行拼接
      return partOfMainCanvas
    }
  }

  return {
    clearImages,
    saveAllImage,
    mergeImage
  }
}
