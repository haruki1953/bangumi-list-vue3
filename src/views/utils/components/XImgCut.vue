<script lang="ts" setup>
import {
  Plus,
  Loading,
  Back,
  Right,
  TopRight,
  TopLeft,
  BottomRight,
  BottomLeft,
  Setting
} from '@element-plus/icons-vue'

import {
  xImgCutDemoLB,
  xImgCutDemoLT,
  xImgCutDemoRB,
  xImgCutDemoRT,
  xImgCutDemo2L,
  xImgCutDemo2R,
  xImgCutDemo3L,
  xImgCutDemo3RB,
  xImgCutDemo3RT
} from '../assets'

import ImageGroup from './ImageGroup.vue'
import ImageUploadSelecter from './ImageUploadSelecter.vue'
import type { UploadFile, UploadUserFile } from 'element-plus'
import { ref } from 'vue'
import { computed } from 'vue'
import { nextTick } from 'vue'
import {
  imageCropToRatioService,
  imageLoadImageFromFileService,
  imageMergeVerticalService,
  imageResizeImageService,
  imageScaleImageService,
  imageSplitInFourService,
  imageSplitInThreeService,
  imageSplitInTwoService
} from '../services'
import { useWindowSize } from '@vueuse/core'

const xImgCutDemoGroup = [
  xImgCutDemoLT,
  xImgCutDemoRT,
  xImgCutDemoLB,
  xImgCutDemoRB
]
const xImgCut3DemoGroup = [xImgCutDemo3L, xImgCutDemo3RB, xImgCutDemo3RT]
const xImgCut2DemoGroup = [xImgCutDemo2L, xImgCutDemo2R]
const xImgCutDemoByMode = computed(() => {
  if (modeRadio.value === 'four') {
    return xImgCutDemoGroup
  } else if (modeRadio.value === 'three') {
    return xImgCut3DemoGroup
  } else {
    // (modeRadio.value === 'two')
    return xImgCut2DemoGroup
  }
})

// 左上、右上、左下、右下
const ltImageFiles = ref<UploadUserFile[]>([])
const rtImageFiles = ref<UploadUserFile[]>([])
const lbImageFiles = ref<UploadUserFile[]>([])
const rbImageFiles = ref<UploadUserFile[]>([])

const mainImageFile = ref<UploadFile | null>(null)

const handleMainImageUpload = async (uploadFile: UploadFile) => {
  if (!uploadFile.raw) {
    return
  }
  mainImageFile.value = uploadFile
  await mergeImage()
}

const mergedImageGroup = computed(() => {
  if (modeRadio.value === 'four') {
    if (
      mergedImageLT.value &&
      mergedImageRT.value &&
      mergedImageLB.value &&
      mergedImageRB.value
    ) {
      return [
        mergedImageLT.value,
        mergedImageRT.value,
        mergedImageLB.value,
        mergedImageRB.value
      ]
    }
  } else if (modeRadio.value === 'three') {
    if (mergedImageLT.value && mergedImageRT.value && mergedImageRB.value) {
      return [mergedImageLT.value, mergedImageRT.value, mergedImageRB.value]
    }
  } else if (modeRadio.value === 'two') {
    if (mergedImageLT.value && mergedImageRT.value) {
      return [mergedImageLT.value, mergedImageRT.value]
    }
  }
  return null
})

const mergedImageLT = ref<string | null>(null)
const mergedImageRT = ref<string | null>(null)
const mergedImageLB = ref<string | null>(null)
const mergedImageRB = ref<string | null>(null)

const isMerging = ref(false)

type ModeType = 'four' | 'three' | 'two'
const modeRadio = ref<ModeType>('four')

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
  link.download = `sakiko-${firstFileName}-${addname}.png`
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
  ElMessage({
    type: 'info',
    offset: 66,
    message: '生成中'
  })
  await nextTick()

  try {
    const mainImageEl = await imageLoadImageFromFileService(mainImageFile.value)

    // 1 将主图裁剪为16:9
    const mainImageCutTo169 = imageCropToRatioService(mainImageEl, 16, 9)

    // 2 将主图放大2倍
    const mainImageEnlarge2 = imageScaleImageService(mainImageCutTo169, 2)

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
    mergedImageLT.value = mergedLT?.toDataURL('image/png') || null
    mergedImageRT.value = mergedRT?.toDataURL('image/png') || null
    mergedImageLB.value = mergedLB?.toDataURL('image/png') || null
    mergedImageRB.value = mergedRB?.toDataURL('image/png') || null

    await nextTick()
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
    const imgCutTo169 = imageCropToRatioService(imgEl, 16, 9)
    // 2 将所有图片进行缩放，大小就为主图切割后一份的大小
    const imgResizeToMain = imageResizeImageService(
      imgCutTo169,
      partOfMainCanvas.width,
      partOfMainCanvas.width * (9 / 16)
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

const dialogVisible = ref(false)

const windowSize = useWindowSize()
const dialogWidth = computed(() => {
  const width = 400
  const windowWidth = windowSize.width.value
  return windowWidth * 0.9 < width ? '90%' : width
})

const imageMergeGap = ref(0)
</script>
<template>
  <div class="ximg-cut-util">
    <div class="setting-dialog">
      <el-dialog
        v-model="dialogVisible"
        :width="dialogWidth"
        :lock-scroll="false"
      >
        <div class="row center-box">
          <el-tooltip content="可防止边缘溢出" placement="top" effect="light">
            <div class="lable">图片拼接间隔（单位px）</div>
          </el-tooltip>
          <div class="input-box">
            <el-input-number v-model="imageMergeGap" :step="1" step-strictly />
          </div>
        </div>
      </el-dialog>
    </div>
    <h2>推特图片拼接📷</h2>
    <div>
      <div v-if="mergedImageGroup && mainImageFile">
        <div class="image-group-and-buttons">
          <div class="demonstrate-center">
            <div class="demonstrate-box">
              <div class="demonstrate">
                <ImageGroup
                  :data="mergedImageGroup"
                  backgroundColor="soft"
                ></ImageGroup>
              </div>
            </div>
          </div>
          <div class="btn-box">
            <el-button
              type="info"
              @click="dialogVisible = true"
              circle
              :icon="Setting"
            ></el-button>
            <el-button type="warning" @click="mergeImage" :loading="isMerging">
              再次生成
            </el-button>
            <el-button type="success" @click="saveAllImage"> 保存 </el-button>
            <el-button type="danger" @click="clearImages"> 清空 </el-button>
          </div>
        </div>
        <div class="more-image-selsect">
          <div v-if="modeRadio === 'four'">
            <el-row :gutter="20">
              <el-col :md="12">
                <div class="title-box">
                  <el-icon><TopLeft /></el-icon>
                  <div class="text">左上</div>
                  <el-icon><TopLeft /></el-icon>
                </div>
                <ImageUploadSelecter
                  v-model="ltImageFiles"
                  :limit="2"
                ></ImageUploadSelecter>
              </el-col>
              <el-col :md="12">
                <div class="title-box">
                  <el-icon><TopRight /></el-icon>
                  <div class="text">右上</div>
                  <el-icon><TopRight /></el-icon>
                </div>
                <ImageUploadSelecter
                  v-model="rtImageFiles"
                  :limit="2"
                ></ImageUploadSelecter>
              </el-col>
              <el-col :md="12">
                <div class="title-box">
                  <el-icon><BottomLeft /></el-icon>
                  <div class="text">左下</div>
                  <el-icon><BottomLeft /></el-icon>
                </div>
                <ImageUploadSelecter
                  v-model="lbImageFiles"
                  :limit="2"
                ></ImageUploadSelecter>
              </el-col>
              <el-col :md="12">
                <div class="title-box">
                  <el-icon><BottomRight /></el-icon>
                  <div class="text">右下</div>
                  <el-icon><BottomRight /></el-icon>
                </div>
                <ImageUploadSelecter
                  v-model="rbImageFiles"
                  :limit="2"
                ></ImageUploadSelecter>
              </el-col>
            </el-row>
          </div>
          <div v-if="modeRadio === 'three'">
            <el-row :gutter="20">
              <el-col :md="12">
                <div class="title-box">
                  <el-icon><Back /></el-icon>
                  <div class="text">左侧</div>
                  <el-icon><Back /></el-icon>
                </div>
                <ImageUploadSelecter
                  v-model="ltImageFiles"
                  :limit="2"
                ></ImageUploadSelecter>
              </el-col>
              <el-col :md="12">
                <div>
                  <div class="title-box">
                    <el-icon><TopRight /></el-icon>
                    <div class="text">右上</div>
                    <el-icon><TopRight /></el-icon>
                  </div>
                  <ImageUploadSelecter
                    v-model="rtImageFiles"
                    :limit="2"
                  ></ImageUploadSelecter>
                </div>
                <div>
                  <div class="title-box">
                    <el-icon><BottomRight /></el-icon>
                    <div class="text">右下</div>
                    <el-icon><BottomRight /></el-icon>
                  </div>
                  <ImageUploadSelecter
                    v-model="rbImageFiles"
                    :limit="2"
                  ></ImageUploadSelecter>
                </div>
              </el-col>
            </el-row>
          </div>
          <div v-if="modeRadio === 'two'">
            <el-row :gutter="20">
              <el-col :md="12">
                <div class="title-box">
                  <el-icon><Back /></el-icon>
                  <div class="text">左侧</div>
                  <el-icon><Back /></el-icon>
                </div>
                <ImageUploadSelecter
                  v-model="ltImageFiles"
                  :limit="2"
                ></ImageUploadSelecter>
              </el-col>
              <el-col :md="12">
                <div class="title-box">
                  <el-icon><Right /></el-icon>
                  <div class="text">右侧</div>
                  <el-icon><Right /></el-icon>
                </div>
                <ImageUploadSelecter
                  v-model="rtImageFiles"
                  :limit="2"
                ></ImageUploadSelecter>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="main-select-and-demonstrate" v-else>
        <el-row>
          <el-col :md="12">
            <div class="upload one">
              <el-upload
                :auto-upload="false"
                accept="image/*"
                :show-file-list="false"
                :on-change="handleMainImageUpload"
                drag
              >
                <el-icon class="uploader-icon is-loading" v-if="isMerging">
                  <Loading />
                </el-icon>
                <el-icon class="uploader-icon" v-else><Plus /></el-icon>
                <span class="uploader-text">选择图片</span>
              </el-upload>
            </div>
            <div class="mode-radio">
              <el-radio-group v-model="modeRadio">
                <el-radio value="four"> 四分 </el-radio>
                <el-radio value="three"> 三分 </el-radio>
                <el-radio value="two"> 二分 </el-radio>
              </el-radio-group>
            </div>
          </el-col>
          <el-col :md="12">
            <div class="demonstrate-center">
              <div class="demonstrate-box">
                <Transition name="fade-slide" mode="out-in">
                  <div
                    class="demonstrate transition"
                    :key="xImgCutDemoByMode.toString()"
                  >
                    <el-badge value="示例" type="primary" :offset="[-35, 15]">
                      <ImageGroup
                        :data="xImgCutDemoByMode"
                        backgroundColor="soft"
                      ></ImageGroup>
                    </el-badge>
                  </div>
                </Transition>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.ximg-cut-util {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  font-size: 16px;
  h2 {
    color: var(--color-heading);
    margin: 20px 5px 10px 5px;
    font-weight: bold;
    transition: all 0.5s;
    text-align: center;
  }
  .main-select-and-demonstrate {
    .el-row {
      align-items: center;
    }
  }
  .more-image-selsect {
    .el-row {
      align-items: center;
    }
    .title-box {
      display: flex;
      margin-top: 10px;
      align-items: center;
      justify-content: center;
      .text {
        margin: 0 10px;
        // font-size: 16px;
        font-weight: bold;
      }
    }
  }
}

$upload-img-width: 300px;
$upload-img-height: 135px;
.upload {
  &.one {
    display: flex;
    justify-content: center;
    align-content: center;
  }
  :deep() {
    .el-upload {
      width: $upload-img-width;
      height: $upload-img-height;
      margin: 8px;
      border: 2px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition:
        border var(--el-transition-duration),
        background-color 0.5s;
      color: #8c939d;
      &:hover {
        border-color: var(--el-color-primary);
      }
      .uploader-icon {
        font-size: 28px;
      }
      .uploader-text {
        font-weight: bold;
        margin-left: 10px;
      }
      .el-upload-dragger {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        // visibility: hidden;
        border: none;
        background-color: transparent;
        &.is-dragover {
          background-color: var(--el-color-primary-light-9);
        }
      }
    }
  }
}
.mode-radio {
  display: flex;
  justify-content: center;
  align-content: center;
  :deep() {
    .el-radio {
      .el-radio__inner {
        border: none;
        background-color: var(--color-background-mute);
        transition:
          background-color 0.5s,
          border 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        &::after {
          display: none;
          background-color: var(--color-background);
        }
      }
      .el-radio__label {
        font-size: 14px;
        font-weight: bold;
        color: var(--color-text-soft);
      }
      &.is-checked {
        .el-radio__inner {
          border: 5px solid var(--el-color-primary);
          background-color: var(--color-background);
        }
        .el-radio__label {
          color: var(--el-color-primary);
        }
      }
    }
  }
}
.demonstrate-center {
  max-width: 520px;
  margin: 0 auto;
}
.demonstrate-box {
  position: relative;
  max-width: 500px;
  aspect-ratio: 16 / 9;
  margin: 10px;
  // overflow: visible;
}
.demonstrate {
  width: 100%;
  aspect-ratio: 16 / 9;
  .el-badge {
    width: 100%;
    aspect-ratio: 16 / 9;
  }
  &.transition {
    position: absolute;
  }
}

.btn-box {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
}

.setting-dialog {
  :deep() {
    .el-dialog {
      border-radius: 20px;
    }
  }
}

.row {
  margin-bottom: 10px;
  .lable {
    margin-bottom: 4px;
    font-size: 12px;
    color: var(--color-text-soft);
  }
}

.center-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.button-box {
  margin-top: 20px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  .el-button {
    display: flex;
    margin: 0;
  }
}
</style>
