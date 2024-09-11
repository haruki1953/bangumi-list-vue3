<script setup lang="ts">
import { nextTick } from 'vue'
import { ref, type ComponentPublicInstance } from 'vue'

const imgIndex = defineModel<number>('index')

const props = withDefaults(
  defineProps<{
    data: string[]
    backgroundColor?: '' | 'soft'
    notPreview?: boolean
    mini?: boolean
  }>(),
  {
    backgroundColor: '',
    notPreview: false,
    mini: false
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

  if (props.mini) {
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

const onImgClick = (num: number) => {
  if (imgIndex.value === undefined) {
    return
  }
  imgIndex.value = num
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
        <el-image
          class="post-img img1-1"
          fit="cover"
          ref="img1"
          @load="img1Load"
          :key="data[0]"
          :src="data[0]"
          @click="onImgClick(0)"
          :initial-index="0"
          :preview-src-list="data"
          hide-on-click-modal
          preview-teleported
        ></el-image>
      </el-col>
    </el-row>

    <el-row v-else-if="data.length === 2">
      <el-col :span="12">
        <el-image
          class="post-img img2-1"
          fit="cover"
          :src="data[0]"
          @click="onImgClick(0)"
          :class="{ 'is-index': isIndex(0) }"
          :initial-index="0"
          :preview-src-list="data"
          hide-on-click-modal
          preview-teleported
        ></el-image>
      </el-col>
      <el-col :span="12">
        <el-image
          class="post-img img2-2"
          fit="cover"
          :src="data[1]"
          @click="onImgClick(1)"
          :class="{ 'is-index': isIndex(1) }"
          :initial-index="1"
          :preview-src-list="data"
          hide-on-click-modal
          preview-teleported
        ></el-image>
      </el-col>
    </el-row>

    <el-row v-else-if="data.length === 3">
      <el-col :span="12">
        <el-image
          class="post-img img3-1"
          fit="cover"
          :src="data[0]"
          @click="onImgClick(0)"
          :class="{ 'is-index': isIndex(0) }"
          :initial-index="0"
          :preview-src-list="data"
          hide-on-click-modal
          preview-teleported
        ></el-image>
      </el-col>
      <el-col :span="12">
        <el-image
          class="post-img img3-2"
          fit="cover"
          :src="data[1]"
          @click="onImgClick(1)"
          :class="{ 'is-index': isIndex(1) }"
          :initial-index="1"
          :preview-src-list="data"
          hide-on-click-modal
          preview-teleported
        ></el-image>
        <el-image
          class="post-img img3-3"
          fit="cover"
          :src="data[2]"
          @click="onImgClick(2)"
          :class="{ 'is-index': isIndex(2) }"
          :initial-index="2"
          :preview-src-list="data"
          hide-on-click-modal
          preview-teleported
        ></el-image>
      </el-col>
    </el-row>

    <el-row v-else>
      <el-col :span="12">
        <el-image
          class="post-img img4-1"
          fit="cover"
          :src="data[0]"
          @click="onImgClick(0)"
          :class="{ 'is-index': isIndex(0) }"
          :initial-index="0"
          :preview-src-list="data"
          hide-on-click-modal
          preview-teleported
        ></el-image>
        <el-image
          class="post-img img4-3"
          fit="cover"
          :src="data[2]"
          @click="onImgClick(2)"
          :class="{ 'is-index': isIndex(2) }"
          :initial-index="2"
          :preview-src-list="data"
          hide-on-click-modal
          preview-teleported
        ></el-image>
      </el-col>
      <el-col :span="12">
        <el-image
          class="post-img img4-2"
          fit="cover"
          :src="data[1]"
          @click="onImgClick(1)"
          :class="{ 'is-index': isIndex(1) }"
          :initial-index="1"
          :preview-src-list="data"
          hide-on-click-modal
          preview-teleported
        ></el-image>
        <el-image
          class="post-img img4-4"
          fit="cover"
          :src="data[3]"
          @click="onImgClick(3)"
          :class="{ 'is-index': isIndex(3) }"
          :initial-index="3"
          :preview-src-list="data"
          hide-on-click-modal
          preview-teleported
        ></el-image>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
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
