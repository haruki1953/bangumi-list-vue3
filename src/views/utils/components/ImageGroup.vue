<script setup lang="ts">
import { useImageViewerOptimization } from '@/utils'
import { computed } from 'vue'
import { nextTick } from 'vue'
import { ref, type ComponentPublicInstance } from 'vue'
import type { Image } from '../types'
import { useUtilsStore } from '../stores'

const imgIndex = defineModel<number>('index')

const props = withDefaults(
  defineProps<{
    data: Image[]
    backgroundColor?: '' | 'soft'
    notPreview?: boolean
    mini?: boolean
    aspectRatio169?: boolean
    notAlt?: boolean
  }>(),
  {
    backgroundColor: '',
    notPreview: false,
    mini: false,
    aspectRatio169: false,
    notAlt: false
  }
)

const img1 = ref<ComponentPublicInstance | null>(null)

const img1Load = async () => {
  await nextTick()
  if (!img1.value) return
  const imgEl = img1.value.$el as HTMLElement

  // width / height
  const maxRatio = 4 / 5
  const minRatio = 4 / 1
  const normalRatio = 16 / 9

  const width = imgEl.offsetWidth
  const height = imgEl.offsetHeight

  const maxHeight = width / maxRatio
  const minHeight = width / minRatio
  const normalHeight = width / normalRatio

  if (props.aspectRatio169) {
    imgEl.style.setProperty('aspect-ratio', '16 / 9')
  } else if (props.mini) {
    if (height > normalHeight) {
      imgEl.style.setProperty('aspect-ratio', '16 / 9')
    } else if (height < minHeight) {
      imgEl.style.setProperty('aspect-ratio', '4 / 1')
    }
  } else {
    if (height > maxHeight) {
      imgEl.style.setProperty('aspect-ratio', '4 / 5')
    } else if (height < minHeight) {
      imgEl.style.setProperty('aspect-ratio', '4 / 1')
    }
  }
}

const isIndex = (num: number) => {
  if (num === imgIndex.value) {
    return true
  } else {
    return false
  }
}

const previewSrcList = computed(() => {
  if (props.notPreview) {
    return undefined
  } else {
    return props.data.map((i) => i.src)
  }
})

const onImgClick = (num: number) => {
  if (imgIndex.value === undefined) {
    return
  }
  imgIndex.value = num
}

// 图片预览优化
const imageViewerOptimization = useImageViewerOptimization()
const onViewerShow = imageViewerOptimization.enableOnViewerShow
const onViewerClose = imageViewerOptimization.disableOnViewerClose

const utilsStore = useUtilsStore()

// alt点击
const onAltClick = (num: number) => {
  utilsStore.openAltDialog(props.data[num])
}
</script>
<template>
  <div
    class="image-group"
    :class="{ 'img-background-soft': backgroundColor === 'soft' }"
    v-if="data.length > 0"
  >
    <el-row v-if="data.length === 1">
      <el-col :span="24">
        <div class="image-box">
          <el-image
            class="post-img img1-1"
            fit="cover"
            ref="img1"
            @load="img1Load"
            :key="data[0].src"
            :src="data[0].src"
            :alt="data[0].alt"
            @click="onImgClick(0)"
            :initial-index="0"
            :preview-src-list="previewSrcList"
            hide-on-click-modal
            @close="onViewerClose"
            @show="onViewerShow"
            preview-teleported
          ></el-image>
          <div
            class="alt-btn"
            v-if="!notAlt && data[0].alt"
            @click="onAltClick(0)"
          >
            ALT
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row v-else-if="data.length === 2">
      <el-col :span="12">
        <div class="image-box">
          <el-image
            class="post-img img2-1"
            fit="cover"
            :src="data[0].src"
            :alt="data[0].alt"
            @click="onImgClick(0)"
            :class="{ 'is-index': isIndex(0) }"
            :initial-index="0"
            :preview-src-list="previewSrcList"
            hide-on-click-modal
            @close="onViewerClose"
            @show="onViewerShow"
            preview-teleported
          ></el-image>
          <div
            class="alt-btn"
            v-if="!notAlt && data[0].alt"
            @click="onAltClick(0)"
          >
            ALT
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="image-box">
          <el-image
            class="post-img img2-2"
            fit="cover"
            :src="data[1].src"
            :alt="data[1].alt"
            @click="onImgClick(1)"
            :class="{ 'is-index': isIndex(1) }"
            :initial-index="1"
            :preview-src-list="previewSrcList"
            hide-on-click-modal
            @close="onViewerClose"
            @show="onViewerShow"
            preview-teleported
          ></el-image>
          <div
            class="alt-btn"
            v-if="!notAlt && data[1].alt"
            @click="onAltClick(1)"
          >
            ALT
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row v-else-if="data.length === 3">
      <el-col :span="12">
        <div class="image-box">
          <el-image
            class="post-img img3-1"
            fit="cover"
            :src="data[0].src"
            :alt="data[0].alt"
            @click="onImgClick(0)"
            :class="{ 'is-index': isIndex(0) }"
            :initial-index="0"
            :preview-src-list="previewSrcList"
            hide-on-click-modal
            @close="onViewerClose"
            @show="onViewerShow"
            preview-teleported
          ></el-image>
          <div
            class="alt-btn"
            v-if="!notAlt && data[0].alt"
            @click="onAltClick(0)"
          >
            ALT
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="image-box">
          <el-image
            class="post-img img3-2"
            fit="cover"
            :src="data[1].src"
            :alt="data[1].alt"
            @click="onImgClick(1)"
            :class="{ 'is-index': isIndex(1) }"
            :initial-index="1"
            :preview-src-list="previewSrcList"
            hide-on-click-modal
            @close="onViewerClose"
            @show="onViewerShow"
            preview-teleported
          ></el-image>
          <div
            class="alt-btn"
            v-if="!notAlt && data[1].alt"
            @click="onAltClick(1)"
          >
            ALT
          </div>
        </div>
        <div class="image-box">
          <el-image
            class="post-img img3-3"
            fit="cover"
            :src="data[2].src"
            :alt="data[2].alt"
            @click="onImgClick(2)"
            :class="{ 'is-index': isIndex(2) }"
            :initial-index="2"
            :preview-src-list="previewSrcList"
            hide-on-click-modal
            @close="onViewerClose"
            @show="onViewerShow"
            preview-teleported
          ></el-image>
          <div
            class="alt-btn"
            v-if="!notAlt && data[2].alt"
            @click="onAltClick(2)"
          >
            ALT
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row v-else>
      <el-col :span="12">
        <div class="image-box">
          <el-image
            class="post-img img4-1"
            fit="cover"
            :src="data[0].src"
            :alt="data[0].alt"
            @click="onImgClick(0)"
            :class="{ 'is-index': isIndex(0) }"
            :initial-index="0"
            :preview-src-list="previewSrcList"
            hide-on-click-modal
            @close="onViewerClose"
            @show="onViewerShow"
            preview-teleported
          ></el-image>
          <div
            class="alt-btn"
            v-if="!notAlt && data[0].alt"
            @click="onAltClick(0)"
          >
            ALT
          </div>
        </div>
        <div class="image-box">
          <el-image
            class="post-img img4-3"
            fit="cover"
            :src="data[2].src"
            :alt="data[2].alt"
            @click="onImgClick(2)"
            :class="{ 'is-index': isIndex(2) }"
            :initial-index="2"
            :preview-src-list="previewSrcList"
            hide-on-click-modal
            @close="onViewerClose"
            @show="onViewerShow"
            preview-teleported
          ></el-image>
          <div
            class="alt-btn"
            v-if="!notAlt && data[2].alt"
            @click="onAltClick(2)"
          >
            ALT
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="image-box">
          <el-image
            class="post-img img4-2"
            fit="cover"
            :src="data[1].src"
            :alt="data[1].alt"
            @click="onImgClick(1)"
            :class="{ 'is-index': isIndex(1) }"
            :initial-index="1"
            :preview-src-list="previewSrcList"
            hide-on-click-modal
            @close="onViewerClose"
            @show="onViewerShow"
            preview-teleported
          ></el-image>
          <div
            class="alt-btn"
            v-if="!notAlt && data[1].alt"
            @click="onAltClick(1)"
          >
            ALT
          </div>
        </div>
        <div class="image-box">
          <el-image
            class="post-img img4-4"
            fit="cover"
            :src="data[3].src"
            :alt="data[3].alt"
            @click="onImgClick(3)"
            :class="{ 'is-index': isIndex(3) }"
            :initial-index="3"
            :preview-src-list="previewSrcList"
            hide-on-click-modal
            @close="onViewerClose"
            @show="onViewerShow"
            preview-teleported
          ></el-image>
          <div
            class="alt-btn"
            v-if="!notAlt && data[3].alt"
            @click="onAltClick(3)"
          >
            ALT
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.image-box {
  position: relative;
  .alt-btn {
    position: absolute;
    width: 40px;
    height: 20px;
    left: 12px;
    bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 20px;
    font-size: 13px;
    font-weight: bold;
    color: rgb(255, 255, 255);
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    cursor: pointer;
    user-select: none;
    transition: transform 0.2s;
    &:hover {
      transform: scale(1.1, 1.1);
    }
  }
}
.post-img {
  display: block;
  width: 100%;
  --aspect-ratio-val: 16 / 9;
  --border-radius-val: 20px;
  aspect-ratio: var(--aspect-ratio-val);
  border-radius: var(--border-radius-val);
  border: 1px solid var(--color-background);
  transition: border 0.5s;
  user-select: none;
  :deep() {
    .el-image__inner.is-loading {
      width: 100%;
      aspect-ratio: var(--aspect-ratio-val);
    }
    .el-image__placeholder,
    .el-image__error {
      position: static;
      width: 100%;
      border-radius: var(--border-radius-val);
      aspect-ratio: var(--aspect-ratio-val);
      transition: background-color 0.5s;
      background-color: var(--color-background);
    }
  }
  &.is-index::before {
    content: '';
    border-radius: var(--border-radius-val);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow:
      0 0 3px 3px var(--el-color-primary),
      0 0 3px 3px var(--el-color-primary) inset;
    pointer-events: none; /* 让阴影不影响鼠标交互 */
    z-index: 1; /* 将阴影置于图片上方 */
  }
}
.img-background-soft .post-img {
  :deep() {
    .el-image__placeholder,
    .el-image__error {
      background-color: var(--color-background-soft);
    }
  }
}

.img1-1 {
  aspect-ratio: unset;
}
.img2-1 {
  --aspect-ratio-val: 8 / 9;
  --border-radius-val: 20px 0 0 20px;
}
.img2-2 {
  --aspect-ratio-val: 8 / 9;
  --border-radius-val: 0 20px 20px 0;
}
.img3-1 {
  --aspect-ratio-val: 8 / 9;
  --border-radius-val: 20px 0 0 20px;
}
.img3-2 {
  --aspect-ratio-val: 16 / 9;
  --border-radius-val: 0 20px 0 0;
}
.img3-3 {
  --aspect-ratio-val: 16 / 9;
  --border-radius-val: 0 0 20px 0;
}
.img4-1 {
  --aspect-ratio-val: 16 / 9;
  --border-radius-val: 20px 0 0 0;
}
.img4-2 {
  --aspect-ratio-val: 16 / 9;
  --border-radius-val: 0 20px 0 0;
}
.img4-3 {
  --aspect-ratio-val: 16 / 9;
  --border-radius-val: 0 0 0 20px;
}
.img4-4 {
  --aspect-ratio-val: 16 / 9;
  --border-radius-val: 0 0 20px 0;
}
</style>
