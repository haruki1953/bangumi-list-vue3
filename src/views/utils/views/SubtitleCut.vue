<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { UploadUserFile } from 'element-plus'
import {
  Setting,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  ArrowRight
} from '@element-plus/icons-vue'
import { useSubtitleCutService } from '../services'
import ImageUploadSelecter from '../components/ImageUploadSelecter.vue'
import ImageGroup from '../components/ImageGroup.vue'
import { useWindowSize, useIntervalFn } from '@vueuse/core'
import {
  subCutDemoAl1,
  subCutDemoAl2,
  subCutDemoBq1,
  subCutDemoBq2,
  subCutDemoTz1,
  subCutDemoTz2
} from '../assets'
import { useUtilsStore } from '../stores'
import { generateRandomClassName, useDialogOptimization } from '@/utils'

const alt = undefined

// 演示图片，定时切换
const subCutDemoGroupBq = [
  {
    src: subCutDemoBq1,
    alt
  },
  {
    src: subCutDemoBq2
  }
]
const subCutDemoGroupTz = [
  {
    src: subCutDemoTz1,
    alt
  },
  {
    src: subCutDemoTz2
  }
]
const subCutDemoGroupAl = [
  {
    src: subCutDemoAl1,
    alt
  },
  {
    src: subCutDemoAl2
  }
]

const allDemoGroup = {
  subCutDemoGroupBq,
  subCutDemoGroupTz,
  subCutDemoGroupAl
}
const strings = [
  'subCutDemoGroupBq',
  'subCutDemoGroupTz',
  'subCutDemoGroupAl'
] as const
type StringType = (typeof strings)[number]
const currentString = ref<StringType>(strings[0])
let index = 0
useIntervalFn(() => {
  index = (index + 1) % strings.length
  currentString.value = strings[index]
}, 10000) // 切换
const autoDemoGroup = computed(() => {
  return allDemoGroup[currentString.value]
})

const upFiles = ref<UploadUserFile[]>([])
const mergedImage = ref<string | null>(null)
const isMerging = ref(false)

const utilsStore = useUtilsStore()

// 配置项
const imageType = ref(utilsStore.subCutSetting.imageType)
const imageQuality = ref(utilsStore.subCutSetting.imageQuality)
const imageMergeGap = ref(utilsStore.subCutSetting.mergeGap)
const cropRangePercent = ref<[number, number]>([
  utilsStore.subCutSetting.cropRangeMin,
  utilsStore.subCutSetting.cropRangeMax
])
const dontCropFirstSub = ref(utilsStore.subCutSetting.dontCropFirstSub)
const isEnabledRatioCrop = ref(utilsStore.subCutSetting.enabledCropRatio)
const widthRatioForCrop = ref(utilsStore.subCutSetting.corpWidthRatio)
const heightRatioForCrop = ref(utilsStore.subCutSetting.corpHeightRatio)

// 在图片生成成功时，保存配置项至store
const saveSetting = () => {
  const cropRangeInfo = calcCropRangePercent()
  utilsStore.saveSubCutSetting({
    imageType: imageType.value,
    imageQuality: imageQuality.value,
    mergeGap: imageMergeGap.value,
    dontCropFirstSub: dontCropFirstSub.value,
    enabledCropRatio: isEnabledRatioCrop.value,
    corpWidthRatio: widthRatioForCrop.value,
    corpHeightRatio: heightRatioForCrop.value,
    cropRangeMax: cropRangeInfo.max,
    cropRangeMin: cropRangeInfo.min
  })
}
const resetSetting = () => {
  utilsStore.resetSubCutSetting()
  const dSCS = utilsStore.defaultSubCutSetting()
  imageType.value = dSCS.imageType
  imageQuality.value = dSCS.imageQuality
  imageMergeGap.value = dSCS.mergeGap
  dontCropFirstSub.value = dSCS.dontCropFirstSub
  isEnabledRatioCrop.value = dSCS.enabledCropRatio
  widthRatioForCrop.value = dSCS.corpWidthRatio
  heightRatioForCrop.value = dSCS.corpHeightRatio
  cropRangePercent.value = [dSCS.cropRangeMin, dSCS.cropRangeMax]
}

//
const sliderRange = ref({ min: 0, max: 30 })

const calcCropRangePercent = () => {
  const [minValue, maxValue] = cropRangePercent.value
  return {
    max: Math.max(minValue, maxValue),
    min: Math.min(minValue, maxValue),
    difference: Math.abs(maxValue - minValue)
  }
}
const changeSliderRange = () => {
  let { min, max } = calcCropRangePercent()
  if (max >= 30) {
    max = 100
  } else {
    max = 30
  }
  if (min <= 70) {
    min = 0
  } else {
    min = 70
  }
  sliderRange.value = { min, max }
}

const { mergeImages, clearImages, copyImage, saveImage } =
  useSubtitleCutService({
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
  })

const couldShowClearBtn = computed(() => {
  if (upFiles.value.length === 0 && mergedImage.value === null) {
    return false
  }
  return true
})
const couldShowMergeBtn = computed(() => {
  if (upFiles.value.length === 0) {
    return false
  }
  return true
})
const couldShowControl = couldShowClearBtn

const dialogVisible = ref(false)

// 自定义遮罩类名，随机生成
const overlayClass = generateRandomClassName()
// 对话框优化
const { dialogWidth } = useDialogOptimization({
  dialogVisible,
  overlayClass
})
</script>

<template>
  <div class="subtitle-cut-util">
    <div class="setting-dialog">
      <el-dialog
        v-model="dialogVisible"
        :width="dialogWidth"
        :lock-scroll="false"
        :modal-class="overlayClass"
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
        <div class="row center-box">
          <div class="lable">是否不拼接首个字幕</div>
          <div class="input-box">
            <el-checkbox
              v-model="dontCropFirstSub"
              label="启用 将剪切第一张图片底部"
            />
          </div>
        </div>
        <div class="row center-box">
          <el-tooltip
            placement="top"
            effect="light"
            content="用于消除手机截屏两侧的黑边"
          >
            <div class="lable">将图片裁剪为固定比例</div>
          </el-tooltip>
          <el-row :gutter="20" style="align-items: center">
            <el-col :span="8">
              <el-checkbox v-model="isEnabledRatioCrop" label="启用" />
            </el-col>
            <el-col :span="16">
              <div class="input-box">
                <el-input-number
                  v-model="widthRatioForCrop"
                  :step="1"
                  step-strictly
                  :min="1"
                  :disabled="!isEnabledRatioCrop"
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
                  v-model="heightRatioForCrop"
                  :step="1"
                  step-strictly
                  :min="1"
                  :disabled="!isEnabledRatioCrop"
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
    <h2>图片字幕拼接🎬</h2>
    <div>
      <el-row class="demo">
        <el-col :md="couldShowControl ? 24 : 12">
          <ImageUploadSelecter
            v-model="upFiles"
            key="ImageUploadSelecter"
          ></ImageUploadSelecter>
        </el-col>
        <el-col :md="12" v-if="!couldShowControl">
          <div class="demonstrate-center">
            <div class="demonstrate-box">
              <Transition name="fade-slide" mode="out-in">
                <div
                  class="demonstrate transition"
                  :key="autoDemoGroup.map((i) => i.src).toString()"
                >
                  <el-badge value="示例" type="primary" :offset="[-35, 15]">
                    <ImageGroup
                      :data="autoDemoGroup"
                      backgroundColor="soft"
                    ></ImageGroup>
                  </el-badge>
                </div>
              </Transition>
            </div>
          </div>
        </el-col>
        <el-col :span="24" v-else>
          <div>
            <div class="crop-height-slider-lable">
              <span> 字幕截取高度 </span>
              <el-button
                round
                size="small"
                type="info"
                :icon="Setting"
                @click="dialogVisible = true"
              >
                更多设置
              </el-button>
            </div>
            <el-slider
              class="crop-height-slider"
              v-model="cropRangePercent"
              range
              @change="changeSliderRange"
              :min="sliderRange.min"
              :max="sliderRange.max"
              :marks="{
                10: '10%',
                20: '20%',
                50: '50%',
                80: '80%',
                90: '90%'
              }"
            />
          </div>
          <div class="btn-box">
            <el-button
              type="warning"
              @click="mergeImages"
              :loading="isMerging"
              v-if="couldShowMergeBtn"
            >
              生成
            </el-button>
            <template v-if="mergedImage">
              <el-button type="info" @click="copyImage"> 复制 </el-button>
              <el-button type="success" @click="saveImage"> 保存 </el-button>
            </template>
            <el-button
              type="danger"
              @click="clearImages"
              v-if="couldShowClearBtn"
            >
              清空
            </el-button>
          </div>
          <div class="merged-image-box" v-if="mergedImage">
            <el-image class="merged-image" :src="mergedImage" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.subtitle-cut-util {
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
  .el-row.demo {
    align-items: center;
  }
}

.crop-height-slider-lable {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .el-checkbox {
    transition: all 0.5s;
    :deep() {
      :not(.is-checked) .el-checkbox__inner {
        background-color: transparent;
      }
    }
  }
}
.crop-height-slider {
  margin-bottom: 30px;
  transition: all 0.5s;
  :deep() {
    .el-slider__runway {
      transition: all 0.5s;
    }
    .el-slider__marks-text {
      color: var(--color-text);
    }
  }
}
.btn-box {
  display: flex;
  justify-content: center;
  margin: 10px 10px 0 10px;
}
.merged-image-box {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  .merged-image {
    border-radius: 20px;
  }
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
</style>
