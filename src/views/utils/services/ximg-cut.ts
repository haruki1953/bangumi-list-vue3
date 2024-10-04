import { nextTick, type Ref } from 'vue'
import type { XImgCutSetting, XImgModeType } from '../types'
import type { UploadFile, UploadUserFile } from 'element-plus'
import { useUtilsStore } from '../stores'
import {
  imageCropToRatioService,
  imageLoadImageFromFileService,
  imageMergeHorizontalService,
  imageMergeVerticalService,
  imageResizeImageService,
  imageScaleImageService,
  imageSplitInFourAndMaintainAspectRatioService,
  imageSplitInThreeAndMaintainAspectRatioService,
  imageSplitInTwoAndMaintainAspectRatioService
} from './image'
import { imageRatioTolerance } from '../config'
import { messageError, messageSuccess } from './other'

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

  // TypeScript 中声明 File System Access API 类型
  interface FileSystemDirectoryHandle {
    kind: string
    name: string
    getFileHandle(
      name: string,
      options?: { create: boolean }
    ): Promise<FileSystemFileHandle>
  }
  interface FileSystemFileHandle {
    createWritable(): Promise<WritableStream>
  }
  interface Window {
    showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>
  }

  // 存储文件夹句柄
  let directoryHandle: FileSystemDirectoryHandle | null = null

  const getDirectoryHandle = async () => {
    if (directoryHandle) {
      return directoryHandle
    }

    if (!('showDirectoryPicker' in window)) {
      return null
    }
    try {
      // 请求用户选择文件夹
      directoryHandle = await (
        window.showDirectoryPicker as Window['showDirectoryPicker']
      )()
      console.log('Directory chosen:', directoryHandle)
      return directoryHandle
    } catch (error) {
      console.error('Error selecting directory:', error)
      return null
    }
  }

  const saveImage = async (img: string, addname: string) => {
    if (!mainImageFile.value) {
      throw new Error('!mainImageFile.value')
    }

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

    const fileName = `sakiko-${firstFileName}-${addname}${typeName}`

    try {
      const directoryHandle = await getDirectoryHandle()
      if (!directoryHandle) {
        throw new Error('!directoryHandle')
      }

      const fileHandle = await directoryHandle.getFileHandle(fileName, {
        create: true
      })
      const writableStream = await fileHandle.createWritable()

      const response = await fetch(img)
      const blob = await response.blob()

      await (writableStream as any).write(blob)
      await writableStream.close()

      console.log(`Image saved as ${fileName}`)
    } catch (error) {
      console.error('Error saving the image:', error)
      throw error
    }
  }

  const saveAllImage = async () => {
    if (!('showDirectoryPicker' in window)) {
      ElNotification({
        title: '当前浏览器不支持批量保存',
        message: '请右键点击或长按图片，手动保存',
        type: 'warning',
        offset: 60
      })
      return
    }
    try {
      if (modeRadio.value === 'four') {
        if (
          mergedImageLT.value &&
          mergedImageRT.value &&
          mergedImageLB.value &&
          mergedImageRB.value
        ) {
          await saveImage(mergedImageLT.value, 'LeftTop')
          await saveImage(mergedImageRT.value, 'RightTop')
          await saveImage(mergedImageLB.value, 'LeftBottom')
          await saveImage(mergedImageRB.value, 'RightBottom')
        }
      } else if (modeRadio.value === 'three') {
        if (mergedImageLT.value && mergedImageRT.value && mergedImageRB.value) {
          await saveImage(mergedImageLT.value, 'Left')
          await saveImage(mergedImageRT.value, 'RightTop')
          await saveImage(mergedImageRB.value, 'RightBottom')
        }
      } else if (modeRadio.value === 'two') {
        if (mergedImageLT.value && mergedImageRT.value) {
          await saveImage(mergedImageLT.value, 'Left')
          await saveImage(mergedImageRT.value, 'Right')
        }
      }
    } catch (error) {
      ElNotification({
        title: '保存失败',
        message: '请右键点击或长按图片，手动保存',
        type: 'error',
        offset: 60
      })
      return
    }
    ElNotification({
      title: '保存成功',
      message: `图片已保存在文件夹：${directoryHandle?.name}`,
      type: 'success',
      offset: 60
    })
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

      // 辅助函数
      // 将对应数组中的图片，和切割后的主图拼接
      const mergeImageListToMain = async (
        fileList: UploadUserFile[],
        partOfMainCanvas: HTMLCanvasElement
      ) => {
        // 副图分情况进行处理
        const secondaryImageHandleServices = (() => {
          const imageRatio =
            mainImageCutToRatio.width / mainImageCutToRatio.height
          // 定义一个小的容差值，为解决浮点数精度问题
          const tolerance = imageRatioTolerance
          // 图片比例大于16:9时横向拼接，否则纵向
          // 图片比例大于16:9时依照高来缩放，否则为宽
          if (imageRatio > 16 / 9 + tolerance) {
            return {
              merge: imageMergeHorizontalService,
              resize: (img: HTMLImageElement | HTMLCanvasElement) => {
                return imageResizeImageService(
                  img,
                  partOfMainCanvas.height * (img.width / img.height),
                  partOfMainCanvas.height
                )
              }
            }
          } else {
            return {
              merge: imageMergeVerticalService,
              resize: (img: HTMLImageElement | HTMLCanvasElement) => {
                return imageResizeImageService(
                  img,
                  partOfMainCanvas.width,
                  partOfMainCanvas.width * (img.height / img.width)
                )
              }
            }
          }
        })()

        // 副图图片处理函数
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

          // 2 将所有图片进行缩放，大小就为主图（切割后）的宽或高
          const imgResizeToMain =
            secondaryImageHandleServices.resize(imgCutToRatio)
          return imgResizeToMain
        }

        // 副图图片分情况拼接
        if (fileList.length >= 2) {
          // 数组中的第一个图片拼接在 主图切割后（以下简称主切）的上方，第二个图片拼接在主切下方
          const image1InList = await processTheImageFileInList(fileList[0])
          const image2InList = await processTheImageFileInList(fileList[1])
          return secondaryImageHandleServices.merge(
            [image1InList, partOfMainCanvas, image2InList],
            imageMergeGap.value
          )
        } else if (fileList.length === 1) {
          // 如果数组中只有一个图片，则主切的上方和下方都为这个图片
          const image1InList = await processTheImageFileInList(fileList[0])
          return secondaryImageHandleServices.merge(
            [image1InList, partOfMainCanvas, image1InList],
            imageMergeGap.value
          )
        } else {
          // fileList.length === 0
          // 如果数组中没有图片，则不进行拼接
          return partOfMainCanvas
        }
      }

      // 3 将图片分为指定份数份
      if (modeRadio.value === 'four') {
        const mainImageAfterSplitInFour =
          imageSplitInFourAndMaintainAspectRatioService(mainImageEnlarge2)
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
        const mainImageAfterSplit =
          imageSplitInThreeAndMaintainAspectRatioService(mainImageEnlarge2)
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
        const mainImageAfterSplit =
          imageSplitInTwoAndMaintainAspectRatioService(mainImageEnlarge2)
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
      messageSuccess('生成成功')
    } catch (error) {
      messageError('生成失败')
    } finally {
      isMerging.value = false
    }
  }

  return {
    clearImages,
    saveAllImage,
    mergeImage
  }
}
