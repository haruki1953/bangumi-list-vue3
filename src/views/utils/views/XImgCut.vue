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
  Setting,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  ArrowRight
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

import ImageGroup from '../components/ImageGroup.vue'
import ImageUploadSelecter from '../components/ImageUploadSelecter.vue'
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
import { useUtilsStore } from '../stores'

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

const utilsStore = useUtilsStore()

// 配置项
const imageType = ref(utilsStore.xImgCutSetting.imageType)
const imageQuality = ref(utilsStore.xImgCutSetting.imageQuality)
const imageMergeGap = ref(utilsStore.xImgCutSetting.mergeGap)
const enabledMainRatio = ref(utilsStore.xImgCutSetting.enabledMainRatio)
const mainWidthRatio = ref(utilsStore.xImgCutSetting.mainWidthRatio)
const mainHeightRatio = ref(utilsStore.xImgCutSetting.mainHeightRatio)
const enabledSecondaryRatio = ref(
  utilsStore.xImgCutSetting.enabledSecondaryRatio
)
const secondaryWidthRatio = ref(utilsStore.xImgCutSetting.secondaryWidthRatio)
const secondaryHeightRatio = ref(utilsStore.xImgCutSetting.secondaryHeightRatio)
// 在图片生成成功时，保存配置项至store
const saveSetting = () => {
  utilsStore.saveXImgCutSetting({
    imageType: imageType.value,
    imageQuality: imageQuality.value,
    mergeGap: imageMergeGap.value,
    enabledMainRatio: enabledMainRatio.value,
    mainWidthRatio: mainWidthRatio.value,
    mainHeightRatio: mainHeightRatio.value,
    enabledSecondaryRatio: enabledSecondaryRatio.value,
    secondaryWidthRatio: secondaryWidthRatio.value,
    secondaryHeightRatio: secondaryHeightRatio.value
  })
}
// 在点击重置按钮时，重置组件配置项，并重置store中的值
const resetSetting = () => {
  utilsStore.resetXImgCutSetting()
  const dXICS = utilsStore.defaultXImgCutSetting()
  imageType.value = dXICS.imageType
  imageQuality.value = dXICS.imageQuality
  imageMergeGap.value = dXICS.mergeGap
  enabledMainRatio.value = dXICS.enabledMainRatio
  mainWidthRatio.value = dXICS.mainWidthRatio
  mainHeightRatio.value = dXICS.mainHeightRatio
  enabledSecondaryRatio.value = dXICS.enabledSecondaryRatio
  secondaryWidthRatio.value = dXICS.secondaryWidthRatio
  secondaryHeightRatio.value = dXICS.secondaryHeightRatio
}

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
  ElMessage({
    type: 'info',
    offset: 66,
    message: '生成中'
  })
  await nextTick()

  try {
    const mainImageEl = await imageLoadImageFromFileService(mainImageFile.value)

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

const dialogVisible = ref(false)

const windowSize = useWindowSize()
const dialogWidth = computed(() => {
  const width = 400
  const windowWidth = windowSize.width.value
  return windowWidth * 0.9 < width ? '90%' : width
})
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
          <div class="lable">图片格式</div>
          <div class="input-box">
            <el-radio-group v-model="imageType" size="small">
              <el-radio value="image/png">png</el-radio>
              <el-radio value="image/jpeg">jpg</el-radio>
              <el-radio value="image/webp">webp</el-radio>
            </el-radio-group>
          </div>
        </div>
        <Transition name="fade-slide">
          <div
            class="row center-box"
            v-show="imageType === 'image/jpeg' || imageType === 'image/webp'"
            style="margin-top: -8px"
          >
            <div class="lable">图片质量</div>
            <div class="input-box">
              <el-input-number
                v-model="imageQuality"
                size="small"
                step-strictly
                :step="0.01"
                :precision="2"
                :min="0.01"
                :max="1"
              />
            </div>
          </div>
        </Transition>
        <div class="row center-box">
          <div class="lable">图片拼接间隔（单位px）</div>
          <div class="input-box">
            <el-input-number
              v-model="imageMergeGap"
              :step="1"
              step-strictly
              size="small"
            />
          </div>
        </div>
        <!-- 主图比例约束 -->
        <div class="row center-box">
          <el-tooltip placement="top" effect="light">
            <template #content>
              请在四分与三分模式时保持为16比9，否则将错位<br />
              在二分时设置为15比9左右可优化在推特的显示效果（防止边缘溢出）
            </template>
            <div class="lable">主图比例约束</div>
          </el-tooltip>
          <el-row :gutter="20" style="align-items: center">
            <el-col :span="8">
              <el-checkbox v-model="enabledMainRatio" label="启用" />
            </el-col>
            <el-col :span="16">
              <div class="input-box">
                <el-input-number
                  v-model="mainWidthRatio"
                  :step="1"
                  step-strictly
                  :min="1"
                  :disabled="!enabledMainRatio"
                  size="small"
                >
                  <template #decrease-icon>
                    <el-icon>
                      <ArrowLeft />
                    </el-icon>
                  </template>
                  <template #increase-icon>
                    <el-icon>
                      <ArrowRight />
                    </el-icon>
                  </template>
                </el-input-number>
              </div>
              <div class="input-box" style="margin-top: 8px">
                <el-input-number
                  v-model="mainHeightRatio"
                  :step="1"
                  step-strictly
                  :min="1"
                  :disabled="!enabledMainRatio"
                  size="small"
                >
                  <template #decrease-icon>
                    <el-icon>
                      <ArrowDown />
                    </el-icon>
                  </template>
                  <template #increase-icon>
                    <el-icon>
                      <ArrowUp />
                    </el-icon>
                  </template>
                </el-input-number>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- 副图比例约束 -->
        <div class="row center-box">
          <el-tooltip
            placement="top"
            effect="light"
            content="如果上下两张图片比例不一致，请保持启用"
          >
            <div class="lable">副图比例约束</div>
          </el-tooltip>
          <el-row :gutter="20" style="align-items: center">
            <el-col :span="8">
              <el-checkbox v-model="enabledSecondaryRatio" label="启用" />
            </el-col>
            <el-col :span="16">
              <div class="input-box">
                <el-input-number
                  v-model="secondaryWidthRatio"
                  :step="1"
                  step-strictly
                  :min="1"
                  :disabled="!enabledSecondaryRatio"
                  size="small"
                >
                  <template #decrease-icon>
                    <el-icon>
                      <ArrowLeft />
                    </el-icon>
                  </template>
                  <template #increase-icon>
                    <el-icon>
                      <ArrowRight />
                    </el-icon>
                  </template>
                </el-input-number>
              </div>
              <div class="input-box" style="margin-top: 8px">
                <el-input-number
                  v-model="secondaryHeightRatio"
                  :step="1"
                  step-strictly
                  :min="1"
                  :disabled="!enabledSecondaryRatio"
                  size="small"
                >
                  <template #decrease-icon>
                    <el-icon>
                      <ArrowDown />
                    </el-icon>
                  </template>
                  <template #increase-icon>
                    <el-icon>
                      <ArrowUp />
                    </el-icon>
                  </template>
                </el-input-number>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="button-box">
          <el-button type="info" size="small" round @click="resetSetting">
            重置
          </el-button>
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
              生成
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
  margin-bottom: 20px;
  .lable {
    margin-bottom: 4px;
    font-size: 12px;
    color: var(--color-text-soft);
  }
}

.input-box {
  :deep() {
    .el-radio--small {
      height: 16px;
    }
    .el-checkbox {
      height: 20px;
    }
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
