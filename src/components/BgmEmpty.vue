<script setup lang="ts">
import { bgmPlaceholder } from '@/config'

defineProps<{
  description?: string
}>()
</script>
<template>
  <div class="bgm-empty">
    <el-image class="empty-img" :src="bgmPlaceholder" fit="cover"></el-image>
    <div class="empty-description" v-if="description != null">
      {{ description }}
    </div>
    <div class="slot-box">
      <slot></slot>
    </div>
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
  margin-top: 20px;
  color: var(--color-text-soft);
}

.slot-box {
  margin-top: 20px;
}
</style>
