<script setup lang="ts">
import { useBangumiStore } from '@/stores'

const bangumiStore = useBangumiStore()
</script>
<template>
  <div>
    <BgmList
      v-if="bangumiStore.bgmListOnHome.length"
      :dataList="bangumiStore.bgmListOnHome"
      sort="week"
      group
    ></BgmList>
    <BgmEmpty v-else description="首页暂无番剧"></BgmEmpty>
  </div>
</template>

<style lang="scss" scoped></style>
