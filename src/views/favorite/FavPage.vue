<script setup lang="ts">
import { useFavoriteStore } from '@/stores'
import GuessLike from './components/GuessLike.vue'

const favoriteStore = useFavoriteStore()
</script>
<template>
  <div>
    <template v-if="favoriteStore.favBgmList.length">
      <BgmList :dataList="favoriteStore.favBgmList"></BgmList>
      <GuessLike></GuessLike>
    </template>
    <BgmEmpty v-else description="暂无收藏番剧"></BgmEmpty>
  </div>
</template>

<style lang="scss" scoped></style>
