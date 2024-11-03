<script setup lang="ts">
import { useBangumiStore, useSettingStore } from '@/stores'
import { computed } from 'vue'

const bangumiStore = useBangumiStore()
const settingStore = useSettingStore()

const bgmDataList = computed(() => {
  return bangumiStore.bgmListOnHome
})
const listOptimization = computed(() => {
  if (settingStore.isHomeShowSameAlistPathBgm) {
    return ['SameAlistPathMergeWhenGroupByWeekday' as const]
  } else {
    return ['SameAlistPathRemovingOlderBgm' as const]
  }
})
</script>
<template>
  <div>
    <BgmList
      v-if="bgmDataList.length"
      :dataList="bgmDataList"
      sort="week"
      group
      :optimization="listOptimization"
    >
    </BgmList>
    <BgmEmpty v-else description="暂无番剧"></BgmEmpty>
  </div>
</template>

<style lang="scss" scoped></style>
