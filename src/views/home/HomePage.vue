<script setup lang="ts">
import { useBangumiStore } from '@/stores'
import { computed } from 'vue'

const bangumiStore = useBangumiStore()

const dataList = computed(() => {
  return bangumiStore.getBgmListByIds([
    '428735',
    '386809',
    '425591',
    '385209',
    '376703',
    '404804',
    '328609',
    '354682',
    '381793'
  ])
})
</script>
<template>
  <div>
    <el-row :gutter="20">
      <el-col
        :xs="12"
        :sm="8"
        :md="6"
        :xl="4"
        v-for="bgm in dataList"
        :key="bgm.id"
      >
        <BgmCard :data="bgm"></BgmCard>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped></style>
