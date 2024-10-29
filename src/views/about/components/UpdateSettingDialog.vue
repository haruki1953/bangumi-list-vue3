<script setup lang="ts">
import { useBangumiStore } from '@/stores'
import { generateRandomClassName, useDialogOptimization } from '@/utils'
import { RefreshLeft } from '@element-plus/icons-vue'
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

const bangumiStore = useBangumiStore()

// 是否启用番剧更新提示
const updateIsEnable = ref(bangumiStore.updateIsEnable)
const setEnable = () => {
  bangumiStore.updateSetEnable(updateIsEnable.value)
}

// 番剧更新提示持久保留
const updateIsPersistent = ref(bangumiStore.updateIsPersistent)
const setPersistent = () => {
  bangumiStore.updateSetPersistent(updateIsPersistent.value)
}

// 限制番剧更新提示显示个数
const updateLimitShowNumber = ref(bangumiStore.updateLimitShowNumber)
const setShowNumber = () => {
  bangumiStore.updateSetShowNumber(updateLimitShowNumber.value)
}

const clearUpdateRead = () => {
  bangumiStore.updateClearReadHash()
  ElMessage({
    type: 'success',
    offset: 66,
    message: '已清空'
  })
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
        <div class="lable">番剧更新提示</div>
        <el-row :gutter="20" style="align-items: center">
          <el-col :span="8">
            <el-checkbox
              v-model="updateIsEnable"
              label="启用"
              @change="setEnable"
            />
          </el-col>
          <el-col :span="16">
            <el-checkbox
              v-model="updateIsPersistent"
              label="提示持久保留"
              :disabled="!updateIsEnable"
              @change="setPersistent"
            />
          </el-col>
        </el-row>
        <div class="lable" style="margin-top: 5px">
          显示前 {{ updateLimitShowNumber }} 条更新记录
        </div>
        <el-input-number
          v-model="updateLimitShowNumber"
          :step="1"
          step-strictly
          :min="1"
          :disabled="!updateIsEnable"
          size="small"
          @change="setShowNumber"
        ></el-input-number>
        <el-button
          type="info"
          size="small"
          round
          :icon="RefreshLeft"
          style="margin-top: 20px"
          @click="clearUpdateRead"
        >
          清空提示的已读记录
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.row {
  margin-bottom: 10px;
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
