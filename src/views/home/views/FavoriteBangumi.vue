<script setup lang="ts">
import { useFavoriteStore, useSettingStore } from '@/stores'
import type { BgmData } from '@/types'
import { onMounted, ref } from 'vue'

const favoriteStore = useFavoriteStore()
const settingStore = useSettingStore()

const bgmList = ref<BgmData[]>([])
const guessLikeBgmList = ref<BgmData[]>([])

onMounted(() => {
  bgmList.value = favoriteStore.favBgmList
  if (settingStore.showSimilarBgms) {
    guessLikeBgmList.value = favoriteStore.getGuessLikeBgmList()
  }
})
</script>
<template>
  <div>
    <template v-if="bgmList.length">
      <BgmList
        :dataList="bgmList"
        couldSortNone
        sort="none"
        group
        :sortNoneLable="['番剧', '收藏']"
      ></BgmList>
      <template v-if="settingStore.showSimilarBgms">
        <el-divider content-position="left">
          <div class="guess-like-title">猜你喜欢</div>
        </el-divider>
        <BgmList
          :dataList="guessLikeBgmList"
          notSort
          :limitRow="settingStore.limitSimilarBgms"
        ></BgmList>
      </template>
    </template>
    <BgmEmpty v-else description="暂无番剧收藏"></BgmEmpty>
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
