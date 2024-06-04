<script setup lang="ts">
import type { BgmData } from '@/types/bangumi'
import { ref, computed } from 'vue'
import { useBangumiStore } from '@/stores'

const props = defineProps<{
  dataList: BgmData[]
  // 默认排序
  sort: 'week' | 'score' | 'date'
}>()

// 控制排序的变量
const sortValue = ref<'week' | 'score' | 'date'>(props.sort)
const isAsc = ref(false) // 是否升序，一般是倒序

const changeSort = (sort: 'week' | 'score' | 'date') => {
  sortValue.value = sort
}
const toggleIsAsc = () => {
  isAsc.value = !isAsc.value
}

const bangumiStore = useBangumiStore()
const sortedDataList = computed(() => {
  switch (sortValue.value) {
    case 'week':
      return bangumiStore.sortByWeekday(props.dataList, isAsc.value)
    case 'score':
      return bangumiStore.sortByScore(props.dataList, isAsc.value)
    case 'date':
      return bangumiStore.sortByDate(props.dataList, isAsc.value)
    default:
      return bangumiStore.sortByScore(props.dataList, isAsc.value)
  }
})
</script>
<template>
  <div>
    <div class="sort-switch">
      <el-switch
        :modelValue="isAsc"
        inline-prompt
        active-text="升序排序"
        inactive-text="倒序排序"
        style="
          --el-switch-on-color: var(--el-color-primary);
          --el-switch-off-color: var(--el-color-success);
        "
        @mousedown="toggleIsAsc()"
      />
      <el-divider direction="vertical" />
      <el-switch
        :modelValue="sortValue === 'week'"
        inline-prompt
        active-text="星期"
        inactive-text="星期"
        style="--el-switch-on-color: var(--el-color-danger)"
        @mousedown="changeSort('week')"
      />
      <el-switch
        :modelValue="sortValue === 'date'"
        inline-prompt
        active-text="日期"
        inactive-text="日期"
        style="--el-switch-on-color: var(--el-color-info)"
        @mousedown="changeSort('date')"
      />
      <el-switch
        :modelValue="sortValue === 'score'"
        inline-prompt
        active-text="评分"
        inactive-text="评分"
        style="--el-switch-on-color: var(--el-color-warning)"
        @mousedown="changeSort('score')"
      />
    </div>
    <el-row :gutter="20" :key="sortValue + isAsc">
      <el-col
        :xs="12"
        :sm="8"
        :md="6"
        :xl="4"
        v-for="item in sortedDataList"
        :key="item.id"
      >
        <BgmCard :data="item"></BgmCard>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.sort-switch {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  .lable {
    font-weight: bold;
  }
  .el-switch {
    margin: 0 3px;
  }
}
</style>
