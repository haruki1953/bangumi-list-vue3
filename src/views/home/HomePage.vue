<script setup lang="ts">
import { useBangumiStore } from '@/stores'

const bangumiStore = useBangumiStore()
</script>
<template>
  <div>
    <BgmList :dataList="bangumiStore.bgmListOnHome" sort="week"></BgmList>
  </div>
</template>

<style lang="scss" scoped></style>
