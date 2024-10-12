<script setup lang="ts">
import { useBangumiStore } from '@/stores'
import { computed } from 'vue'

const bangumiStore = useBangumiStore()

const bgmList = computed(() => {
  const { previousFirstQuarter } = bangumiStore.quarterPreviousInfo
  return bangumiStore.getQuarterBgms(previousFirstQuarter.key)
})
</script>
<template>
  <div>
    <BgmList v-if="bgmList.length" :dataList="bgmList"></BgmList>
    <BgmEmpty v-else description="暂无番剧"></BgmEmpty>
  </div>
</template>

<style lang="scss" scoped></style>
