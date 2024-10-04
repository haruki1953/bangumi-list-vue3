import type { Ref } from 'vue'
import { messageError, messageSuccess } from './other'
import type { UploadUserFile } from 'element-plus'
import type { SubCutSetting } from '../types'
import {
  imageCropToRatioService,
  imageLoadImageFromFileService,
  imageMergeVerticalService,
  imageResizeImageService,
  imageSplitVerticalService
} from './image'
import { useUtilsStore } from '../stores'

export const useSubtitleCutService = (dependencies: {
  upFiles: Ref<UploadUserFile[]>
  mergedImage: Ref<string | null>
  isMerging: Ref<boolean>
  imageType: Ref<SubCutSetting['imageType']>
  imageQuality: Ref<SubCutSetting['imageQuality']>
  imageMergeGap: Ref<SubCutSetting['mergeGap']>
  dontCropFirstSub: Ref<SubCutSetting['dontCropFirstSub']>
  isEnabledRatioCrop: Ref<SubCutSetting['enabledCropRatio']>
  widthRatioForCrop: Ref<SubCutSetting['corpWidthRatio']>
  heightRatioForCrop: Ref<SubCutSetting['corpHeightRatio']>
  calcCropRangePercent: () => {
    max: number
    min: number
    difference: number
  }
  saveSetting: () => void
}) => {
  const {
    upFiles,
    mergedImage,
    isMerging,
    imageType,
    imageQuality,
    imageMergeGap,
    dontCropFirstSub,
    isEnabledRatioCrop,
    widthRatioForCrop,
    heightRatioForCrop,
    calcCropRangePercent,
    saveSetting
  } = dependencies

  const utilsStore = useUtilsStore()

  // 合并图片
  const mergeImages = async () => {
    if (upFiles.value.length < 1) {
      messageError('请先上传图片')
      return
    }
    isMerging.value = true
    try {
      // 首先处理第一张图片
      const mainImageEl = await imageLoadImageFromFileService(upFiles.value[0])

      // 图片裁剪信息
      const splitInfo = (() => {
        const tempInfo = calcCropRangePercent()
        return {
          top: 100 - tempInfo.max,
          bottom: 100 - tempInfo.min,
          bottomAfterCutTop: (tempInfo.difference / tempInfo.max) * 100
        }
      })()

      // 如果启用将图片裁剪为固定比例，进行裁剪
      const tryImageCropToRatio = (
        element: HTMLImageElement | HTMLCanvasElement
      ) => {
        if (!isEnabledRatioCrop.value) {
          return element
        }
        return imageCropToRatioService(
          element,
          widthRatioForCrop.value,
          heightRatioForCrop.value
        )
      }
      const mainImageAfterRatioCrop = tryImageCropToRatio(mainImageEl)

      // 如果不截取第一个字幕，则将第一张图片裁剪
      const mainImageAfterSplit = (() => {
        if (!dontCropFirstSub.value) {
          return imageSplitVerticalService(
            mainImageAfterRatioCrop,
            splitInfo.bottom
          ).top
        }
        return imageSplitVerticalService(mainImageAfterRatioCrop, splitInfo.top)
          .top
      })()

      // 将其余图片裁剪
      const imageListAfterSplitPromise = upFiles.value
        .slice(1)
        .map(async (f) => {
          const imageEl = await imageLoadImageFromFileService(f)
          // 如果启用将图片裁剪为固定比例，进行裁剪
          const imageAfterRatioCrop = tryImageCropToRatio(imageEl)
          // 将图片缩放为主图的宽度
          const resizeHeight =
            imageAfterRatioCrop.height *
            (mainImageAfterSplit.width / imageAfterRatioCrop.width)
          const imageAfterResize = imageResizeImageService(
            imageAfterRatioCrop,
            mainImageAfterSplit.width,
            resizeHeight
          )
          // 将图片上下裁剪
          const imageAfterTopCut = imageSplitVerticalService(
            imageAfterResize,
            splitInfo.top
          ).bottom
          const imageAfterBottomCut = imageSplitVerticalService(
            imageAfterTopCut,
            splitInfo.bottomAfterCutTop
          ).top
          return imageAfterBottomCut
        })
      const imageListAfterSplit = await Promise.all(imageListAfterSplitPromise)

      // 拼接
      const imageAfterMerged = imageMergeVerticalService(
        [mainImageAfterSplit, ...imageListAfterSplit],
        imageMergeGap.value
      )

      // 保存
      mergedImage.value = imageAfterMerged.toDataURL(
        imageType.value,
        imageQuality.value
      )
      saveSetting()
      messageSuccess('图片处理成功')
    } catch (error) {
      messageError('图片处理失败')
    } finally {
      isMerging.value = false
    }
  }

  const clearImages = () => {
    upFiles.value = []
    mergedImage.value = null
  }

  const copyImage = async () => {
    if (!mergedImage.value) {
      messageError('No image to copy.')
      return
    }
    try {
      const blob = await (await fetch(mergedImage.value)).blob()
      const clipboardItem = new ClipboardItem({ 'image/png': blob })
      await navigator.clipboard.write([clipboardItem])
      messageSuccess('复制成功')
    } catch (err) {
      messageError('复制失败，请尝试手动复制')
    }
  }

  const saveImage = () => {
    if (!mergedImage.value) {
      messageError('No image to save.')
      return
    }
    const link = document.createElement('a')
    link.href = mergedImage.value
    const firstFileName = upFiles.value[0].name
      .split('.')
      .slice(0, -1)
      .join('.')
    const typeName = (() => {
      if (utilsStore.subCutSetting.imageType === 'image/png') {
        return '.png'
      } else if (utilsStore.subCutSetting.imageType === 'image/jpeg') {
        return '.jpg'
      } else if (utilsStore.subCutSetting.imageType === 'image/webp') {
        return '.webp'
      } else {
        return ''
      }
    })()
    link.download = `sakiko-${firstFileName}${typeName}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return {
    mergeImages,
    clearImages,
    copyImage,
    saveImage
  }
}
