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
    >
      <el-button type="info" size="small" round class="sort-button">
        更多设置
      </el-button>
    </BgmList>
    <!-- <BgmList
      v-if="bangumiStore.bgmListOnHome.length"
      :dataList="bangumiStore.bgmListOnHome"
      sort="none"
      group
      couldSortNone
      :sortNoneLable="['七月', '新番']"
    ></BgmList> -->
    <BgmEmpty v-else description="首页暂无番剧"></BgmEmpty>
  </div>
</template>

<style lang="scss" scoped></style>
