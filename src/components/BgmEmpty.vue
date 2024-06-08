<script setup lang="ts">
import { bgmPlaceholder } from '@/config'

defineProps<{
  description: string
}>()
</script>
<template>
  <el-empty :description="description">
    <template #image>
      <el-image class="bgm-img" :src="bgmPlaceholder"></el-image>
    </template>
    <slot></slot>
  </el-empty>
</template>

<style lang="scss" scoped>
.bgm-img {
  border-radius: 10px;
  :deep() {
    .el-image__inner.is-loading {
      display: none;
    }
    .el-image__wrapper,
    .el-image__error {
      position: static;
      width: 100%;
      aspect-ratio: 1 / 1.35;
      transition: background-color 0.5s;
    }
  }
}
</style>
