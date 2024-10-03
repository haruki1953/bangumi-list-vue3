<script setup lang="ts">
import { useUtilsStore } from '../stores'
import { generateRandomClassName, useDialogOptimization } from '@/utils'
import { useWindowSize } from '@vueuse/core'
import { watch } from 'vue'
import { computed, ref } from 'vue'

const dialogVisible = ref(false)

const windowSize = useWindowSize()
const dialogWidth = computed(() => {
  const width = 400
  const windowWidth = windowSize.width.value
  return windowWidth * 0.9 < width ? '90%' : width
})

// 自定义遮罩类名，随机生成
const overlayClass = generateRandomClassName()

// 对话框优化
useDialogOptimization({
  dialogVisible,
  overlayClass
})

const utilsStore = useUtilsStore()

watch(
  () => utilsStore.altDialogMark,
  () => {
    dialogVisible.value = true
  }
)
</script>
<template>
  <div class="image-alt-dialog">
    <el-dialog
      v-model="dialogVisible"
      :width="dialogWidth"
      :lock-scroll="false"
      :modal-class="overlayClass"
    >
      <div class="row center-box">
        <div class="lable">使用说明</div>
      </div>
      <template v-if="utilsStore.altDialogImageData">
        <div class="content-box">
          <div class="content">
            {{ utilsStore.altDialogImageData.alt || '' }}
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.row {
  margin-bottom: 10px;
  .lable {
    font-size: 12px;
    color: var(--color-text-soft);
  }
}

.center-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content-box {
  display: flex;
  justify-content: center;
  // padding: 0 0 8px 0;
  margin-bottom: 10px;
  .content {
    max-width: 100%;
    color: var(--color-text);
    white-space: pre-wrap;
    // 解决在全英文无空格时，文字无法换行的问题
    word-wrap: break-word;
    transition: all 0.2s;
  }
}
</style>
