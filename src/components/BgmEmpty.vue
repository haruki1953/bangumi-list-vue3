<script setup lang="ts">
import { bgmPlaceholder } from '@/config'

defineProps<{
  description: string
}>()
</script>
<template>
  <div class="bgm-empty">
    <el-image class="empty-img" :src="bgmPlaceholder" fit="cover"></el-image>
    <div class="empty-description">{{ description }}</div>
  </div>
</template>

<style lang="scss" scoped>
.bgm-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}

.empty-img {
  display: block;
  width: 100%;
  max-width: 160px;
  border-radius: 10px;
  aspect-ratio: 1 / 1.35;
  margin-bottom: 20px;
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

.empty-description {
  color: var(--color-text-soft);
}
</style>
