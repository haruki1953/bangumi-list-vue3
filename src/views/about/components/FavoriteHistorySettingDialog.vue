<script setup lang="ts">
import { useFavoriteStore, useHistoryStore } from '@/stores'
import {
  generateRandomClassName,
  sakiMessage,
  useDialogOptimization
} from '@/utils'
import { Delete } from '@element-plus/icons-vue'
import { useWindowSize } from '@vueuse/core'
import { computed, ref } from 'vue'

const dialogVisible = ref(false)

const open = () => {
  dialogVisible.value = true
}

defineExpose({
  open
})

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

const favoriteStore = useFavoriteStore()
const favoriteLimit = ref(favoriteStore.limitLength)
const favoriteMax = ref(favoriteStore.maxLength)
const setFavorite = () => {
  favoriteStore.setLimit(favoriteLimit.value, favoriteMax.value)
}
const removeFavorite = () => {
  sakiMessage({
    type: 'success',
    offset: 66,
    message: '收藏已清空'
  })
  favoriteStore.removeFav()
}

const historyStore = useHistoryStore()
const historyLimit = ref(historyStore.limitLength)
const historyMax = ref(historyStore.maxLength)
const setHistory = () => {
  historyStore.setLimit(historyLimit.value, historyMax.value)
}
const removeHistory = () => {
  sakiMessage({
    type: 'success',
    offset: 66,
    message: '记录已清空'
  })
  historyStore.removeBgm()
}
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
        <div class="lable">番剧收藏数量限制</div>
        <el-row :gutter="20" style="align-items: center">
          <el-col :span="8">
            <el-checkbox
              v-model="favoriteLimit"
              label="启用"
              @change="setFavorite"
            />
          </el-col>
          <el-col :span="16">
            <el-input-number
              v-model="favoriteMax"
              :step="1"
              step-strictly
              :min="1"
              :disabled="!favoriteLimit"
              size="small"
              @change="setFavorite"
            ></el-input-number>
          </el-col>
        </el-row>
        <el-button
          type="warning"
          size="small"
          round
          :icon="Delete"
          style="margin-top: 10px"
          @click="removeFavorite"
        >
          清空番剧收藏
        </el-button>
      </div>
      <div class="row center-box">
        <div class="lable">浏览记录数量限制</div>
        <el-row :gutter="20" style="align-items: center">
          <el-col :span="8">
            <el-checkbox
              v-model="historyLimit"
              label="启用"
              @change="setHistory"
            />
          </el-col>
          <el-col :span="16">
            <el-input-number
              v-model="historyMax"
              :step="1"
              step-strictly
              :min="1"
              :disabled="!historyLimit"
              size="small"
              @change="setHistory"
            ></el-input-number>
          </el-col>
        </el-row>
        <el-button
          type="info"
          size="small"
          round
          :icon="Delete"
          style="margin-top: 10px"
          @click="removeHistory"
        >
          清空浏览记录
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
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
