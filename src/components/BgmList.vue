<script setup lang="ts">
import type { BgmData } from '@/types/bangumi'
import { ref, computed } from 'vue'
import { useBangumiStore } from '@/stores'

const props = withDefaults(
  defineProps<{
    dataList: BgmData[]
    // 默认排序
    sort?: 'week' | 'score' | 'date'
    asc?: boolean
    group?: boolean
  }>(),
  {
    sort: 'score',
    asc: false,
    group: false
  }
)

// 控制排序的变量
const sortValue = ref<'week' | 'score' | 'date'>(props.sort)
const isAsc = ref(props.asc) // 是否升序，一般是倒序
const isGroup = ref(props.group)

// 切换排序后要重置数量控制
const changeSort = (sort: 'week' | 'score' | 'date') => {
  sortValue.value = sort
  resetShowNum()
}
const toggleIsAsc = () => {
  isAsc.value = !isAsc.value
  resetShowNum()
}
const toggleIsGroup = () => {
  isGroup.value = !isGroup.value
  resetShowNum()
}

const bangumiStore = useBangumiStore()
const bgmGroupList = computed(() => {
  // return bangumiStore.groupByWeekday(props.dataList, isAsc.value)
  switch (sortValue.value) {
    case 'week':
      return bangumiStore.groupByWeekday(props.dataList, isAsc.value)
    case 'score':
      return bangumiStore.groupByScore(props.dataList, isAsc.value)
    case 'date':
      return bangumiStore.groupByDate(props.dataList, isAsc.value)
    default:
      return bangumiStore.groupByScore(props.dataList, isAsc.value)
  }
})

// 数量控制
const showNum = ref(12)
// 数量控制后的数据
const handledGroupList = computed(() => {
  return bangumiStore.handleBgmShowNumInGroupList(
    bgmGroupList.value,
    showNum.value,
    isGroup.value
  )
})
// 滚动增加数据
const scrollLoad = () => {
  showNum.value += 12
}
// 重置数量控制
const resetShowNum = () => {
  showNum.value = 12
}
// 导出
defineExpose({
  resetShowNum
})
</script>
<template>
  <div>
    <div class="sort-switch">
      <el-switch
        :modelValue="isAsc"
        inline-prompt
        active-text="升序"
        inactive-text="降序"
        style="--el-switch-off-color: var(--el-color-success)"
        @mousedown="toggleIsAsc()"
      />
      <el-switch
        :modelValue="isGroup"
        inline-prompt
        active-text="分组"
        inactive-text="分组"
        @mousedown="toggleIsGroup()"
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
    <!-- 分组渲染 -->
    <el-row
      :gutter="20"
      :key="sortValue + isAsc + isGroup"
      v-infinite-scroll="scrollLoad"
      :infinite-scroll-distance="200"
      :infinite-scroll-delay="0"
    >
      <template v-for="(group, index) in handledGroupList" :key="index">
        <BgmGroupItem
          :group="group"
          :showLable="isGroup"
          :sortScore="sortValue === 'date'"
        ></BgmGroupItem>
      </template>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.sort-switch {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  .el-switch {
    margin: 0 3px;
  }
}
</style>
