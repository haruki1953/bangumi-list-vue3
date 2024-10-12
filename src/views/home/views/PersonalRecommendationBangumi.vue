<script setup lang="ts">
import { useBangumiStore, useSettingStore } from '@/stores'
import { getRandomElements } from '@/utils'
import { computed } from 'vue'

const settingStore = useSettingStore()
const bangumiStore = useBangumiStore()

const bgmList = computed(() => {
  return bangumiStore.personalRecommendationBangumiDatas
})

const guessLikeBgmList = computed(() => {
  const someBgms = bangumiStore.getBgmListByIds(
    getRandomElements(bangumiStore.personalRecommendationBangumi, 3)
  )
  return bangumiStore.getSimilarBgms({
    comparisonBgms: someBgms,
    excludeBgms: bangumiStore.personalRecommendationBangumi
  })
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
        :sortNoneLable="['私心', '推荐']"
      ></BgmList>
      <template v-if="settingStore.showSimilarBgms">
        <el-divider content-position="left">
          <div class="guess-like-title">更多番剧</div>
        </el-divider>
        <BgmList
          :dataList="guessLikeBgmList"
          notSort
          :limitRow="settingStore.limitSimilarBgms"
        ></BgmList>
      </template>
      <!-- <GuessLike></GuessLike> -->
    </template>
    <BgmEmpty v-else description="暂无番剧"></BgmEmpty>
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
