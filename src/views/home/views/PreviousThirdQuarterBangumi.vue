<script setup lang="ts">
import { useBangumiStore } from '@/stores'
import { computed } from 'vue'

const bangumiStore = useBangumiStore()

const bgmList = computed(() => {
  const { previousThirdQuarter } = bangumiStore.quarterPreviousInfo
  return bangumiStore.getQuarterBgms(previousThirdQuarter.key)
})
</script>
<template>
  <div>
    <BgmList v-if="bgmList.length" :dataList="bgmList"></BgmList>
    <BgmEmpty v-else description="暂无番剧"></BgmEmpty>
  </div>
</template>

<style lang="scss" scoped></style>
