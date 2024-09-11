<script lang="ts" setup>
import { Plus, Loading } from '@element-plus/icons-vue'

import xImgCutDemonstrateLB from '@/assets/x-img-cut-demonstrate/x-img-cut-small-lb.jpg'
import xImgCutDemonstrateLT from '@/assets/x-img-cut-demonstrate/x-img-cut-small-lt.jpg'
import xImgCutDemonstrateRB from '@/assets/x-img-cut-demonstrate/x-img-cut-small-rb.jpg'
import xImgCutDemonstrateRT from '@/assets/x-img-cut-demonstrate/x-img-cut-small-rt.jpg'
import ImageGroup from './ImageGroup.vue'
import ImageUploadSelecter from './ImageUploadSelecter.vue'
import type { UploadFile, UploadUserFile } from 'element-plus'
import { ref } from 'vue'
import { computed } from 'vue'
import { nextTick } from 'vue'

const xImgCutDemonstrateGroup = [
  xImgCutDemonstrateLT,
  xImgCutDemonstrateRT,
  xImgCutDemonstrateLB,
  xImgCutDemonstrateRB
]

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
  return null
})

const mergedImageLT = ref<string | null>(null)
const mergedImageRT = ref<string | null>(null)
const mergedImageLB = ref<string | null>(null)
const mergedImageRB = ref<string | null>(null)

const isMerging = ref(false)

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
  if (
    !(
      mergedImageLT.value &&
      mergedImageRT.value &&
      mergedImageLB.value &&
      mergedImageRB.value
    )
  ) {
    return
  }
  saveImage(mergedImageLT.value, 'LeftTop')
  saveImage(mergedImageRT.value, 'RightTop')
  saveImage(mergedImageLB.value, 'LeftBottom')
  saveImage(mergedImageRB.value, 'RightBottom')
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

  const imageEl = await loadImageFromFile(mainImageFile.value)

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d', {
    willReadFrequently: true
  }) as CanvasRenderingContext2D

  // 获取主图的原始尺寸
  const originalWidth = imageEl.width
  const originalHeight = imageEl.height

  // 计算裁剪的 16:9 区域
  const targetAspectRatio = 16 / 9
  let cropWidth = originalWidth
  let cropHeight = originalHeight

  if (originalWidth / originalHeight > targetAspectRatio) {
    cropWidth = originalHeight * targetAspectRatio
  } else {
    cropHeight = originalWidth / targetAspectRatio
  }

  const cropX = (originalWidth - cropWidth) / 2
  const cropY = (originalHeight - cropHeight) / 2

  canvas.width = cropWidth
  canvas.height = cropHeight

  // 裁剪主图并绘制到 canvas
  context.drawImage(
    imageEl,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  )

  // 放大图片两倍
  const scaledCanvas = document.createElement('canvas')
  scaledCanvas.width = cropWidth * 2
  scaledCanvas.height = cropHeight * 2
  const scaledContext = scaledCanvas.getContext(
    '2d'
  ) as CanvasRenderingContext2D

  scaledContext.scale(2, 2)
  scaledContext.drawImage(canvas, 0, 0)

  const halfWidth = scaledCanvas.width / 2
  const halfHeight = scaledCanvas.height / 2

  // 创建切片 canvas
  const partLTCanvas = document.createElement('canvas')
  const partRTCanvas = document.createElement('canvas')
  const partLBCanvas = document.createElement('canvas')
  const partRBCanvas = document.createElement('canvas')

  partLTCanvas.width =
    partRTCanvas.width =
    partLBCanvas.width =
    partRBCanvas.width =
      halfWidth
  partLTCanvas.height =
    partRTCanvas.height =
    partLBCanvas.height =
    partRBCanvas.height =
      halfHeight

  const partLTContext = partLTCanvas.getContext('2d', {
    willReadFrequently: true
  }) as CanvasRenderingContext2D
  const partRTContext = partRTCanvas.getContext('2d', {
    willReadFrequently: true
  }) as CanvasRenderingContext2D
  const partLBContext = partLBCanvas.getContext('2d', {
    willReadFrequently: true
  }) as CanvasRenderingContext2D
  const partRBContext = partRBCanvas.getContext('2d', {
    willReadFrequently: true
  }) as CanvasRenderingContext2D

  partLTContext.drawImage(
    scaledCanvas,
    0,
    0,
    halfWidth,
    halfHeight,
    0,
    0,
    halfWidth,
    halfHeight
  )
  partRTContext.drawImage(
    scaledCanvas,
    halfWidth,
    0,
    halfWidth,
    halfHeight,
    0,
    0,
    halfWidth,
    halfHeight
  )
  partLBContext.drawImage(
    scaledCanvas,
    0,
    halfHeight,
    halfWidth,
    halfHeight,
    0,
    0,
    halfWidth,
    halfHeight
  )
  partRBContext.drawImage(
    scaledCanvas,
    halfWidth,
    halfHeight,
    halfWidth,
    halfHeight,
    0,
    0,
    halfWidth,
    halfHeight
  )

  // 辅助函数：裁剪并缩放数组中的图片
  const cropAndScaleImage = async (
    file: UploadFile,
    width: number,
    height: number
  ): Promise<HTMLCanvasElement> => {
    const img = await loadImageFromFile(file)
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = width
    tempCanvas.height = height
    const tempContext = tempCanvas.getContext('2d') as CanvasRenderingContext2D

    // 裁剪为 16:9 并缩放
    const aspectRatio = img.width / img.height
    let sx = 0,
      sy = 0,
      sWidth = img.width,
      sHeight = img.height
    if (aspectRatio > targetAspectRatio) {
      sWidth = img.height * targetAspectRatio
      sx = (img.width - sWidth) / 2
    } else {
      sHeight = img.width / targetAspectRatio
      sy = (img.height - sHeight) / 2
    }

    tempContext.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, width, height)
    return tempCanvas
  }

  // 辅助函数：拼接主图切片与数组中的图片
  const mergeWithArray = async (
    partCanvas: HTMLCanvasElement,
    imagesArray: UploadFile[],
    width: number,
    height: number
  ): Promise<HTMLCanvasElement> => {
    const mergedCanvas = document.createElement('canvas')
    mergedCanvas.width = width
    mergedCanvas.height = height * 3 // 原主切部分+两个拼接部分的高度
    const mergedContext = mergedCanvas.getContext(
      '2d'
    ) as CanvasRenderingContext2D

    if (imagesArray.length > 0) {
      // 第一个图片在上方
      const topImageCanvas = await cropAndScaleImage(
        imagesArray[0],
        width,
        height
      )
      mergedContext.drawImage(topImageCanvas, 0, 0)

      // 主切部分在中间
      mergedContext.drawImage(partCanvas, 0, height)

      // 第二个图片在下方（如果有）
      const bottomImageCanvas = await cropAndScaleImage(
        imagesArray[1] || imagesArray[0],
        width,
        height
      )
      mergedContext.drawImage(bottomImageCanvas, 0, height * 2)
    } else {
      // 没有图片，保持主切部分原样
      mergedCanvas.height = height
      mergedContext.drawImage(partCanvas, 0, 0)
    }

    return mergedCanvas
  }

  // 拼接图片
  const mergedLT = await mergeWithArray(
    partLTCanvas,
    ltImageFiles.value as UploadFile[],
    halfWidth,
    halfHeight
  )
  const mergedRT = await mergeWithArray(
    partRTCanvas,
    rtImageFiles.value as UploadFile[],
    halfWidth,
    halfHeight
  )
  const mergedLB = await mergeWithArray(
    partLBCanvas,
    lbImageFiles.value as UploadFile[],
    halfWidth,
    halfHeight
  )
  const mergedRB = await mergeWithArray(
    partRBCanvas,
    rbImageFiles.value as UploadFile[],
    halfWidth,
    halfHeight
  )

  // 保存最终图片
  mergedImageLT.value = mergedLT.toDataURL('image/png')
  mergedImageRT.value = mergedRT.toDataURL('image/png')
  mergedImageLB.value = mergedLB.toDataURL('image/png')
  mergedImageRB.value = mergedRB.toDataURL('image/png')

  await nextTick()
  ElMessage({
    type: 'success',
    offset: 66,
    message: '生成成功'
  })
  isMerging.value = false
}

function loadImageFromFile(uploadFile: UploadFile): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (!uploadFile.raw) {
      reject(new Error('Invalid file'))
      return
    }
    // 使用 URL.createObjectURL 将文件转换为 URL
    const fileUrl = URL.createObjectURL(uploadFile.raw as File)
    const img = new Image()
    // 图片加载成功时处理
    img.onload = () => {
      // 释放 URL 对象，防止内存泄漏
      URL.revokeObjectURL(fileUrl)
      resolve(img)
    }
    // 图片加载错误时处理
    img.onerror = (err) => {
      URL.revokeObjectURL(fileUrl)
      reject(err)
    }
    // 设置图片的 src
    img.src = fileUrl
  })
}
</script>
<template>
  <div class="ximg-cut-util">
    <h2>推特图片拼接📷</h2>
    <div>
      <div v-if="mergedImageGroup && mainImageFile">
        <div class="image-group-and-buttons">
          <div class="demonstrate">
            <ImageGroup
              :data="mergedImageGroup"
              backgroundcolor="soft"
            ></ImageGroup>
          </div>
          <div class="btn-box">
            <el-button type="warning" @click="mergeImage" :loading="isMerging">
              再次生成
            </el-button>
            <el-button type="success" @click="saveAllImage"> 保存 </el-button>
            <el-button type="danger" @click="clearImages"> 清空 </el-button>
          </div>
        </div>
        <div class="more-image-selsect">
          <el-row :gutter="20">
            <el-col :md="12">
              <h3>↖左上↖</h3>
              <ImageUploadSelecter
                v-model="ltImageFiles"
                :limit="2"
              ></ImageUploadSelecter>
            </el-col>
            <el-col :md="12">
              <h3>↗右上↗</h3>
              <ImageUploadSelecter
                v-model="rtImageFiles"
                :limit="2"
              ></ImageUploadSelecter>
            </el-col>
            <el-col :md="12">
              <h3>↙左下↙</h3>
              <ImageUploadSelecter
                v-model="lbImageFiles"
                :limit="2"
              ></ImageUploadSelecter>
            </el-col>
            <el-col :md="12">
              <h3>↘右下↘</h3>
              <ImageUploadSelecter
                v-model="rbImageFiles"
                :limit="2"
              ></ImageUploadSelecter>
            </el-col>
          </el-row>
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
          </el-col>
          <el-col :md="12">
            <div class="demonstrate">
              <el-badge value="示例" type="primary" :offset="[-35, 15]">
                <ImageGroup
                  :data="xImgCutDemonstrateGroup"
                  backgroundcolor="soft"
                ></ImageGroup>
              </el-badge>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-divider class="utils-divider" />
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
    h3 {
      margin-top: 10px;
      text-align: center;
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

.demonstrate {
  max-width: 500px;
  margin: 10px auto;
}

.btn-box {
  display: flex;
  justify-content: center;
  margin: 10px;
}

.utils-divider {
  transition: all 0.5s;
}
</style>
