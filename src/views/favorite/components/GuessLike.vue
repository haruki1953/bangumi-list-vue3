<script setup lang="ts">
import { useFavoriteStore } from '@/stores'
import type { BgmData } from '@/types/bangumi'
import { onMounted, ref } from 'vue'

const favoriteStore = useFavoriteStore()

const bgmList = ref<BgmData[]>([])

const getBgmCount = () => {
  const width = window.innerWidth
  if (width < 768) return 4 // xs
  if (width < 992) return 6 // sm~md
  if (width < 1920) return 4 // md~xl
  return 6 // xl
}

const loadBgmList = () => {
  const count = getBgmCount()
  bgmList.value = favoriteStore.getGuessLikeBgmList(count)
}

onMounted(() => {
  loadBgmList()
})
</script>
<template>
  <div>
    <el-divider content-position="left">
      <div class="guess-like-title">猜你喜欢</div>
    </el-divider>
    <el-row :gutter="20">
      <el-col
        :xs="12"
        :sm="8"
        :md="6"
        :xl="4"
        v-for="item in bgmList"
        :key="item.id"
      >
        <BgmCard :data="item"></BgmCard>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.el-divider {
  margin-bottom: 36px;
  transition: all 0.5s;
  --el-border-color: var(--color-border);
  .guess-like-title {
    font-size: 20px;
    font-weight: bold;
    background-color: var(--color-background);
    color: var(--color-text);
    transition:
      background-color 0.5s,
      color 0.2s;
  }
  :deep() {
    .el-divider__text {
      background-color: var(--color-background);
      transition: all 0.5s;
    }
  }
}
</style>
