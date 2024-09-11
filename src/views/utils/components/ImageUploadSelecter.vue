<script lang="ts" setup>
import type { UploadFile, UploadUserFile } from 'element-plus'
import { Plus, Back, Right, Delete } from '@element-plus/icons-vue'

defineProps<{
  limit?: number
}>()

const model = defineModel<UploadUserFile[]>({ required: true })

const couldFileMove = (file: UploadFile, move: 'left' | 'right') => {
  // 找到文件在数组中的位置
  const index = model.value.indexOf(file)
  if (index !== -1) {
    if (move === 'left' && index > 0) {
      return true
    } else if (move === 'right' && index < model.value.length - 1) {
      return true
    }
  }
  return false
}
const handleFileMove = async (file: UploadFile, move: 'left' | 'right') => {
  // 找到文件在数组中的位置
  const index = model.value.indexOf(file)

  // 如果文件在数组中
  if (index !== -1) {
    const delAndwait = async () => {
      // 从数组中删除文件并保存
      const removedFile = model.value.splice(index, 1)[0]
      await new Promise((resolve) => setTimeout(resolve, 400)) // 等动画生效
      return removedFile
    }
    // 如果向左移动
    if (move === 'left' && index > 0) {
      const removedFile = await delAndwait()
      // 在左边插入文件
      model.value.splice(index - 1, 0, removedFile)
    }
    // 如果向右移动
    else if (move === 'right' && index < model.value.length - 1) {
      const removedFile = await delAndwait()
      // 在右边插入文件
      model.value.splice(index + 1, 0, removedFile)
    }
  }
}

const handleFileRemove = (file: UploadFile) => {
  model.value = model.value.filter((item) => item.uid !== file.uid)
}
</script>
<template>
  <div class="image-upload-selecter">
    <div
      class="upload"
      :class="{ 'is-limited': limit && model.length >= limit }"
    >
      <el-upload
        multiple
        :auto-upload="false"
        accept="image/*"
        v-model:file-list="model"
        list-type="picture-card"
        drag
        :limit="limit"
      >
        <el-icon class="uploader-icon"><Plus /></el-icon>
        <span class="uploader-text">添加图片</span>
        <template #file="{ file }">
          <div>
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url"
              :alt="file.name"
            />
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handleFileMove(file, 'left')"
                v-if="couldFileMove(file, 'left')"
              >
                <el-icon><Back /></el-icon>
              </span>
              <span
                class="el-upload-list__item-delete"
                @click="handleFileRemove(file)"
              >
                <el-icon><Delete /></el-icon>
              </span>
              <span
                class="el-upload-list__item-delete"
                @click="handleFileMove(file, 'right')"
                v-if="couldFileMove(file, 'right')"
              >
                <el-icon><Right /></el-icon>
              </span>
            </span>
          </div>
        </template>
      </el-upload>
    </div>
  </div>
</template>
<style lang="scss" scoped>
$upload-img-width: 300px;
$upload-img-height: 135px;
.upload {
  &.is-limited {
    :deep() {
      .el-upload--picture-card {
        display: none;
      }
    }
  }
  :deep() {
    .el-upload-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-content: center;
      .el-upload-list__item {
        width: auto;
        max-width: $upload-img-width;
        min-width: $upload-img-height;
        height: $upload-img-height;
        display: flex;
        justify-content: center;
        margin: 8px;
        background-color: var(--color-background);
        transition: all 0.5s;
        img {
          background-color: transparent;
        }
      }
    }
    .el-upload {
      width: $upload-img-width;
      height: $upload-img-height;
      margin: 8px;
      border: 2px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      background-color: transparent;
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
    .el-upload-list__item-thumbnail {
      background-color: var(--el-fill-color-blank);
    }
  }
}
</style>
